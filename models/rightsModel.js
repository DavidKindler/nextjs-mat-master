module.exports = (sequelize, type) =>
  sequelize.define('rights', {
    id: {
      type: type.UUID,
      primaryKey: true,
      defaultValue: type.UUIDV4,
      allowNull: false
    },
    appId: {
      type: type.UUID,
      allowNull: false
    },
    userId: {
      type: type.UUID,
      allowNull: false
    },
    roleId: {
      type: type.UUID,
      allowNull: false
    }
  })
