import { ApolloServer, gql } from 'apollo-server-micro'
import Cors from 'micro-cors'
// import knex from "knex";
const { Models, Op } = require('../../lib/db')

const typeDefs = gql`
  type Query {
    apps: [App]
    app(input: AppInput!): App
    roles: [Role]
    users: [User]
    user(input: UserInput!): User
  }
  type Mutation {
    newApp(input: NewAppInput!): [App]!
    editAppUrl(input: EditAppUrlInput!): [App]!
  }

  type App {
    id: ID!
    app: String!
    url: String
    roles: [Role]
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
    id: ID!
    url: String!
  }

  input EditRoleInput {
    app: String
    role: String
  }

  input AppInput {
    id: ID
    app: String
  }

  input UserInput {
    id: ID!
  }

  type Role {
    id: ID!
    app: String!
    role: String!
    appId: ID!
  }

  type User {
    id: ID!
    email: String!
    username: String
    provider: String
    rights: [Right]
  }

  type Right {
    id: ID!
    userId: ID!
    username: String!
    email: String
    app: String!
    url: String
    role: String
  }
`

const resolvers = {
  Mutation: {
    newApp: async (_parent, { input }, _context) => {
      return await _context.Models.Apps.findOrCreate({
        where: { app: input.app },
        include: [{ model: _context.Models.Roles }],
        defaults: {
          app: input.app,
          url: input.url,
          roles: [
            { app: input.app, role: 'ADMIN' },
            { app: input.app, role: 'USER' }
          ]
        }
      }).spread((app, created) => {
        if (created) {
          return _context.Models.Apps.findAll({
            include: [{ model: _context.Models.Roles }],
            order: [
              [{ model: _context.Models.Roles, as: 'Roles' }, 'role', 'ASC']
            ]
          })
        } else {
          return new Error('app already exists')
        }
      })
    },
    editAppUrl: async (_parent, { input }, _context) => {
      return await _context.Models.Apps.update(
        {
          url: input.url
        },
        {
          where: { id: input.id }
        }
      ).then(async () => {
        return await _context.Models.Apps.findAll({
          include: [{ model: _context.Models.Roles }],
          order: [
            [{ model: _context.Models.Roles, as: 'Roles' }, 'role', 'ASC']
          ]
        })
      })
    }
  },
  Query: {
    apps: async (_parent, { input }, _context) => {
      if (input && input.name) {
        return await _context.Models.Apps.findAll({
          include: [{ model: _context.Models.Roles }],
          where: {
            app: input.name
          }
        })
      } else {
        return await _context.Models.Apps.findAll({
          include: [{ model: _context.Models.Roles }]
        })
      }
    },

    app: async (_parent, { input }, _context) => {
      let id = input.id ? input.id : null
      let app = input.app ? input.app : null
      return await _context.Models.Apps.findOne({
        where: {
          [Op.or]: [{ id: id }, { app: app }]
        }
      })
    },
    roles: async (_parent, args, _context) => {
      return await _context.Models.Roles.findAll()
    },
    users: async (_parent, { input }, _context) => {
      if (input && input.id) {
        return await _context.Models.Users.findAll({
          include: [{ model: _context.Models.Rights }],
          where: {
            id: input.id
          }
        })
      } else {
        return await _context.Models.Users.findAll({
          include: [{ model: _context.Models.Rights }]
        })
      }
    },
    user: async (_parent, { input }, _context) => {
      return await _context.Models.Users.findOne({
        include: [{ model: _context.Models.Rights }],
        where: {
          id: input.id
        }
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
    return { Models }
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
