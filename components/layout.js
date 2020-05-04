import styles from './layout.module.css'
import Head from 'next/head'
import Link from 'next/link'
import { Layout, Menu, Breadcrumb } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const name = 'Your Name'
export const siteTitle = 'Next.js Sample Website'

function DefaultLayout({ children, page }) {
  return (
    <>
      {/* // <div className={styles.container}> */}
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='description'
          content='Learn how to build a personal website using Next.js'
        />

        <title>{siteTitle}</title>
        <meta name='og:title' content={siteTitle} />
      </Head>
      <Layout>
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={page}>
            <Menu.Item key="home"><Link href="/"><a>Home</a></Link></Menu.Item>
            <Menu.Item key="about"><Link href="/about"><a>About</a></Link></Menu.Item>
            <Menu.Item key="first"><Link href="/posts/first"><a>First</a></Link></Menu.Item>
          </Menu>
        </Header>

        {children}

      </Layout>
    </>
  )
}

export default DefaultLayout
