import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

const apiUrl = process.env.API_URL

const link = new HttpLink({ uri: `${apiUrl}/api/graphql`, fetch: fetch })
const cache = new InMemoryCache()
// const client = new ApolloClient({ link, cache })
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `${apiUrl}/api/graphql`
})

export default client
