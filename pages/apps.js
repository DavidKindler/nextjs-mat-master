import { useState } from 'react'
import _ from 'lodash'
import Head from 'next/head'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import AddApp from '../lib/AddApp'
import DeleteApp from '../lib/DeleteApp'

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

const ALL_APPS_QUERY = gql`
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

const DELETE_APP = gql`
  mutation deleteApp($deleteApp: DeleteAppInput!) {
    deleteApp(input: $deleteApp) {
      deleted
      _id
    }
  }
`

const Apps = props => {
  const [appnameInput, setAppnameInput] = useState('')
  const [filteredApps, setFilteredApps] = useState([])
  const [modal, setModal] = useState({ state: false, Component: null })
  const { data, loading, error } = useQuery(ALL_APPS_QUERY, {
    onCompleted: () => {
      setFilteredApps(data.apps)
    }
  })
  const [addAppToDB, newApp] = useMutation(ADD_APP, {
    update (cache, { data: { newApp } }) {
      // console.log(cache.readQuery({ query: ALL_APPS_QUERY }))
      const { apps } = cache.readQuery({ query: ALL_APPS_QUERY })
      const newAppsArray = apps.concat([newApp])
      console.log('newAppsArray', _.sortBy(newAppsArray, ['app']))
      cache.writeQuery({
        query: ALL_APPS_QUERY,
        data: { apps: _.sortBy(newAppsArray, ['app']) }
      })
      setFilteredApps(_.sortBy(newAppsArray, ['app']))
    }
  })
  const [deleteAppFromDB, deleteApp] = useMutation(DELETE_APP, {
    update (cache, { data: { deleteApp } }) {
      const { apps } = cache.readQuery({ query: ALL_APPS_QUERY })

      // console.log('deleteApp', deleteApp)
      const newAppsArray = _.remove(apps, function (n) {
        return n._id !== deleteApp._id
      })
      // console.log('newAppsArray', _.sortBy(newAppsArray, ['app']))

      cache.writeQuery({
        query: ALL_APPS_QUERY,
        data: { apps: _.sortBy(newAppsArray, ['app']) }
      })
      setFilteredApps(_.sortBy(newAppsArray, ['app']))
    }
  })

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
      sorter: (a, b) => {
        // return a.app.toUpperCase() - b.app.toUpperCase()
        var nameA = a.app.toLowerCase() // ignore upper and lowercase
        var nameB = b.app.toLowerCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }

        // names must be equal
        return 0
      }
    },
    {
      title: 'url',
      dataIndex: 'url',
      key: 'url',
      sorter: (a, b) => {
        // return a.url.toUpperCase() - b.url.toUpperCase()
        var nameA = a.url.toLowerCase() // ignore upper and lowercase
        var nameB = b.url.toLowerCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }

        // names must be equal
        return 0
      }
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
      title: 'Update',
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
                deleteAppHandler(record)
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
  const onSubmitAddApp = input => {
    // console.log('input', input)
    setModal({ state: false, Component: null })
    addAppToDB(input)
  }
  const onSubmitDeleteApp = input => {
    // console.log('input', input)
    setModal({ state: false, Component: null })
    deleteAppFromDB(input)
  }

  const addAppHandler = () => {
    setModal({
      state: true,
      Component: <AddApp onCancel={onCancel} onSubmit={onSubmitAddApp} />
    })
  }

  const deleteAppHandler = app => {
    setModal({
      state: true,
      Component: (
        <DeleteApp onCancel={onCancel} onSubmit={onSubmitDeleteApp} app={app} />
      )
    })
  }

  let render = () => {
    if (loading || newApp.loading) {
      return <h2>Loading...</h2>
    }
    if (error || newApp.error) {
      return <pre>{error}</pre>
    }
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
