import { ApolloServer, gql } from 'apollo-server-micro'
import Cors from 'micro-cors'
// import knex from "knex";
const { Models, Op } = require('../../lib/db')

const typeDefs = gql`
  type Query {
    apps(input: AppInput): [App]
    roles: [Role]
    users: [User]
  }

  type App {
    id: ID!
    app: String!
    url: String
  }
  input AppInput {
    name: String!
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
  }
`

const resolvers = {
  Query: {
    apps: async (_parent, { input }, _context) => {
      console.log('args', input)
      if (input && input.name) {
        return await _context.Models.Apps.findAll({
          where: {
            app: input.name
          }
        })
      } else {
        return await _context.Models.Apps.findAll()
      }
    },
    roles: async (_parent, args, _context) => {
      return await _context.Models.Roles.findAll()
    },
    users: async (_parent, args, _context) => {
      return await _context.Models.Users.findAll()
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
