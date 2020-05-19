const fs = require('fs')
const path = require('path')
const nedb = require('nedb-promises')

const filename = name => path.join(process.cwd(), `/nedb/${name}.db`)

const dbName = 'nedb-users'
const dbFilename = filename(dbName)

const db = nedb.create(dbFilename)

db.on('ensureIndexError', (db, error, options) => {
  console.log('indexing db error')
})
db.ensureIndex({ fieldName: 'email', unique: true, sparse: true }, e =>
  e ? console.error(e) : null
)

db.ensureIndex({ fieldName: 'app', unique: true, sparse: true }, e =>
  e ? console.error(e) : null
)

const crud = {
  find: async () => await db.find({}),
  findOne: async _id => await db.findOne(_id),
  insert: async document => await db.insert(document),
  update: async (_id, document) => await db.update(_id, document),
  remove: async _id => await db.remove(_id)
}

module.exports = { db, crud }
