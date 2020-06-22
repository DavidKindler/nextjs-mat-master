import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { Descriptions, Row, Col, Button, Form, Select, Card } from 'antd'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { ONE_USER_QUERY, ALL_APPS_QUERY } from '../lib/graphql-gql'
import GetRoles from './GetRoles'
import AddNewAppToUser from './AddNewAppToUser'

const EditUser = props => {
  // const { user } = props
  const { data, loading, error } = useQuery(ALL_APPS_QUERY)
  const { loading: loadingU, error: errorU, data: dataU, refetch } = useQuery(
    ONE_USER_QUERY,
    {
      variables: { userInput: { username: props.user && props.user.username } }
    }
  )

  const handleRoleChange = (newRole, app) => {
    console.log('handleRoleChange newRole', newRole)
    console.log('handleRoleChange for app', app)
    console.log('handleRoleChange for user', user)
    props.onChangeRoleToUser({
      _id: user._id,
      right: { app: app, role: newRole }
    })
  }

  const handleDeleteRight = app => {
    if (window.confirm('Are you sure?')) {
      console.log('handleDeleteRole for app', app)
      console.log('handleDeleteRole for user', user)
      console.log('props are now1', props)
      props.onDeleteRightToUser({ app, user })
    }
  }

  const handleAddNewRight = right => {
    console.log('handleAddNewRight for right', right)
    console.log('handleAddNewRight for user', user)
    console.log('props are now3', props)
    props.onAddRightToUser({ right, user })
    // addUserRights({
    //   variables: { newRights: { _id: user._id, rights: right } }
    // })
  }

  if (loading || loadingU || error || errorU) return null
  const allApps = data.apps
  const user = dataU.user
  // console.log('edituser allApps', allApps)
  // console.log('edituser user', user)
  // console.log('one_user_query', dataU)
  // console.log('props are now3', props)
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
                      rolesForApp={_.find(allApps, { app: right.app })}
                      app={right.app}
                      userId={user._id}
                      currentRole={right.role}
                      handleRoleChange={handleRoleChange}
                      handleDeleteRight={handleDeleteRight}
                    />
                  </Form>
                </Row>
              ))}
            <AddNewAppToUser
              user={user}
              allApps={allApps}
              handleAddNewRight={handleAddNewRight}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={6}>
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
