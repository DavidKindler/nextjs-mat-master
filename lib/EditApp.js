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

const EditApp = props => {
  const { app } = props
  // const handleRoleChange = (newRole, app) => {
  //   console.log('handleRoleChange newRole', newRole)
  //   console.log('handleRoleChange for app', app)
  //   console.log('handleRoleChange for user', user)
  //   // props.handleRoleChange({ newRole, app, user })
  // }

  // const handleDeleteRole = app => {
  //   if (window.confirm('Are you sure?')) {
  //     console.log('handleDeleteRole for app', app)
  //     console.log('handleDeleteRole for user', user)
  //     // props.handleDeleteRole({ newRole: null, app, user })
  //   }
  // }

  return (
    <>
      <Row>
        <Col span={12} offset={6}>
          <Card bordered={false}>
            <Descriptions title='App Details' size={'small'}>
              <Descriptions.Item label='App'>{app.app}</Descriptions.Item>
              <Descriptions.Item label='Url'>{app.url}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={6}>
          <Card bordered={false}>
            {app.roles &&
              app.roles.map((role, id) => <div key={id}>Role: {role}</div>)}
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

export default EditApp
