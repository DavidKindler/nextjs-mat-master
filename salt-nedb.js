const { db, crud } = require('./lib/nedb')
const path = require('path')
const fs = require('fs')
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

const dbName = 'nedb-users'
const dbFilename = filename(dbName)

if (process.env.NODE_ENV !== 'production') {
  initConfig = require('./config/db.config.dev')
} else {
  initConfig = require('./config/db.config.prod')
}
const APPS = initConfig.constants.apps
const ROLES = initConfig.constants.roles

function addApp (app) {
  let appToAdd = {
    app: app.app,
    url: app.url,
    roles: app.roles
  }
  crud.insert(appToAdd)
}

function addUser (user) {
  let userToAdd = {
    username: user.username,
    email: user.email,
    provider: user.provider,
    rights: user.rights
  }
  crud.insert(userToAdd)
}

const SaltDB = dbConfig => {
  removeFile(dbFilename)
  addApp({
    app: APPS.MASTER,
    url: 'http://localhost:3000',
    roles: [ROLES.ADMIN, 'SUPERADMIN']
  })

  addApp({
    app: APPS.RSSNEWS,
    url: 'http://localhost:2000/#/',
    roles: [ROLES.ADMIN]
  })

  addApp({
    app: APPS.CLIENT1PROTECTED,
    url: 'http://localhost:2002/protected',
    roles: [ROLES.USER]
  })

  addApp({
    app: APPS.CLIENT1REGISTERED,
    url: 'http://localhost:2002/registered',
    roles: [ROLES.USER, ROLES.ADMIN]
  })

  addApp({
    app: APPS.CLIENT1ADMIN,
    url: 'http://localhost:2002/admin',
    roles: [ROLES.ADMIN]
  })

  addApp({
    app: APPS.CLIENT2,
    url: 'http://localhost:2003',
    roles: [ROLES.ADMIN, ROLES.USER]
  })

  // for (let i = 0; i < 1000; i++) {
  //   addApp({
  //     app: `app_${i}`,
  //     url: `http://localhost:${10000 + i}`,
  //     roles: ['user']
  //   })
  // }

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

async function doDatabaseStuff () {
  let getItems = await crud.find()
  console.log('getItems', getItems)
  console.log('')

  // let getUsers = await db.find({ username: { $exists: true } })
  // console.log('getUsers', getUsers)
  // console.log('')

  // let getApp = await db.findOne({ app: 'MASTER' })
  // console.log('getApp', getApp)
  // console.log('')

  // let addApp = await db.insert({ app: 'foobar', url: 'http://foobar.com' })
  // console.log('addApp', addApp)
  // console.log('')

  // let getApps = await db.find({ app: { $exists: true } })
  // console.log('getApps', getApps)
  // console.log('')

  // let addApp2 = await db
  //   .insert({ app: 'foobar', url: 'http://foobar.com' })
  //   .catch(err => {
  //     if (err.errorType == 'uniqueViolated') return 'already exists'
  //     return err
  //   })
  // console.log('addApp', addApp2)
  // console.log('')

  // let editApp = await db
  //   .update(
  //     { app: 'foobar' },
  //     { $set: { url: 'http://newfoobar.com' } },
  //     { returnUpdatedDocs: true }
  //   )
  //   .then(docs => docs)
  //   .catch(err => {
  //     // if (err.errorType == 'uniqueViolated') return 'already exists'
  //     return err
  //   })
  // console.log('editApp', editApp)
  // console.log('')

  // let editApp2 = await db
  //   .update(
  //     { app: 'foobar' },
  //     { $set: { app: 'newfoobar' } },
  //     { returnUpdatedDocs: true }
  //   )
  //   .then(docs => docs)
  //   .catch(err => {
  //     // if (err.errorType == 'uniqueViolated') return 'already exists'
  //     return err
  //   })
  // console.log('editApp2', editApp2)
  // let r = []
  let x = await db.find({ roles: { $exists: true } })
  let r = x.flatMap(y => y.roles)
  var uniqueRoles = Array.from(new Set(r))
  console.log('roles', uniqueRoles)
  console.log('')
  await db.persistence.compactDatafile()
}

SaltDB(initConfig)

doDatabaseStuff()
