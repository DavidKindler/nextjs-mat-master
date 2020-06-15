import { ApolloServer, gql } from 'apollo-server-micro'
import Cors from 'micro-cors'
const { db } = require('../../lib/nedb')

const typeDefs = gql`
  type Query {
    apps: [App]
    app(input: AppInput!): App
    rolesUnique: [String]
    rolesForApp(input: AppInput!): Roles
    providers: [String]
    users: [User]
    user(input: UserInput!): User
  }
  type Mutation {
    newApp(input: NewAppInput!): App!
    deleteApp(input: DeleteAppInput!): AppDeleted!
    updateApp(input: UpdateAppInput!): App!
    editAppUrl(input: EditAppUrlInput!): [App]!
    newUser(input: NewUserInput!): User!
    deleteUser(input: DeleteUserInput!): UserDeleted!
    updateUserRights(input: NewUserRights!): User!
  }

  type App {
    _id: ID!
    app: String!
    url: String
    roles: [String]
  }

  type AppDeleted {
    deleted: Boolean!
    _id: String!
  }

  type UserDeleted {
    deleted: Boolean!
    _id: String!
  }

  type User {
    _id: ID!
    username: String!
    email: String
    provider: String
    rights: [Right]
  }

  type Right {
    app: String
    role: String
  }

  type Roles {
    app: String!
    roles: [String]
  }

  input NewAppInput {
    app: String!
    url: String!
  }

  input NewRoleInput {
    app: String!
    role: String!
  }

  input EditAppUrlInput {
    _id: ID!
    url: String!
  }

  input DeleteAppInput {
    _id: ID!
  }

  input EditRoleInput {
    app: String
    role: String
  }

  input AppInput {
    app: String!
  }

  input UpdateAppInput {
    _id: ID!
    roles: [String]
  }

  input UserInput {
    username: String!
  }

  input DeleteUserInput {
    _id: String!
  }

  input NewUserInput {
    email: String!
    username: String!
    provider: String!
  }

  input NewUserRights {
    _id: ID!
    rights: NewRightInput!
  }

  input RoleInput {
    app: String!
    role: String!
  }

  input NewRightInput {
    app: String!
    role: String!
  }
`

const resolvers = {
  Mutation: {
    newApp: async (_parent, { input }, _context) => {
      const newInput = Object.assign(
        {},
        {
          ...input,
          app: input.app.toUpperCase(),
          roles: ['ADMIN', 'USER']
        }
      )
      return await _context.db.insert(newInput)
    },
    deleteApp: async (_parent, { input }, _context) => {
      let x = await _context.db.remove(input)
      return { deleted: !!x, ...input }
    },
    updateApp: async (_parent, { input }, _context) => {
      let x = await _context.db.update(
        { _id: input._id },
        { $set: { roles: input.roles } },
        { returnUpdatedDocs: true }
      )
      return x
    },
    editAppUrl: async (_parent, { input }, _context) => {
      return await _context.db.update(
        { _id: input._id },
        { $set: { url: input.url } },
        { returnUpdatedDocs: true }
      )
    },
    newUser: async (_parent, { input }, _context) => {
      return await _context.db.insert(input)
    },
    deleteUser: async (_parent, { input }, _context) => {
      let x = await _context.db.remove(input)
      return { deleted: !!x, ...input }
    },
    updateUserRights: async (_parent, { input }, _context) => {
      console.log('input is ', JSON.stringify(input, null, 2))
      return await _context.db.update(
        { _id: input._id },
        { $set: { rights: input.rights } }
      )
    }
  },
  Query: {
    apps: async (_parent, { input }, _context) => {
      return await _context.db.find({ app: { $exists: true } }).sort({ app: 1 })
    },

    app: async (_parent, { input }, _context) => {
      return await _context.db.findOne({ app: input.app })
    },
    rolesUnique: async (_parent, { input }, _context) => {
      let x = await db.find({ roles: { $exists: true } })
      let r = x.flatMap(y => y.roles)
      var uniqueRoles = Array.from(new Set(r))
      return uniqueRoles
    },
    providers: async (_parent, { input }, _context) => {
      let x = await db.find({ provider: { $exists: true } })
      let r = x.flatMap(y => y.provider)
      var uniqueProviders = Array.from(new Set(r)).filter(x => x !== 'GITHUB')
      return uniqueProviders
    },
    rolesForApp: async (_parent, { input }, _context) => {
      let x = await db.find({ app: input.app })
      let r = x.flatMap(y => y.roles)
      var uniqueRoles = Array.from(new Set(r))
      return { app: input.app, roles: uniqueRoles }
    },
    users: async (_parent, { input }, _context) => {
      return await db.find({ username: { $exists: true } })
    },
    user: async (_parent, { input }, _context) => {
      return await _context.db.findOne({ username: input.username })
    }
  }
}

const cors = Cors({
  allowMethods: ['GET', 'POST', 'DELETE']
})

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { db }
  }
})

const handler = apolloServer.createHandler({ path: '/api/graphql' })

export const config = {
  // not sure what this does but it is needed
  api: {
    bodyParser: false // do not change. graphql api will not respond if set to true
  }
}

export default cors(handler)
