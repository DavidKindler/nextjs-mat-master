import { useState } from 'react'
import _ from 'lodash'
import Head from 'next/head'
// import axios from 'axios'
import { useQuery, useMutation } from '@apollo/react-hooks'
// import gql from 'graphql-tag'
import { gql } from 'apollo-boost'
import AddApp from '../lib/AddApp'

import DefaultLayout from '../components/layout'
import { Layout, Menu, Table, Tag, Input, Button } from 'antd'

const { SubMenu } = Menu
const { Content, Sider } = Layout
import { PlusCircleOutlined, FilterOutlined } from '@ant-design/icons'

// import AuthHelper from '../auth/AuthHelper'
// import EditApp from './EditApp'
// import AddApp from './AddApp'
// import DeleteApp from './DeleteApp'
// import CustomError from '../components/CustomError'

const query = gql`
  query allApps {
    apps {
      _id
      app
      url
      roles
    }
  }
`

const ADD_APP = gql`
  mutation addApp($newApp: NewAppInput!) {
    newApp(input: $newApp) {
      _id
      app
      url
      roles
    }
  }
`
// const apiUrl =
//   process.env.NODE_ENV === 'production'
//     ? process.env.prod.API_URL
//     : process.env.dev.API_URL

const Apps = props => {
  const [appnameInput, setAppnameInput] = useState('')
  const [filteredApps, setFilteredApps] = useState([])
  const [modal, setModal] = useState({ state: false, Component: null })
  const { data, loading, error } = useQuery(query, {
    onCompleted: () => {
      setFilteredApps(data.apps)
    }
  })
  const [addAppToDB, { results, loadingApp, errorAddApp }] = useMutation(
    ADD_APP
  )

  // const [apps, setApps] = useState(props.data.apps)
  const ALL_APPS = loading ? [] : data.apps

  // console.log('data', data)
  // console.log('apps', apps)
  // console.log('roles', roles)
  // console.log('filteredApps', filteredApps)
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

  const findApp = e => {
    setAppnameInput(e.target.value)
    let results = _.filter(ALL_APPS, o => {
      return _.includes(o.app.toUpperCase(), e.target.value.toUpperCase())
    })
    setFilteredApps(results)
  }

  const filterApps = async app => {
    const result = _.filter(ALL_APPS, app)
    setFilteredApps(result)
    setAppnameInput('')
  }

  const showAllApps = () => {
    setFilteredApps(ALL_APPS)
    setAppnameInput('')
  }

  const onCancel = () => {
    setModal({ state: false, Component: null })
  }
  const onSubmit = (query, input) => {
    console.log('query', query)
    console.log('input', input)
    setModal({ state: false, Component: null })
    addAppToDB(input)
  }

  const addAppHandler = () => {
    setModal({
      state: true,
      Component: <AddApp onCancel={onCancel} onSubmit={onSubmit} />
    })
    console.log('add app with')
  }

  let render = () => {
    if (loading) {
      return <h1>Loading...</h1>
    }
    if (error) {
      return <h1>{error}</h1>
    }
    console.log('filteredApps', filteredApps)
    return (
      <Table
        columns={columns}
        dataSource={filteredApps}
        rowKey={record => record._id}
      />
    )
  }

  if (modal.state) {
    return (
      <DefaultLayout page={'apps'}>
        <Head>
          <title>Add New App</title>
        </Head>
        <Layout>{modal.Component}</Layout>
      </DefaultLayout>
    )
  }
  return (
    <DefaultLayout page={'apps'}>
      <Head>
        <title>Master/Apps</title>
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
              <Button onClick={addAppHandler} block>
                Add App <PlusCircleOutlined />
              </Button>
            </div>
            <div style={{ padding: '10px' }}>
              <Input
                size='large'
                onChange={findApp}
                placeholder='Find App'
                value={appnameInput}
              />
            </div>

            <Menu.Item key='all-apps' onClick={showAllApps}>
              <span>All Apps</span>
            </Menu.Item>

            <SubMenu
              key='sub2'
              // title={<span>{/* <Icon type='filter' /> Applications */}</span>}
              title={
                <span>
                  <FilterOutlined />
                  Applications
                </span>
              }
            >
              {ALL_APPS &&
                ALL_APPS.map(app => {
                  return (
                    <Menu.Item key={app._id} onClick={() => filterApps(app)}>
                      {app.app}
                    </Menu.Item>
                  )
                })}
            </SubMenu>
          </Menu>
        </Sider>

        <Content style={{ padding: '0 24px 24px' }}>{render()}</Content>
      </Layout>
    </DefaultLayout>
  )
}

export default Apps
