import React, { Component } from 'react'
import AuthHelper from '../auth/AuthHelper'
import Head from 'next/head'
import { Button, Card, Alert } from 'antd'
import '../auth/url-search-params'
// import Router from 'next/router'
import Router, { withRouter } from 'next/router'

import DefaultLayout from '../components/layout'
import { Layout } from 'antd'
import { GithubOutlined } from '@ant-design/icons'

class Login extends Component {
  constructor () {
    super()

    this.state = {
      loggedIn: false,
      showError: false,
      showNullError: false,
      errorResponse: null,
      errorMessage: null,
      appurl: null,
      redirecturl: null
    }
    this.Auth = new AuthHelper()
  }

  componentDidMount () {
    const searchParams = new URLSearchParams(window.location.search)
    let prevUrl =
      this.props.history && this.props.history.length
        ? this.props.history[this.props.history.length - 1]
        : '/login'
    // let prevUrl = window.history.pushState(
    //   { prevUrl: window.location.href },
    //   null,
    //   '/login'
    //   )
    console.log('window prevurl', prevUrl)
    console.log(
      'redirecurl from search params',
      searchParams.get('redirecturl')
    )
    // console.log('props from withRouter', this.props.router)
    // console.log('props', this.props)
    // console.log('auth redirect page', window.location)
    const token = searchParams.get('token')
    const redirect =
      searchParams.get('redirecturl') !== null
        ? searchParams.get('redirecturl')
        : prevUrl
    console.log('token received', token)
    console.log('redirect received', redirect)
    if (token) {
      this.setState({ token })
      this.Auth.setToken(token)
      // Router.push(redirect)
      // console.log('this props.history', this.props.history)
      // this.props.history.push(redirect)
      window.location.href = redirect
    } else {
      // this.props.history.replace('/login')
      // this.setState({ errorResponse: "NOT AUTHORIZED" })
      // <Redirect to={{ pathname: "/login", state: { errorMessage: "NOT AUTHORIZED" } }} />
      // <Redirect to="/login" />
      // this.setState({ errorResponse: true })
    }

    // let redirect = '/'
    // try {
    //   redirect = location.state.from.pathname
    // } catch (e) {
    //   redirect = '/'
    // }
    this.setState({
      appurl: encodeURIComponent(`${window.location.origin}`),
      redirecturl: encodeURIComponent(`${window.location.origin}${redirect}`)
    })

    // if (this.Auth.loggedIn()) {
    //   this.props.history.replace('/')
    // }
  }

  render () {
    let { appurl, redirecturl } = this.state

    let uatURL = `${process.env.dev.REACT_APP_AUTH_URL}/api/auth/uat?appurl=${appurl}&redirecturl=${redirecturl}`
    let ghURL = `${process.env.dev.REACT_APP_AUTH_URL}/api/auth/github?appurl=${appurl}&redirecturl=${redirecturl}`

    const {
      // email,
      // showError,
      // loggedIn,
      // showNullError,
      errorResponse,
      errorMessage,
      loading
    } = this.state

    // if (!loggedIn) {
    return (
      <DefaultLayout page={'users'}>
        <Head>
          <title>Login page</title>
        </Head>
        <Layout>
          <div>
            <Card
              title='Login'
              bordered={false}
              style={{ maxWidth: 400, margin: '0 auto' }}
            >
              {/* <Form onSubmit={this.handleSubmit} className='login-form'> */}
              <p>Login via UAT SSO. You will be redirected back here.</p>
              <a href={uatURL}>
                <Button
                  block
                  style={{
                    background: 'white',
                    color: 'black',
                    margin: '10px 0'
                  }}
                >
                  <img
                    src='/images/nxp-logo.svg'
                    alt='UAT LOGIN'
                    style={{ height: '12px', marginRight: '2px' }}
                  />
                  UAT LOGIN
                </Button>
              </a>
              {process.env.NODE_ENV !== 'production' ? (
                <a href={ghURL}>
                  <Button
                    block
                    style={{
                      background: 'black',
                      color: 'white',
                      margin: '10px 0'
                    }}
                  >
                    <GithubOutlined />
                    Github
                  </Button>
                </a>
              ) : null}

              {/* Or <Link to="/register">Register</Link> */}
              {/* </Form> */}
              {errorResponse && <Alert message={errorResponse} type='error' />}
              {errorMessage && <Alert message={errorMessage} type='error' />}
            </Card>
          </div>
        </Layout>
      </DefaultLayout>
    )
  }
}

// const Login = Form.create({ name: 'normal_login' })(LoginForm)

export default withRouter(Login)
