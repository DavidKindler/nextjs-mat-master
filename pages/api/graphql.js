import { ApolloServer, gql } from 'apollo-server-micro'
import Cors from 'micro-cors'
const Sequelize = require('sequelize')
import DataLoader from 'dataloader'
// import knex from "knex";
const {
  getAppsAndRoles,
  Users,
  Rights,
  Roles,
  Apps,
  APPS,
  ROLES
} = require('../../lib/db')

// export default (req, res) => {
//   res.status(200).json({ text: 'Hello graphql' })
// }

const typeDefs = gql`
  type Query {
    apps: [App]
    roles: [Role]
  }

  type App {
    id: ID!
    app: String!
    url: String
  }

  type Role {
    id: ID!
    app: String!
    role: String!
    appId: ID!
  }
`

const resolvers = {
  Query: {
    apps: async () => {
      return await Apps.findAll()
    },
    roles: async () => {
      return await Roles.findAll()
    }
  }
  // apps: async (_parent, args, _context) => {
  //   return await Apps.findAll()
  // }
  // }
}

// const typeDefs = gql`
//   type Query {
//     albums(first: Int = 25, skip: Int = 0): [Album!]!
//   }
//   type Artist {
//     id: ID!
//     name: String!
//     url: String!
//     albums(first: Int = 25, skip: Int = 0): [Album!]!
//   }
//   type Album {
//     id: ID!
//     name: String!
//     year: String!
//     artist: Artist!
//   }
// `

// const resolvers = {
//   Query: {
//     albums: (_parent, args, _context) => {
//       return db
//         .select('*')
//         .from('albums')
//         .orderBy('year', 'asc')
//         .limit(Math.min(args.first, 50))
//         .offset(args.skip)
//     }
//   },

//   Album: {
//     id: (album, _args, _context) => album.id,
//     artist: (album, _args, { loader }) => {
//       // return db
//       //   .select("*")
//       //   .from("artists")
//       //   .where({ id: album.artist_id })
//       //   .first();
//       return loader.artist.load(album.artist_id)
//     }
//   },

//   Artist: {
//     id: (artist, _args, _context) => artist.id,
//     albums: (artist, args, _context) => {
//       return db
//         .select('*')
//         .from('albums')
//         .where({ artist_id: artist.id })
//         .orderBy('year', 'asc')
//         .limit(Math.min(args.first, 50))
//         .offset(args.skip)
//     }
//   }
// }

// const loader = {
//   apps: new DataLoader(() => {
//     return [
//       {
//         id: '123',
//         app: 'App Name',
//         url: 'http://goobar'
//       },
//       {
//         id: '234',
//         app: 'foobar',
//         url: 'http://foobar'
//       }
//     ]
//   })
// }

// const loader = {
//   apps: new DataLoader(async () => {
//     return await Apps.findAll()
//   })
// }

const cors = Cors({
  allowMethods: ['GET', 'POST', 'OPTIONS']
})

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
  // context: () => {
  //   return { loader }
  // }
})

const handler = apolloServer.createHandler({ path: '/api/graphql' })

export const config = {
  api: {
    bodyParser: false
  }
}

export default cors(handler)
