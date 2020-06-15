import React, { useState } from 'react'
import { Descriptions, Row, Col, Button, Form, Select, Card } from 'antd'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const ROLES_FOR_APP = gql`
  query RolesForApp($appname: AppInput!) {
    rolesForApp(input: $appname) {
      app
      roles
    }
  }
`

const GetRoles = props => {
  // const roles = ['admin', 'wtf']
  const [currentRole, setCurrentRole] = useState(props.currentRole)
  const [rolesForApp, setRolesForApp] = useState([])

  const { data, loading, error } = useQuery(ROLES_FOR_APP, {
    variables: { appname: { app: props.app } },
    onCompleted: () => {
      // setFilteredUsers(data.users)
      console.log('getRoles data', data)
      setRolesForApp(data.rolesForApp.roles)
    }
  })

  const setNewRole = role => {
    setCurrentRole(role)
  }

  const handleChangeRole = () => {
    props.handleRoleChange(currentRole, props.app)
  }

  const handleDeleteRole = () => {
    props.handleDeleteRole(props.app)
  }
  if (loading || error) {
    return null
  }
  return (
    <>
      {/* // <Form layout='inline'> */}
      <Form.Item label='Role'>
        <Select
          value={currentRole}
          size={'small'}
          onChange={setNewRole}
          style={{ minWidth: '130px' }}
        >
          {rolesForApp &&
            rolesForApp.length > 0 &&
            rolesForApp.map((role, id) => (
              <Select.Option key={id} value={role}>
                {role}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button
          size='small'
          type='primary'
          htmlType='submit'
          onClick={handleChangeRole}
        >
          Update
        </Button>
      </Form.Item>
      <Form.Item>
        <Button
          size='small'
          type='danger'
          htmlType='submit'
          onClick={handleDeleteRole}
        >
          Delete
        </Button>
      </Form.Item>
      {/* </Form> */}
    </>
  )
}

const EditUser = props => {
  const { user } = props
  const handleRoleChange = (newRole, app) => {
    console.log('handleRoleChange newRole', newRole)
    console.log('handleRoleChange for app', app)
    console.log('handleRoleChange for user', user)
    // props.handleRoleChange({ newRole, app, user })
  }

  const handleDeleteRole = app => {
    if (window.confirm('Are you sure?')) {
      console.log('handleDeleteRole for app', app)
      console.log('handleDeleteRole for user', user)
      // props.handleDeleteRole({ newRole: null, app, user })
    }
  }

  return (
    <>
      <Row>
        <Col span={12} offset={6}>
          <Card bordered={false}>
            <Descriptions title='User Details' size={'small'}>
              <Descriptions.Item label='Username'>
                {user.username}
              </Descriptions.Item>
              <Descriptions.Item label='Email'>{user.email}</Descriptions.Item>
              <Descriptions.Item label='Provider'>
                {user.provider}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={6}>
          <Card bordered={false}>
            {user.rights &&
              user.rights.map((right, id) => (
                <Row key={id}>
                  <Form layout='inline'>
                    <Form.Item style={{ minWidth: 200 }} label='App'>
                      {right.app}
                    </Form.Item>
                    <GetRoles
                      app={right.app}
                      userId={user._id}
                      currentRole={right.role}
                      handleRoleChange={handleRoleChange}
                      handleDeleteRole={handleDeleteRole}
                    />
                  </Form>
                </Row>
              ))}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={6}>
          {/* <Button
            type='primary'
            htmlType='submit'
            style={{ margin: '5px 5px' }}
            onClick={() => {
              console.log('updated user', user)
              // props.onSubmit({
              //   variables: { editUser: { updatedUser: user } }
              // })
            }}
          >
            Submit
          </Button> */}
          <Button
            type='primary'
            onClick={() => props.onCancel()}
            style={{ margin: '5px 5px' }}
          >
            Return
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default EditUser
