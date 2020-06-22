import { Card, Row, Col, Button, Descriptions } from 'antd'

const DeleteUser = props => {
  const { user } = props
  return (
    <Row>
      <Col span={12} offset={6}>
        <div style={{ margin: '5px 0' }}>
          <Card title='User Details' bordered={false}>
            <Descriptions>
              <Descriptions.Item label='Username'>
                {user.username}
              </Descriptions.Item>
              <Descriptions.Item label='Email'>{user.email}</Descriptions.Item>
              <Descriptions.Item label='Provider'>
                {user.provider}
              </Descriptions.Item>
              {user.rights &&
                user.rights.map(right => (
                  <Descriptions.Item key={Math.random()} label='Right'>
                    {right.app}/{right.role}
                  </Descriptions.Item>
                ))}
            </Descriptions>
          </Card>
        </div>
        <div>
          <Button
            type='primary'
            htmlType='submit'
            style={{ margin: '5px 5px' }}
            onClick={() =>
              props.onSubmit({
                variables: { deleteUser: { _id: user._id } }
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

export default DeleteUser
