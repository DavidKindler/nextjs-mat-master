import React, { Component } from 'react'
import AuthHelper from '../auth/AuthHelper'
import { Form, Button, Card, Alert, Spin } from 'antd'
import {
  // HomeOutlined,
  // SettingFilled,
  // SmileOutlined,
  // SyncOutlined,
  // LoadingOutlined,
  GithubOutlined
} from '@ant-design/icons'
class Login extends Component {
  constructor () {
    super()

    this.state = {
      // email: '',
      // password: '',
      loggedIn: false,
      showError: false,
      showNullError: false,
      errorResponse: null,
      errorMessage: null,
      loading: false,
      appurl: null,
      redirecturl: null
    }
    this.Auth = new AuthHelper()
  }

  componentDidMount () {
    let redirect = '/'
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
      // <div style={{ background: '#ECECEC', padding: '30px', height: 'calc(100vh - 49px)' }}>
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
          {errorResponse && !loading && (
            <Alert message={errorResponse} type='error' />
          )}
          {errorMessage && !loading && (
            <Alert message={errorMessage} type='error' />
          )}

          {loading && (
            <Spin tip='Loading...'>
              <Alert message='Loading' type='info' />
            </Spin>
          )}
        </Card>
      </div>
    )
    // }
    // return <Redirect to={`/userProfile/${email}`} />
  }
}

// const Login = Form.create({ name: 'normal_login' })(LoginForm)

export default Login
