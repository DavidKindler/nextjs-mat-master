module.exports = (sequelize, type) =>
  sequelize.define('rights', {
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
    app: {
      type: type.STRING,
      allowNull: true,
      default: null,
      set (value) {
        // Storing passwords in plaintext in the database is terrible.
        // Hashing the value with an appropriate cryptographic hash function is better.
        console.log('app value', value)
        return value ? this.setDataValue('app', value.toUpperCase()) : null
      }
    },
    url: {
      type: type.STRING,
      allowNull: true,
      default: null
    },
    role: {
      type: type.STRING,
      allowNull: true,
      default: null,
      set (value) {
        // Storing passwords in plaintext in the database is terrible.
        // Hashing the value with an appropriate cryptographic hash function is better.
        console.log('role value', value)
        return value ? this.setDataValue('role', value.toUpperCase()) : null
      }
    }
  })
