import { Layout } from 'antd'
import Link from 'next/link'
import Head from 'next/head'
import { getConfigData } from '../lib/getConfigData'
import DefaultLayout from '../components/layout'

const fetcher = async url => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

export default ({ allConfigData }) => {
  const email = async () => {
    const x = await fetcher('/api/email')
    console.log(x)
  }

  return (
    <DefaultLayout page={'home'}>
      <Head>
        <title>Home Page</title>
      </Head>
      <Layout>
        <h2>Home page here</h2>

        <button onClick={email}>send email</button>
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
