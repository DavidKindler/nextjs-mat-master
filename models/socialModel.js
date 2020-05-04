module.exports = (sequelize, type) =>
  sequelize.define('social', {
    id: {
      type: type.UUID,
      primaryKey: true,
      defaultValue: type.UUIDV4,
      allowNull: false
    },
    email: {
      type: type.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: type.STRING,
      allowNull: true
    },
    approved: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    provider: {
      type: type.STRING,
      allowNull: true,
      set (value) {
        // Storing passwords in plaintext in the database is terrible.
        // Hashing the value with an appropriate cryptographic hash function is better.
        this.setDataValue('provider', value.toUpperCase())
      }
    },
    resetPasswordToken: type.STRING,
    resetPasswordExpires: type.DATE
  })
