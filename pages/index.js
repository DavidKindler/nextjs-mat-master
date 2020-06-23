import { Layout, Row, Col, Card } from 'antd'
import Link from 'next/link'
import Head from 'next/head'
import { getConfigData } from '../lib/getConfigData'
import DefaultLayout from '../components/layout'
import { useQuery } from '@apollo/react-hooks'
import { ALL_APPS_QUERY } from '../lib/graphql-gql'

export default ({ allConfigData }) => {
  const { data, loading, error } = useQuery(ALL_APPS_QUERY)

  if (loading || error) return null

  return (
    <DefaultLayout page={'home'}>
      <Head>
        <title>Master App </title>
      </Head>
      <Layout style={{ padding: '0 20px' }}>
        <h2>MAT Apps</h2>
        {/* <Row gutter={16}> */}
        {/* <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}> */}
        <Row gutter={{ xs: 8, sm: 16 }}>
          {data.apps.map(app => (
            <Col span={8} style={{ marginBottom: 15 }}>
              <Card
                key={app.app}
                title={app.app}
                extra={
                  <a href={app.url} target='_blank'>
                    More
                  </a>
                }
                // style={{ width: 300 }}
              >
                {app.url}
              </Card>
            </Col>
          ))}
        </Row>
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
