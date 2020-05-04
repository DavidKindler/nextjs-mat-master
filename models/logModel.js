
module.exports = (sequelize, type) => sequelize.define('log', {
  userId: {
    type: type.UUID,
    allowNull: true
  },
  username: {
    type: type.STRING,
    allowNull: true
  },
  email: {
    type: type.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  status: {
    type: type.TEXT,
    allowNull: true
  },
  created_at: {
    type: 'TIMESTAMP',
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  updated_at: {
    type: 'TIMESTAMP',
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
});