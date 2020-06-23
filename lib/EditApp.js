import React, { useState } from 'react'
import { Descriptions, Row, Col, Button, Form, Input, Select, Card } from 'antd'
import { ONE_APP_QUERY } from '../lib/graphql-gql'
import { useQuery } from '@apollo/react-hooks'
import styles from './EditApp.module.css'

const r = /^(http|https):\/\/[^ "]+$/

const EditApp = props => {
  const [urlInput, setUrlInput] = useState(props.app.url)
  const [validUrl, setValidUrl] = useState(true)
  const [newRole, setNewRole] = useState('')
  const { loading: loadingA, error: errorA, data: dataA, refetch } = useQuery(
    ONE_APP_QUERY,
    {
      variables: { appInput: { app: props.app.app } }
    }
  )

  const urlHandler = e => {
    setUrlInput(e.target.value)
    setValidUrl(r.test(e.target.value))
  }

  const handlerChangeRoleInput = e => {
    setNewRole(e.target.value.toUpperCase())
  }

  const deleteRoleHandler = role => {
    // console.log('deleteRole', role)
    const newRoles = app.roles.filter(r => r !== role)
    props.onDeleteRoleFromApp({
      variables: {
        appRoles: { _id: app._id, roles: newRoles }
      }
    })
  }

  const addRoleHandler = role => {
    // console.log('add new role', role)
    const newRoles = app.roles.concat(role.toUpperCase())
    props.onAddRoleToApp({
      variables: {
        appRoles: { _id: app._id, roles: newRoles }
      }
    })
    setNewRole('')
  }
  // if (loadingA || errorA) return null
  const app = loadingA ? {} : dataA.app
  return (
    <>
      <Row>
        <Col span={12} offset={6}>
          <Card bordered={false}>
            <Descriptions title='App Details' size={'small'}>
              <Descriptions.Item label='App'>{app.app}</Descriptions.Item>
              <Descriptions.Item label='Url'>
                <Form layout='inline'>
                  <Form.Item>
                    <div
                      // style={{ margin: '5px 0' }}
                      className={validUrl ? styles.correct : styles.incorrect}
                    >
                      <Input
                        // size='small'
                        onChange={urlHandler}
                        value={urlInput}
                        className={styles.nooutline}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type='primary'
                      htmlType='submit'
                      disabled={!validUrl}
                      // onClick={() => props.onSubmit({ variables: { newApp: newApp } })}
                      onClick={() =>
                        props.onUpdateUrl({
                          variables: {
                            newUrl: { _id: app._id, url: urlInput }
                          }
                        })
                      }
                    >
                      Update
                    </Button>
                  </Form.Item>
                </Form>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={6}>
          <Card bordered={false}>
            {app.roles &&
              app.roles.map((role, id) => (
                <Form layout='inline' style={{ marginBottom: 10 }}>
                  <Form.Item key={id} label='Role' style={{ minWidth: 222 }}>
                    {role}
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type='danger'
                      htmlType='submit'
                      onClick={() => deleteRoleHandler(role)}
                    >
                      Delete
                    </Button>
                  </Form.Item>
                </Form>
              ))}
            <Form layout='inline' style={{ marginBottom: 10 }}>
              <Form.Item label='Role' style={{ minWidth: 200 }}>
                <Input value={newRole} onChange={handlerChangeRoleInput} />
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  onClick={() => addRoleHandler(newRole)}
                >
                  Add Role
                </Button>
              </Form.Item>
            </Form>
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

export default EditApp
