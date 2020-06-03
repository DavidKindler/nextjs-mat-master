import 'antd/dist/antd.css'
import './global.css'
import App from 'next/app'
import { ApolloProvider } from '@apollo/react-hooks'
import client from '../lib/apollo-client'

class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  state = {
    history: [] // keep history items in state
  }

  componentDidMount () {
    const { asPath } = this.props.router

    // lets add initial route to `history`
    this.setState(prevState => ({ history: [...prevState.history, asPath] }))
  }

  componentDidUpdate () {
    const { history } = this.state
    const { asPath } = this.props.router

    // if current route (`asPath`) does not equal
    // the latest item in the history,
    // it is changed so lets save it
    if (history[history.length - 1] !== asPath) {
      this.setState(prevState => ({ history: [...prevState.history, asPath] }))
    }
  }
  // ({ Component, pageProps }) {
  render () {
    const { Component, pageProps } = this.props
    return (
      <ApolloProvider client={client}>
        <Component history={this.state.history} {...pageProps} />
      </ApolloProvider>
    )
  }
}

export default MyApp
