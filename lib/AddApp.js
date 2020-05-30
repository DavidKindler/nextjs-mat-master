import { useState } from 'react'
import { Row, Col, Input, Button } from 'antd'
import './AddApp.module.css'
import { gql } from 'apollo-boost'

const query = gql`
  mutation addApp($newApp: NewAppInput!) {
    newApp(input: $newApp) {
      app
      url
      roles
      _id
    }
  }
`

const AddApp = props => {
  const [newApp, setNewApp] = useState({ app: null, url: null })
  const [validUrl, setValidUrl] = useState(false)

  const reset = () => {
    setNewApp({ app: null, url: null })
  }

  const appnameHandler = e => {
    setNewApp({ ...newApp, app: e.target.value })
  }

  const appurlHandler = e => {
    setNewApp({ ...newApp, url: e.target.value })
    const r = /^(http|https):\/\/[^ "]+$/
    setValidUrl(r.test(e.target.value))
  }

  return (
    <Row>
      <Col span={12} offset={6}>
        <div
          style={{ margin: '5px 0' }}
          className={newApp.app ? 'correct' : 'incorrect'}
        >
          <Input
            size='large'
            onChange={appnameHandler}
            placeholder='App Name'
            value={newApp.app}
          />
        </div>
        <div
          style={{ margin: '5px 0' }}
          className={validUrl ? 'correct' : 'incorrect'}
        >
          <Input
            size='large'
            onChange={appurlHandler}
            placeholder='App Url'
            value={newApp.url}
          />
        </div>
        <div>
          <Button
            type='primary'
            htmlType='submit'
            style={{ margin: '5px 5px' }}
            onClick={() =>
              props.onSubmit(query, { variables: { newApp: newApp } })
            }
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

export default AddApp
