import React, { Component } from 'react'
import AuthHelper from '../auth/AuthHelper'
import Head from 'next/head'
import { Button, Card, Alert } from 'antd'
import '../auth/url-search-params'
import { withRouter } from 'next/router'
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
      redirecturl: null,
      token: null
    }
    this.Auth = new AuthHelper()
  }

  componentDidMount () {
    const searchParams = new URLSearchParams(window.location.search)
    const error = searchParams.get('error')
    if (error) {
      this.setState({ showError: true, errorResponse: error })
    }

    let prevUrl =
      this.props.history && this.props.history.length
        ? this.props.history[this.props.history.length - 1]
        : '/login'

    const token = searchParams.get('token')
    const redirect =
      searchParams.get('redirecturl') !== null
        ? searchParams.get('redirecturl')
        : prevUrl
    if (token) {
      this.setState({ token })
      this.Auth.setToken(token)
      window.location.href = redirect
    }
    this.setState({
      appurl: encodeURIComponent(`${window.location.origin}`),
      redirecturl: encodeURIComponent(`${window.location.origin}${redirect}`)
    })
  }

  render () {
    let { appurl, redirecturl, token, errorResponse, errorMessage } = this.state
    if (token) return <h2>Redirecting...</h2>
    let loggedIn = this.Auth.loggedIn()

    if (loggedIn)
      return (
        <DefaultLayout page={'login'}>
          <Head>
            <title>Login page</title>
          </Head>
          <Layout>
            <h2>Aleady logged in.</h2>
          </Layout>
        </DefaultLayout>
      )
    let uatURL = `${process.env.REACT_APP_AUTH_URL}/api/auth/uat?appurl=${appurl}&redirecturl=${redirecturl}`
    let ghURL = `${process.env.REACT_APP_AUTH_URL}/api/auth/github?appurl=${appurl}&redirecturl=${redirecturl}`

    let render = appurl ? (
      <Card
        title='Login'
        bordered={false}
        style={{ maxWidth: 400, margin: '0 auto' }}
      >
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

        {errorResponse && <Alert message={errorResponse} type='error' />}
        {/* {errorMessage && <Alert message={errorMessage} type='error' />} */}
      </Card>
    ) : null
    return (
      <DefaultLayout page={'login'}>
        <Head>
          <title>Login page</title>
        </Head>
        <Layout>{render}</Layout>
      </DefaultLayout>
    )
  }
}

export default withRouter(Login)
