import { useState } from 'react'
import Head from 'next/head'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  ALL_USERS_QUERY,
  ADD_USER,
  DELETE_USER,
  REMOVE_USER_RIGHTS,
  UPDATE_USER_RIGHT,
  ADD_USER_RIGHTS
} from '../lib/graphql-gql'
import _ from 'lodash'
import Router from 'next/router'
import AddUser from '../lib/AddUser'
import DeleteUser from '../lib/DeleteUser'
import EditUser from '../lib/EditUser'

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

// client.query({ query }).then(result => console.log('users', result.data.users))
const Users = props => {
  const [usernameInput, setUsernameInput] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  const [modal, setModal] = useState({ state: false, Component: null })
  const { data, loading, error } = useQuery(ALL_USERS_QUERY, {
    onCompleted: () => {
      // setFilteredUsers(data.users)
      setFilteredUsers(_.sortBy(data.users, ['username']))
    }
  })

  const [addUserToDB, newUser] = useMutation(ADD_USER, {
    update (cache, { data: { newUser } }) {
      const { users } = cache.readQuery({ query: ALL_USERS_QUERY })
      const newUsersArray = users.concat([newUser])
      const sortedUsers = _.sortBy(newUsersArray, ['username'])
      cache.writeQuery({
        query: ALL_USERS_QUERY,
        data: { users: sortedUsers }
      })
      setFilteredUsers(sortedUsers)
    }
  })
  const [addRightToUser, newRights] = useMutation(ADD_USER_RIGHTS, {
    update (cache, { data: { newRights } }) {
      const { users } = cache.readQuery({ query: ALL_USERS_QUERY })

      // const newUsersArray = _.remove(users, function (n) {
      //   return n._id !== deleteUser._id
      // })
      // console.log('users cache1', users)
      // console.log('newRights', newRights)
      const newUsersArray = users
      const sortedUsers = _.sortBy(newUsersArray, ['username'])
      cache.writeQuery({
        query: ALL_USERS_QUERY,
        data: { users: sortedUsers }
      })
      setFilteredUsers(sortedUsers)
    }
  })
  const [removeRightFromUser, removeRights] = useMutation(REMOVE_USER_RIGHTS, {
    update (cache, { data: { removeRights } }) {
      const { users } = cache.readQuery({ query: ALL_USERS_QUERY })

      // const newUsersArray = _.remove(users, function (n) {
      //   return n._id !== deleteUser._id
      // })
      // console.log('users cache2', users)
      // console.log('removeRights', removeRights)
      const newUsersArray = users
      const sortedUsers = _.sortBy(newUsersArray, ['username'])
      cache.writeQuery({
        query: ALL_USERS_QUERY,
        data: { users: sortedUsers }
      })
      setFilteredUsers(sortedUsers)
    }
  })

  const [updateRightToUser, udpateRights] = useMutation(UPDATE_USER_RIGHT, {
    update (cache, { data: { updateRights } }) {
      const { users } = cache.readQuery({ query: ALL_USERS_QUERY })

      // const newUsersArray = _.remove(users, function (n) {
      //   return n._id !== deleteUser._id
      // })
      // console.log('users cache2', users)
      // console.log('removeRights', removeRights)
      const newUsersArray = users
      const sortedUsers = _.sortBy(newUsersArray, ['username'])
      cache.writeQuery({
        query: ALL_USERS_QUERY,
        data: { users: sortedUsers }
      })
      setFilteredUsers(sortedUsers)
    }
  })

  const [deleteUserFromDB, deleteUser] = useMutation(DELETE_USER, {
    update (cache, { data: { deleteUser } }) {
      // console.log('deleteUser', deleteUser)
      const { users } = cache.readQuery({ query: ALL_USERS_QUERY })
      const newUsersArray = _.remove(users, function (n) {
        return n._id !== deleteUser._id
      })
      const sortedUsers = _.sortBy(newUsersArray, ['username'])
      cache.writeQuery({
        query: ALL_USERS_QUERY,
        data: { users: sortedUsers }
      })
      setFilteredUsers(sortedUsers)
    }
  })

  const ALL_USERS =
    loading || deleteUser.loading || newUser.loading ? [] : data.users

  const columns = [
    {
      title: 'username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => {
        // return a.app.toUpperCase() - b.app.toUpperCase()
        var nameA = a.username.toLowerCase() // ignore upper and lowercase
        var nameB = b.username.toLowerCase() // ignore upper and lowercase
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
      title: 'email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => {
        // return a.url.toUpperCase() - b.url.toUpperCase()
        var nameA = a.email.toLowerCase() // ignore upper and lowercase
        var nameB = b.email.toLowerCase() // ignore upper and lowercase
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
      title: 'provider',
      dataIndex: 'provider',
      key: 'provider'
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
                  <Tag color={color} key={Math.random()}>
                    {`${right.app ? 'App: ' + right.app.toUpperCase() : ''} | 
                    ${right.role ? 'Role: ' + right.role.toUpperCase() : ''}`}
                  </Tag>
                )
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
        return (
          <>
            <Tag
              onClick={() => {
                editUserHandler(record)
              }}
              color={'cyan'}
            >
              Edit User
            </Tag>
            <Tag
              onClick={() => {
                deleteUserHandler(record)
              }}
              color={'red'}
            >
              Delete User
            </Tag>
          </>
        )
      }
    }
  ]

  const findUser = e => {
    setUsernameInput(e.target.value)
    let results = _.filter(ALL_USERS, o => {
      return _.includes(o.username.toUpperCase(), e.target.value.toUpperCase())
    })
    setFilteredUsers(results)
  }

  const filterUsers = async user => {
    const result = _.filter(ALL_USERS, user)
    setFilteredUsers(result)
    setUsernameInput('')
  }

  const showAllUsers = () => {
    setFilteredUsers(ALL_USERS)
    setUsernameInput('')
  }

  const onCancel = () => {
    setModal({ state: false, Component: null })
  }
  const onSubmitAddUser = input => {
    // console.log('input', input)
    setModal({ state: false, Component: null })
    addUserToDB(input)
    // .then(
    //   res => console.log('add res', res),
    //   err => console.log('add err', err)
    // )
  }
  const onSubmitDeleteUser = input => {
    // console.log('input', input)
    if (window.confirm('Are you sure?')) {
      setModal({ state: false, Component: null })
      deleteUserFromDB(input)
    }
  }

  const onAddRightToUser = input => {
    // console.log('onAddRightToUser input', input)
    const id = input.user._id
    const right = input.right
    // console.log('onAddRightToUser input', id, right)

    addRightToUser({
      variables: { newRights: { _id: id, rights: right } }
    })
  }

  const onDeleteRightToUser = input => {
    const id = input.user._id
    const x = _.find(input.user.rights, { app: input.app })
    const right = { app: x.app, role: x.role }
    // console.log('onDeleteRightToUser input', id, right)

    removeRightFromUser({
      variables: { removeRights: { _id: id, rights: right } }
    })
  }

  const onChangeRoleToUser = input => {
    console.log('onChangeRoleToUser input', input)
    updateRightToUser({
      variables: { newRole: { _id: input._id, right: input.right } }
    })

    // setModal({ state: false, Component: null })
  }

  const addUserHandler = () => {
    setModal({
      state: true,
      Component: <AddUser onCancel={onCancel} onSubmit={onSubmitAddUser} />
    })
  }

  const deleteUserHandler = user => {
    setModal({
      state: true,
      Component: (
        <DeleteUser
          onCancel={onCancel}
          onSubmit={onSubmitDeleteUser}
          user={user}
        />
      )
    })
  }

  const editUserHandler = user => {
    setModal({
      state: true,
      Component: (
        <EditUser
          onCancel={onCancel}
          onAddRightToUser={onAddRightToUser}
          onDeleteRightToUser={onDeleteRightToUser}
          onChangeRoleToUser={onChangeRoleToUser}
          user={user}
        />
      )
    })
  }

  let render = () => {
    if (loading || newUser.loading || deleteUser.loading) {
      return <h2>Loading...</h2>
    }
    if (error || newUser.error || deleteUser.error) {
      const err = error
        ? error
        : newUser.error
        ? newUser.error
        : deleteUser.error
      return (
        <>
          <Button onClick={() => Router.push('/users')}>Go Back</Button>
          <pre>{JSON.stringify(err, null, 2)}</pre>
        </>
      )
    }
    return (
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey={record => record.username}
      />
    )
  }

  if (modal.state) {
    return (
      <DefaultLayout page={'users'}>
        <Head>
          <title>User</title>
        </Head>
        <Layout>{modal.Component}</Layout>
      </DefaultLayout>
    )
  }
  return (
    <DefaultLayout page={'users'}>
      <Head>
        <title>Master/Users</title>
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
              <Button onClick={addUserHandler} block>
                Add User <PlusCircleOutlined />
              </Button>
            </div>
            <div style={{ padding: '10px' }}>
              <Input
                size='large'
                onChange={findUser}
                placeholder='Find User'
                value={usernameInput}
              />
            </div>

            <Menu.Item key='all-users' onClick={showAllUsers}>
              <span>All Users</span>
            </Menu.Item>

            <SubMenu
              key='sub2'
              // title={<span>{/* <Icon type='filter' /> Applications */}</span>}
              title={
                <span>
                  <FilterOutlined />
                  Users
                </span>
              }
            >
              {ALL_USERS &&
                ALL_USERS.map(user => {
                  return (
                    <Menu.Item key={user._id} onClick={() => filterUsers(user)}>
                      {user.username}
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

export default Users
