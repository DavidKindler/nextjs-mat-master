import Link from 'next/link'
import Head from 'next/head'
import axios from 'axios'

import DefaultLayout from '../components/layout'
import { Layout, Menu, Breadcrumb } from 'antd'
const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

const Apps = props => {
  return (
    <DefaultLayout page={'apps'}>
      <Head>
        <title>About page</title>
      </Head>
      <Layout>
        <Sider className='site-layout-background'>
          <Menu node='inline'>
            <Menu.Item>nav 1</Menu.Item>
            <Menu.Item>nav 2</Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <h1>About Page</h1>
          <Content>
            {' '}
            <code>
              <pre>{JSON.stringify(props.apps, null, 2)}</pre>
            </code>
          </Content>
        </Layout>
      </Layout>
    </DefaultLayout>
  )
}

const query = `{
  apps {
    _id
    app
    url
    roles
  } 
}`

Apps.getInitialProps = async () => {
  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.prod.API_URL
      : process.env.dev.API_URL
  const response = await axios.post(`${apiUrl}/api/graphql`, {
    query
  })
  return { ...response.data.data }
}

export default Apps
