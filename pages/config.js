import Head from 'next/head'
import { Layout } from 'antd'
import { getConfigData } from '../lib/getConfigData'
import DefaultLayout from '../components/layout'

export default ({ allConfigData }) => {
  return (
    <DefaultLayout page={'config'}>
      <Head>
        <title>Config `Page</title>
      </Head>
      <Layout>
        <h2>Example using local json file with initial settings </h2>
        <div>JSON DATA::: {JSON.stringify(allConfigData)}</div>
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
