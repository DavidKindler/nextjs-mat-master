import { Layout } from 'antd'
import Head from 'next/head'
import { getConfigData } from '../lib/getConfigData'
import DefaultLayout from '../components/layout'

export default ({ allConfigData }) => {
  return (
    <DefaultLayout page={'home'}>
      <Head>
        <title>Home Page</title>
      </Head>
      <Layout>
        <h2>Home page here</h2>
      </Layout>
    </DefaultLayout>
  )
}

export async function getStaticProps () {
  // Get external data from the file system, API, DB, etc.
  const allConfigData = getConfigData()

  // The value of the `props` key will be
  //  passed to the `Home` component
  return {
    props: { allConfigData }
  }
}
