import 'antd/dist/antd.css'
import './global.css'
import { ApolloProvider } from '@apollo/react-hooks'
import client from '../lib/apollo-client'

export default function MyApp ({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
