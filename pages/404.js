import Head from 'next/head'
import DefaultLayout from '../components/layout'
import { Layout, Typography } from 'antd'
const { Title } = Typography

export default function Custom404 () {
  return (
    <DefaultLayout page={'fourohfour'}>
      <Head>
        <title>404 page</title>
      </Head>
      <Layout>
        <Title>404 - Page Not Found</Title>
      </Layout>
    </DefaultLayout>
  )
}
