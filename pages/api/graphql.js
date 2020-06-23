import { ApolloServer, gql } from 'apollo-server-micro'
import Cors from 'micro-cors'
const { db } = require('../../lib/nedb')

const typeDefs = gql`
  type Query {
    apps: [App]
    app(input: AppInput!): App!
    rolesUnique: [String]
    rolesForApp(input: AppInput!): Roles
    providers: [String]
    users: [User]
    user(input: UserInput!): User
  }
  type Mutation {
    newApp(input: NewAppInput!): App!
    deleteApp(input: DeleteAppInput!): AppDeleted!
    updateAppRoles(input: UpdateAppRolesInput!): App!
    updateAppUrl(input: UpdateAppUrlInput!): App!
    newUser(input: NewUserInput!): User!
    deleteUser(input: DeleteUserInput!): UserDeleted!
    addUserRights(input: NewUserRights!): User!
    removeUserRights(input: RemoveUserRights!): User!
    updateUserRole(input: UpdateUserRoleInput!): User!
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

  input UpdateAppUrlInput {
    _id: ID!
    url: String!
  }

  input UpdateAppRolesInput {
    _id: ID!
    roles: [String]!
  }

  input DeleteAppInput {
    _id: ID!
  }

  input EditRoleInput {
    app: String
    role: String
  }

  input AppInput {
    app: String
    _id: ID
  }

  input UserInput {
    _id: String
    username: String
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
    rights: RightInput!
  }

  input RemoveUserRights {
    _id: ID!
    rights: RightInput!
  }

  input UpdateUserRoleInput {
    _id: ID!
    right: NewRoleInput!
  }

  input RoleInput {
    app: String!
    role: String!
  }

  input RightInput {
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
    updateAppRoles: async (_parent, { input }, _context) => {
      var r = input.roles.map(role => role.toUpperCase())
      var uniqueRoles = Array.from(new Set(r))
      let x = await _context.db.update(
        { _id: input._id },
        { $set: { roles: uniqueRoles } },
        { returnUpdatedDocs: true }
      )
      return x
    },
    updateAppUrl: async (_parent, { input }, _context) => {
      return await _context.db.update(
        { _id: input._id },
        { $set: { url: input.url } },
        { returnUpdatedDocs: true }
      )
    },
    newUser: async (_parent, { input }, _context) => {
      const x = await _context.db.insert(input)
      console.log('new user', JSON.stringify(x, null, 2))
      return x
    },
    deleteUser: async (_parent, { input }, _context) => {
      let x = await _context.db.remove(input)
      return { deleted: !!x, ...input }
    },
    addUserRights: async (_parent, { input }, _context) => {
      const x = await _context.db.update(
        { _id: input._id },
        { $addToSet: { rights: input.rights } },
        { returnUpdatedDocs: true }
      )
      console.log('addUserRights', JSON.stringify(x, null, 2))
      return x
    },
    removeUserRights: async (_parent, { input }, _context) => {
      const x = await _context.db.update(
        { _id: input._id },
        { $pull: { rights: input.rights } },
        { returnUpdatedDocs: true }
      )
      console.log('removeUserRights ', JSON.stringify(x, null, 2))
      return x
    },
    updateUserRole: async (_parent, { input }, _context) => {
      const y = await _context.db.findOne({ _id: input._id })
      const newRights = y.rights.map(right =>
        right.app === input.right.app ? input.right : right
      )
      const x = await _context.db.update(
        { _id: input._id },
        { $set: { rights: newRights } },
        { returnUpdatedDocs: true }
      )
      console.log('updateUserRole ', JSON.stringify(x, null, 2))
      return x
    }
  },
  Query: {
    apps: async (_parent, { input }, _context) => {
      return await _context.db.find({ app: { $exists: true } }).sort({ app: 1 })
    },
    app: async (_parent, { input }, _context) => {
      return await _context.db.findOne({
        $or: [{ app: input.app }, { _id: input._id }]
      })
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
      return await _context.db.findOne({
        $or: [{ username: input.username }, { _id: input._id }]
      })
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
