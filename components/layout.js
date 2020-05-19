import styles from './layout.module.css'
import Head from 'next/head'
import Link from 'next/link'
import AuthHelper from '../auth/AuthHelper'
import { Layout, Menu } from 'antd'
import {
  // HomeOutlined,
  // SettingFilled,
  // SmileOutlined,
  // SyncOutlined,
  // LoadingOutlined,
  SettingOutlined
} from '@ant-design/icons'
const { SubMenu } = Menu
const { Header, Content, Sider } = Layout
const name = 'Your Name'
export const siteTitle = 'Next.js Sample Website'

function DefaultLayout ({ children, page }) {
  const Auth = new AuthHelper()
  let loggedIn = Auth.loggedIn()
  let adminRole = Auth.adminRole()

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
          <div className='logo' />
          <Menu theme='dark' mode='horizontal' defaultSelectedKeys={page}>
            <Menu.Item key='home'>
              <Link href='/'>
                <a>Home</a>
              </Link>
            </Menu.Item>
            <Menu.Item key='apps'>
              <Link href='/apps'>
                <a>Apps</a>
              </Link>
            </Menu.Item>
            <Menu.Item key='first'>
              <Link href='/posts/first'>
                <a>First</a>
              </Link>
            </Menu.Item>
            <SubMenu
              style={{ float: 'right' }}
              title={
                <span className='submenu-title-wrapper'>
                  <SettingOutlined />
                  Account
                </span>
              }
            >
              {!loggedIn && (
                <Menu.Item key='login'>
                  <Link href='/login'>
                    <a>Login</a>
                  </Link>
                </Menu.Item>
              )}

              {loggedIn && (
                <Menu.Item key='logout'>
                  <Link href='/logout'>
                    <a>Logout</a>
                  </Link>
                </Menu.Item>
              )}

              {loggedIn && (
                <Menu.Item key='verifyToken'>
                  <Link href='/verifyToken'>
                    <a>VerifyToken</a>
                  </Link>
                </Menu.Item>
              )}
            </SubMenu>
          </Menu>
        </Header>

        {children}
      </Layout>
    </>
  )
}

export default DefaultLayout
