import Link from 'next/link'
import Head from 'next/head'
import DefaultLayout from '../../components/layout'
import { Layout, Menu } from 'antd'
const { Sider, Content } = Layout;

const FirstPost = () => {
  return (
    <DefaultLayout page='first'>
      <Head>
        <title>First Post</title>
      </Head>
      <Layout>
        <Sider className="site-layout-background">
          <Menu node="inline">
            <Menu.Item>nav 1</Menu.Item>
            <Menu.Item>nav 2</Menu.Item>
          </Menu>

        </Sider>
        <Layout>
          <h1>First post</h1>
          <Content>Content here</Content>
        </Layout>
      </Layout>



    </DefaultLayout>
  )
}

export default FirstPost
