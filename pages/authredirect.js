import Link from 'next/link'
import Head from 'next/head'
import DefaultLayout from '../components/layout'
import { Layout, Menu, Breadcrumb } from 'antd'

// const AuthRedirect = () => {
//   return (
//     <DefaultLayout page={'authredirect'}>
//       <Head>
//         <title>Auth redirect</title>
//       </Head>
//       <Layout>
//         <h1>Auth Redirect</h1>
//       </Layout>
//     </DefaultLayout>
//   )
// }

// export default AuthRedirectya

// import React from 'react'
// // import AuthHelper from './AuthHelper'
// import './url-search-params'
// // import { Redirect } from 'react-router-dom'

class AuthRedirect extends React.Component {
  constructor () {
    super()

    this.state = {
      errorResponse: null,
      token: null
    }
    // this.Auth = new AuthHelper()
  }

  componentDidMount () {
    // console.log(window.location)
    console.log('auth redirect page', window.location)
    const searchParams = new URLSearchParams(window.location.search)
    const token = searchParams.get('token')
    const redirect = searchParams.get('redirecturl') || '/'
    console.log('token received', token)
    console.log('redirect received', redirect)
    if (token) {
      this.setState({ token })
      // this.Auth.setToken(token)
      console.log('this props.history', this.props.history)
      // this.props.history.push(redirect)
      // window.location.href = redirect
    } else {
      // this.props.history.replace('/login')
      // this.setState({ errorResponse: "NOT AUTHORIZED" })
      // <Redirect to={{ pathname: "/login", state: { errorMessage: "NOT AUTHORIZED" } }} />
      // <Redirect to="/login" />
      this.setState({ errorResponse: true })
    }
  }

  render () {
    return (
      <DefaultLayout page={'authredirect'}>
        <Head>
          <title>Auth redirect</title>
        </Head>
        <Layout>
          <h1>Auth Redirect</h1>
          <div>
            <pre>{JSON.stringify(this.state.token, null, 2)}</pre>
          </div>
        </Layout>
      </DefaultLayout>
    )
    // return this.state.errorResponse ? (
    //   <Redirect
    //     to={{ pathname: '/login', state: { errorMessage: 'NOT AUTHORIZED' } }}
    //   />
    // ) : (
    //   <div />
    // )
  }
}

export default AuthRedirect
