import { useState } from 'react'
import Head from 'next/head'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import _ from 'lodash'

import DefaultLayout from '../components/layout'
import { Layout, Menu, Table, Tag, Input } from 'antd'
const { SubMenu } = Menu
const { Content, Sider } = Layout

// import AuthHelper from '../auth/AuthHelper'
// import EditApp from './EditApp'
// import AddApp from './AddApp'
// import DeleteApp from './DeleteApp'
// import CustomError from '../components/CustomError'

const query = gql`
  query Users {
    users {
      _id
      username
      email
      provider
    }
  }
`
// client.query({ query }).then(result => console.log('users', result.data.users))
const Users = props => {
  const [modal, setModal] = useState(false)
  const { data, loading, error } = useQuery(query)

  // const [apps, setApps] = useState(props.data.apps)
  // const [filteredApps, setFilteredApps] = useState([])
  // const { roles } = props.data.rolesUnique

  const columns = [
    {
      title: 'users',
      dataIndex: 'users',
      key: 'users',
      sorter: (a, b) => a.username.length - b.username.length
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'provider',
      dataIndex: 'provider',
      key: 'provider',
      sorter: (a, b) => a.provider.length - b.provider.length
    },
    {
      title: 'app | role',
      key: 'rights',
      dataIndex: 'rights',
      render: function renderRights (rights) {
        return (
          <span>
            {rights &&
              rights.map(right => {
                if (!right.app) return null
                let color = 'green'
                if (!right.role) {
                  color = 'cyan'
                }
                if (right.role.includes('ADMIN')) {
                  color = 'volcano'
                }
                return (
                  <Tag color={color} key={right.id}>
                    {`${right.app ? 'App: ' + right.app.toUpperCase() : ''} | ${
                      right.role ? 'Role: ' + right.role.toUpperCase() : ''
                    }`}
                  </Tag>
                )
              })}
          </span>
        )
      }
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'rights',
      render: function renderAction (rights, record) {
        return (
          <span>
            <Tag
              onClick={() => {
                getUser(record)
              }}
              color={'blue'}
            >
              Edit
            </Tag>
            <Tag
              onClick={() => {
                deleteUser(record)
              }}
              color={'cyan'}
            >
              Delete
            </Tag>
          </span>
        )
      }
    }
  ]

  // const filterApps = async app => {
  //   console.log('filter for app', app)
  //   const result = _.filter(apps, app)
  //   // console.log('response from findapp=>', result)
  //   setFilteredApps(result)
  // }

  // const showAllApps = async () => {
  //   const refreshedProps = await fetchData()
  //   // setApps(refreshedProps.data.apps)
  //   setFilteredApps(refreshedProps.data.apps)
  // }

  // let render = apps.length > 0 && (
  //   <Table
  //     // onClick={tableHandler}
  //     columns={columns}
  //     dataSource={filteredApps}
  //     rowKey={record => record._id}
  //   />
  // )
  let render = () => {
    if (loading) {
      return <h1>Loading...</h1>
    } else if (error) {
      return <h1>{error}</h1>
    } else {
      return (
        <code>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </code>
      )
    }
  }

  return (
    <DefaultLayout page={'users'}>
      <Head>
        <title>Users page</title>
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
              <Input
                size='large'
                // onChange={findUsers}
                placeholder='Find User'
                // value={usernameInput}
              />
            </div>

            {/* <Menu.Item key='all-users' onClick={showAllUsers}> */}
            <Menu.Item key='all-users'>
              {/* <Icon type='user' /> */}
              <span>All Users</span>
            </Menu.Item>
            <SubMenu
              key='sub1'
              title={
                <span>
                  {/* <Icon type='filter' /> */}
                  Roles
                </span>
              }
            >
              {/* {roles.map(role => (
                <Menu.Item
                  key={role.id}
                  onClick={() => filterRoles({ role: role.role })}
                >
                  {role.role}
                </Menu.Item>
              ))} */}
            </SubMenu>
            <SubMenu
              key='sub2'
              title={
                <span>
                  {/* <Icon type='filter' /> */}
                  Applications
                </span>
              }
            >
              {/* {allApps.map(app => (
                <Menu.Item
                  key={app.id}
                  onClick={() => filterApps({ app: app.app })}
                >
                  {app.app}
                </Menu.Item>
              ))} */}
            </SubMenu>
          </Menu>
        </Sider>
        {/* <Layout> */}
        <Content style={{ padding: '0 24px 24px' }}>{/* {render} */}</Content>
        {/* </Layout> */}
        {render()}
      </Layout>
    </DefaultLayout>
  )
}

export default Users
