import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { Row, Col, Input, Button, Select } from 'antd'
import styles from './AddApp.module.css'

const PROVIDERS = gql`
  query Providers {
    providers
  }
`
const AddUser = props => {
  const { data, loading, error } = useQuery(PROVIDERS)

  const [newUser, setNewUser] = useState({
    username: null,
    email: null,
    provider: null
  })
  const [validEmail, setValidEmail] = useState(false)

  const reset = () => {
    setNewUser({ username: null, email: null, provider: null })
  }

  const usernameHandler = e => {
    setNewUser({ ...newUser, username: e.target.value })
  }

  const providerHandler = provider => {
    setNewUser({ ...newUser, provider: provider })
  }

  const emailHandler = e => {
    setNewUser({ ...newUser, email: e.target.value })
    const r = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
    setValidEmail(r.test(e.target.value))
  }

  return (
    <Row>
      <Col span={12} offset={6}>
        <div
          style={{ margin: '5px 0' }}
          className={newUser.username ? styles.correct : styles.incorrect}
        >
          <Input
            size='large'
            onChange={usernameHandler}
            placeholder='Username'
            value={newUser.username}
            className={styles.nooutline}
          />
        </div>
        <div
          style={{ margin: '5px 0' }}
          className={validEmail ? styles.correct : styles.incorrect}
        >
          <Input
            size='large'
            onChange={emailHandler}
            placeholder='Email'
            value={newUser.email}
            className={styles.nooutline}
          />
        </div>
        <div
          style={{ margin: '5px 0' }}
          // className={validEmail ? styles.correct : styles.incorrect}
        >
          <Select
            value={newUser.provider}
            size={'small'}
            onChange={providerHandler}
            style={{ width: 150 }}
          >
            {!loading &&
              data.providers.map((provider, id) => (
                <Option key={id} value={provider}>
                  {provider}
                </Option>
              ))}
          </Select>
        </div>
        <div>
          <Button
            type='primary'
            htmlType='submit'
            style={{ margin: '5px 5px' }}
            disabled={!(validEmail && newUser.username && newUser.provider)}
            onClick={() => props.onSubmit({ variables: { newUser: newUser } })}
          >
            Submit
          </Button>
          <Button onClick={reset} style={{ margin: '5px 5px' }}>
            Reset
          </Button>
          <Button
            type='link'
            onClick={() => props.onCancel()}
            style={{ margin: '5px 5px' }}
          >
            Cancel
          </Button>
        </div>
      </Col>
    </Row>
  )
}

export default AddUser
