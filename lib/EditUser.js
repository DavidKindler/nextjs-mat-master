import { Row, Col, Button } from 'antd'

const EditUser = props => {
  return (
    <Row>
      <Col span={12} offset={6}>
        <div style={{ margin: '5px 0' }}>
          <p>{props.user._id}</p>
          <p>{props.user.username}</p>
          <p>{props.user.email}</p>
          <p>{props.user.provider}</p>
        </div>
        <div>
          <Button
            type='primary'
            htmlType='submit'
            style={{ margin: '5px 5px' }}
            onClick={() =>
              props.onSubmit({
                variables: { editUser: { updatedUser: props.user } }
              })
            }
          >
            Edit
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

export default EditUser
