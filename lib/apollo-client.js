// import { ApolloClient } from 'apollo-client'
import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.prod.API_URL
    : process.env.dev.API_URL

const link = new HttpLink({ uri: `${apiUrl}/api/graphql` })
const cache = new InMemoryCache()
// const client = new ApolloClient({ link, cache })
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `${apiUrl}/api/graphql`
})

export default client
