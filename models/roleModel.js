module.exports = (sequelize, type) =>
  sequelize.define('roles', {
    id: {
      type: type.UUID,
      primaryKey: true,
      defaultValue: type.UUIDV4,
      allowNull: false
    },
    app: {
      type: type.STRING,
      allowNull: false,
      set (value) {
        // Storing passwords in plaintext in the database is terrible.
        // Hashing the value with an appropriate cryptographic hash function is better.
        this.setDataValue('app', value.toUpperCase())
      }
    },
    role: {
      type: type.STRING,
      allowNull: false,
      set (value) {
        // Storing passwords in plaintext in the database is terrible.
        // Hashing the value with an appropriate cryptographic hash function is better.
        this.setDataValue('role', value.toUpperCase())
      }
    }
  })
