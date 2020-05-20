import Head from 'next/head'
import axios from 'axios'

import DefaultLayout from '../components/layout'
import { Layout, Menu, Table, Tag, Input } from 'antd'
const { SubMenu } = Menu
const { Content, Sider } = Layout

import _ from 'lodash'
// import AuthHelper from '../auth/AuthHelper'
// import EditApp from './EditApp'
// import AddApp from './AddApp'
// import DeleteApp from './DeleteApp'
// import CustomError from '../components/CustomError'

const Apps = props => {
  const { apps } = props
  const columns = [
    {
      title: 'app',
      dataIndex: 'app',
      key: 'app',
      sorter: (a, b) => a.app.length - b.app.length
    },
    {
      title: 'url',
      dataIndex: 'url',
      key: 'url',
      sorter: (a, b) => a.url.length - b.url.length
    },
    {
      title: 'roles',
      key: 'roles',
      dataIndex: 'roles',
      render: function renderRoles (roles) {
        return (
          <span>
            {roles &&
              roles.map((role, id) => {
                return <Tag key={id}>{`${role.toUpperCase()}`}</Tag>
              })}
          </span>
        )
      }
    },
    {
      title: 'Edit',
      key: 'edit',
      dataIndex: 'edit',
      render: function renderEdit (text, record) {
        if (record.app.toUpperCase() === 'MASTER') {
          return (
            <>
              <Tag
                onClick={() => {
                  // editApp(record)
                  console.log(record)
                }}
                color={'cyan'}
              >
                Edit App
              </Tag>
            </>
          )
        }
        return (
          <>
            <Tag
              onClick={() => {
                // editApp(record)
                console.log(record)
              }}
              color={'cyan'}
            >
              Edit App
            </Tag>
            <Tag
              onClick={() => {
                // deleteApp(record)
                console.log(record)
              }}
              color={'red'}
            >
              Delete App
            </Tag>
          </>
        )
      }
    }
  ]

  let render = apps.length > 0 && (
    <Table
      // onClick={tableHandler}
      columns={columns}
      dataSource={apps}
      rowKey={record => record._id}
    />
  )

  return (
    <DefaultLayout page={'apps'}>
      <Head>
        <title>About page</title>
      </Head>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode='inline'
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <div style={{ padding: '10px' }}>
              {/* <AddApp handleParent={handleParentState} /> */}
            </div>
            <div style={{ padding: '10px' }}>
              <Input
                size='large'
                // onChange={findApp}
                placeholder='Find App'
                // value={appnameInput}
                value={'app name'}
              />
            </div>

            {/* <Menu.Item key='all-apps' onClick={showAllApps}> */}
            <Menu.Item key='all-apps'>
              {/* <Icon type='user' /> */}
              <span>All Apps</span>
            </Menu.Item>

            <SubMenu
              key='sub2'
              title={<span>{/* <Icon type='filter' /> Applications */}</span>}
            >
              {apps &&
                apps.map(app => {
                  return (
                    <Menu.Item
                      key={app._id}
                      // onClick={() => filterApps({ app: app.app })}
                    >
                      {app.app}
                    </Menu.Item>
                  )
                })}
            </SubMenu>
          </Menu>
        </Sider>

        <Layout>
          <h1>About Page</h1>
          <Content style={{ padding: '0 24px 24px' }}>
            {render}
            {/* <code>
              <pre>{JSON.stringify(props.apps, null, 2)}</pre>
            </code> */}
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
