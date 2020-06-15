import { Card, Row, Col, Button, Descriptions } from 'antd'

const DeleteApp = props => {
  const deleteHandler = id => {
    if (window.confirm('Are you sure?')) {
      props.onSubmit({
        variables: { deleteApp: { _id: id } }
      })
    }
  }
  return (
    <Row>
      <Col span={12} offset={6}>
        <div style={{ margin: '5px 0' }}>
          <Card title='App Details' bordered={false}>
            <Descriptions>
              <Descriptions.Item label='App'>{props.app.app}</Descriptions.Item>
              <Descriptions.Item label='Url'>{props.app.url}</Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
        <div>
          <Button
            type='primary'
            htmlType='submit'
            style={{ margin: '5px 5px' }}
            onClick={
              () => deleteHandler(props.app._id)
              // props.onSubmit({
              //   variables: { deleteApp: { _id: props.app._id } }
              // })
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
