import { ApolloServer, gql } from 'apollo-server-micro'
import Cors from 'micro-cors'
const { db } = require('../../lib/nedb')

const typeDefs = gql`
  type Query {
    apps: [App]
    app(input: AppInput!): App
    rolesUnique: [String]
    rolesForApp(input: AppInput): Roles
    users: [User]
    user(input: UserInput!): User
  }
  type Mutation {
    newApp(input: NewAppInput!): [App]!
    editAppUrl(input: EditAppUrlInput!): [App]!
    newUser(input: NewUserInput!): User!
    updateUserRights(input: NewUserRights!): User!
  }

  type App {
    _id: ID!
    app: String!
    url: String
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

  input EditRoleInput {
    app: String
    role: String
  }

  input AppInput {
    app: String
  }

  input UserInput {
    username: String!
  }

  input NewUserInput {
    email: String!
    username: String
    provider: String
  }

  input NewUserRights {
    _id: ID!
    rights: NewRightInput!
  }

  type Roles {
    app: String!
    roles: [String]
  }

  input RoleInput {
    app: String!
    role: String!
  }

  type User {
    _id: ID!
    email: String!
    username: String
    provider: String
    rights: [Right]
  }

  type Right {
    app: String
    role: String
  }

  input NewRightInput {
    app: String!
    role: String!
  }
`

const resolvers = {
  Mutation: {
    newApp: async (_parent, { input }, _context) => {
      return await _context.db.insert(appToAdd)
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
      return await _context.db.find({ app: { $exists: true } })
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
  // App: {
  //   roles: async (app, __, _context) => {
  //     console.log('app=>roles')
  //     return await _context.Models.Roles.findAll({
  //       where: { appId: app.id }
  //     })
  //   }
  // },
  // Right: {
  //   role: async (role, __, _context) => {
  //     console.log('right => a role')
  //     return await _context.Models.Roles.findOne({
  //       where: { userId: role.userId }
  //     })
  //   }
  // },
  // Role: {
  //   apps: async (role, __, _context) => {
  //     console.log('role ==> apps')
  //     return await _context.Models.Apps.findAll({
  //       // include: [{ model: _context.Models.Rights }],
  //       where: { id: role.appId }
  //     })
  //   }
  //   // users: async (role, __, _context) => {
  //   //   console.log('role ==> users', role)
  //   //   return await _context.Models.Users.findAll({
  //   //     include: [{ model: _context.Models.Rights }]
  //   //     // where: { id: role.userId }
  //   //   })
  //   // }
  // }
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
