import AuthHelper from '../auth/AuthHelper'
import Head from 'next/head'

import DefaultLayout from '../components/layout'
import { Layout } from 'antd'
const { Content } = Layout
import { StopOutlined, CheckOutlined } from '@ant-design/icons'

const dateSettings = {
  timeZone: 'America/Chicago',
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short'
}

let Auth = new AuthHelper()

const VerifyToken = props => {
  let token = Auth.getToken()
  if (!token) {
    return (
      <DefaultLayout page={'users'}>
        <Head>
          <title>Verify Token</title>
        </Head>
        <Layout>
          <Content style={{ padding: '0 24px 24px' }}>
            <h2>No token loaded</h2>
          </Content>
        </Layout>
      </DefaultLayout>
    )
  }
  let decodedToken = Auth.decodeTkn()
  console.log('Verify Token', decodedToken)
  let tokenExpired = Auth.isTokenExpired(token)

  let expirationTime = new Date(decodedToken['exp'] * 1000).toLocaleString(
    'en-US',
    dateSettings
  )
  let renderTokenExpired = tokenExpired ? (
    <span style={{ color: 'red' }}>
      <StopOutlined />
      &nbsp;{JSON.stringify(tokenExpired)}
    </span>
  ) : (
    <span style={{ color: 'green' }}>
      <CheckOutlined />
      &nbsp;{JSON.stringify(tokenExpired)}
    </span>
  )

  return (
    <DefaultLayout page={'users'}>
      <Head>
        <title>Verify Token</title>
      </Head>
      <Layout>
        <Content style={{ padding: '0 24px 24px' }}>
          <p>Expiration time: {expirationTime}</p>
          <p>
            Current time: {new Date().toLocaleString('en-US', dateSettings)}
          </p>
          <p>Token expired: {renderTokenExpired}</p>
          <code>
            Token payload <pre>{JSON.stringify(decodedToken, null, 2)}</pre>
          </code>
        </Content>
      </Layout>
    </DefaultLayout>
  )
}

export default VerifyToken
