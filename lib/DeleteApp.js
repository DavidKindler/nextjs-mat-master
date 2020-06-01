import { Row, Col, Button } from 'antd'

const DeleteApp = props => {
  return (
    <Row>
      <Col span={12} offset={6}>
        <div style={{ margin: '5px 0' }}>
          <p>{props.app._id}</p>
          <p>{props.app.app}</p>
          <p>{props.app.url}</p>
        </div>
        <div>
          <Button
            type='primary'
            htmlType='submit'
            style={{ margin: '5px 5px' }}
            onClick={() =>
              props.onSubmit({
                variables: { deleteApp: { _id: props.app._id } }
              })
            }
          >
            Delete
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

export default DeleteApp
