import React, { useState } from 'react'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Row, Button, Form, Select } from 'antd'
const AddNewAppToUser = props => {
  const { user, allApps } = props
  const [rolesForApp, setRolesForApp] = useState([])
  const [newApp, setNewApp] = useState({ app: null, role: null })
  let newAppsAndRoles = []
  if (user && allApps) {
    const userHasRightsTo = user.rights
      ? user.rights.map(right => right.app)
      : null

    newAppsAndRoles = allApps.filter(app => {
      return !_.includes(userHasRightsTo, app.app)
    })
  }
  const handleNewApp = app => {
    setNewApp({ app: app, role: null })
    let newRoles = _.filter(allApps, { app: app })[0].roles
    setRolesForApp(newRoles)
  }

  const handleNewRole = role => {
    setNewApp({ ...newApp, role: role })
  }

  const handleSubmit = () => {
    // console.log('handlenewAppSubmit', user._id, newApp)
    if (newApp.app && newApp.role) {
      props.handleAddNewRight(newApp)
      setNewApp({ app: null, role: null })
    }
  }
  if (!newAppsAndRoles.length) return null
  if (!newApp.app) {
    return (
      <Button
        type='dashed'
        onClick={() => setNewApp({ app: ' ', role: ' ' })}
        style={{ width: '90%', marginRight: 8 }}
      >
        <PlusCircleOutlined /> Add new App
      </Button>
    )
  }

  return (
    <Form layout='inline'>
      <Row>
        <Form.Item label='App' style={{ minWidth: 200 }}>
          <Select value={newApp.app} size={'small'} onChange={handleNewApp}>
            {newAppsAndRoles.map(app => (
              <Select.Option key={Math.random()} value={app.app}>
                {app.app}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label='Role' style={{ minWidth: 200 }}>
          <Select value={newApp.role} size={'small'} onChange={handleNewRole}>
            {rolesForApp &&
              rolesForApp.map(role => (
                <Select.Option key={Math.random()} value={role}>
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
            disabled={!newApp.app || !newApp.role}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Form.Item>
      </Row>
    </Form>
  )
}

export default AddNewAppToUser
