const fs = require('fs')
const path = require('path')
const nedb = require('nedb-promises')

const filename = name => path.join(process.cwd(), `/nedb/${name}.db`)
const removeFile = filename => {
  try {
    if (fs.existsSync(filename)) {
      fs.unlink(filename, function (err) {
        if (err) throw err
        console.log(`${filename} was deleted`)
      })
    }
  } catch (err) {
    console.error(err)
  }
}

// const crud = {
//   find: collection =>
//     new Promise((resolve, reject) =>
//       collections[collection]
//         .find({})
//         .exec((err, res) => (err ? reject(err) : resolve(res)))
//     ),
//   findOne: (collection, _id) =>
//     new Promise((resolve, reject) =>
//       collections[collection].findOne({ _id }, (err, res) =>
//         err ? reject(err) : resolve(res)
//       )
//     ),
//   filter: (collection, _id) =>
//     new Promise((resolve, reject) =>
//       collections[collection].find({ _id }, (err, res) =>
//         err ? reject(err) : resolve(res)
//       )
//     ),
//   create: (collection, document) =>
//     new Promise((resolve, reject) =>
//       collections[collection].insert(document, (err, res) =>
//         err ? reject(err) : resolve(res)
//       )
//     ),
//   update: (collection, _id, document) =>
//     new Promise((resolve, reject) =>
//       collections[collection].update({ _id }, document, {}, (err, res) =>
//         err ? reject(err) : resolve(res === 1)
//       )
//     ),
//   delete: (collection, _id) =>
//     new Promise((resolve, reject) =>
//       collections[collection].remove({ _id }, (err, res) =>
//         err ? reject(err) : resolve(res === 1)
//       )
//     )
// }

const dbName = 'nedb-users'
const dbFilename = filename(dbName)
removeFile(dbFilename) // start from scratch

// Define the nedb instance
// const db = (collections[itemCollection] = nedb.create(dbFilename))
const db = nedb.create(dbFilename)
// const db = (collections[itemCollection] = new nedb({
//   filename: dbFilename,
//   autoload: true
// }))

db.on('ensureIndexError', (db, error, options) => {
  console.log('indexing db error')
})
db.ensureIndex({ fieldName: 'username', unique: true, sparse: true }, e =>
  e ? console.error(e) : null
)

db.ensureIndex({ fieldName: 'app', unique: true, sparse: true }, e =>
  e ? console.error(e) : null
)

// const items = {
//   find: async () => await crud.find(itemCollection),
//   findOne: _id => crud.findOne(itemCollection, _id),
//   filter: _id => crud.filter(itemCollection, _id),
//   create: document => crud.create(itemCollection, document),
//   update: (_id, document) => crud.update(itemCollection, _id, document),
//   delete: _id => crud.delete(itemCollection, _id)
// }
const crud = {
  find: async () => await db.find({}),
  findOne: async _id => await db.findOne(_id),
  insert: async document => await db.insert(document),
  update: async (_id, document) => await db.update(_id, document),
  remove: async _id => await db.remove(_id)
}

module.exports = { db, crud }
