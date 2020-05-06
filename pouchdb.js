const { v4: uuidv4 } = require('uuid')
const PouchDB = require('pouchdb')

var db = new PouchDB('./pouchdb/master')
var remoteCouch = 'http://localhost:5984/master'
if (process.env.NODE_ENV !== 'production') {
  initConfig = require('./config/db.config.dev')
} else {
  initConfig = require('./config/db.config.prod')
}
const APPS = initConfig.constants.apps
const ROLES = initConfig.constants.roles
const PROVIDERS = initConfig.constants.providers

// var remoteCouch = false
var sync = PouchDB.sync('db', remoteCouch, {
  live: true,
  retry: true
})
  .on('change', function (info) {
    // handle change
  })
  .on('paused', function (err) {
    // replication paused (e.g. replication up to date, user went offline)
  })
  .on('active', function () {
    // replicate resumed (e.g. new changes replicating, user went back online)
  })
  .on('denied', function (err) {
    // a document failed to replicate (e.g. due to permissions)
  })
  .on('complete', function (info) {
    // handle complete
  })
  .on('error', function (err) {
    // handle error
  })

function addUser (user) {
  let userToAdd = {
    _id: uuidv4(),
    user: user.username,
    email: user.email,
    provider: user.provider,
    rights: user.rights
  }
  db.put(userToAdd, function callback (err, result) {
    if (!err) {
      console.log('Successfully posted a user!')
      console.log('result', result)
    }
  })
}
function addApp (app) {
  let appToAdd = {
    _id: uuidv4(),
    app: app.app,
    url: app.url,
    roles: app.roles
  }
  db.put(appToAdd, function callback (err, result) {
    if (!err) {
      console.log('Successfully posted a app!')
      console.log('result', result)
    }
  })
}

const SaltDB = dbConfig => {
  addApp({
    app: APPS.MASTER,
    url: 'http://localhost:2000',
    roles: [
      { app: APPS.MASTER, role: ROLES.ADMIN },
      { app: APPS.MASTER, role: 'SUPERADMIN' }
    ]
  })

  addApp({
    app: APPS.RSSNEWS,
    url: 'http://localhost:3000/#/',
    roles: [{ app: APPS.RSSNEWS, role: ROLES.ADMIN }]
  })

  addApp({
    app: APPS.CLIENT1PROTECTED,
    url: 'http://localhost:3002/protected',
    roles: [{ app: APPS.CLIENT1PROTECTED, role: ROLES.USER }]
  })

  addApp({
    app: APPS.CLIENT1REGISTERED,
    url: 'http://localhost:3002/registered',
    roles: [{ app: APPS.CLIENT1REGISTERED, role: ROLES.USER }]
  })

  addApp({
    app: APPS.CLIENT1ADMIN,
    url: 'http://localhost:3002/admin',
    roles: [{ app: APPS.CLIENT1ADMIN, role: ROLES.ADMIN }]
  })

  addApp({
    app: APPS.CLIENT2,
    url: 'http://localhost:3003',
    roles: [
      { app: APPS.CLIENT2, role: ROLES.ADMIN },
      { app: APPS.CLIENT2, role: ROLES.USER }
    ]
  })

  if (!dbConfig || !dbConfig.users) throw Error
  dbConfig.users.forEach(user => {
    addUser({
      email: user.email,
      username: user.username,
      provider: user.provider,
      rights: user.rights
    })
  })
}

function showUsers () {
  db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
    console.log('pouchdb todos', doc.rows)
  })
}

SaltDB(initConfig)
showUsers()
sync.cancel()
