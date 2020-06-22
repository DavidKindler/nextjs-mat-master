import React, { useState } from 'react'
import { Button, Form, Select } from 'antd'

const GetRoles = props => {
  const { rolesForApp } = props || []
  const [currentRole, setCurrentRole] = useState(props.currentRole)

  const setNewRole = role => {
    setCurrentRole(role)
  }

  const handleChangeRole = () => {
    props.handleRoleChange(currentRole, props.app)
  }

  const handleDeleteRight = () => {
    props.handleDeleteRight(props.app)
  }

  return (
    <>
      <Form.Item label='Role' style={{ minWidth: 200 }}>
        <Select
          value={currentRole}
          size={'small'}
          onChange={setNewRole}
          // style={{ minWidth: '130px' }}
        >
          {rolesForApp &&
            rolesForApp.roles.map((role, id) => (
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
          onClick={handleDeleteRight}
        >
          Delete
        </Button>
      </Form.Item>
    </>
  )
}

export default GetRoles
