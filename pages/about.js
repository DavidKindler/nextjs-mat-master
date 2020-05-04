import Link from 'next/link'
import Head from 'next/head'
import DefaultLayout from '../components/layout'
import { Layout, Menu, Breadcrumb } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


const About = () => {
  return (
    <DefaultLayout page={'about'}>
      <Head>
        <title>About page</title>
      </Head>
      <Layout>
        <h1>About Page</h1>
      </Layout>
    </DefaultLayout>
  )
}

export default About
