console.log('process.env.NODE_ENV==>', process.env.NODE_ENV)
const Sequelize = require('sequelize')
const path = require('path')
// let appRoot = path.join(__dirname, '../')
let initConfig
if (process.env.NODE_ENV !== 'production') {
  initConfig = require('../config/db.config.dev')
} else {
  initConfig = require('../config/db.config.prod')
}

const APPS = initConfig.constants.apps
const ROLES = initConfig.constants.roles
const PROVIDERS = initConfig.constants.providers
const UserModel = require('../models/userModel')
const RightsModel = require('../models/rightsModel')
const LogModel = require('../models/logModel')
const AppsModel = require('../models/appModel')
const RolesModel = require('../models/roleModel')

const Op = Sequelize.Op

// const sequelize = new Sequelize(
//   process.env.DB_DB,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   { dialect: 'mysql', host: process.env.DB_HOST }
// )

// console.log('db to use', path.resolve(process.cwd(), 'users.db'))

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(process.cwd(), 'users.db')
})

const Users = UserModel(sequelize, Sequelize)
const Rights = RightsModel(sequelize, Sequelize)
const Log = LogModel(sequelize, Sequelize)
const Apps = AppsModel(sequelize, Sequelize)
const Roles = RolesModel(sequelize, Sequelize)
const User_Rights = Users.hasMany(Rights)
const App_Roles = Apps.hasMany(Roles)

const Models = {
  Users,
  Rights,
  Apps,
  Roles
}
if (process.env.NODE_ENV === 'test') {
  sequelize.sync({ force: true }).then(() => {
    SaltDB(initConfig)
  })
} else {
  sequelize.sync()
}

const SaltDB = dbConfig => {
  Apps.create(
    {
      app: APPS.MASTER,
      url: 'http://localhost:2000',
      roles: [{ role: ROLES.ADMIN }, { role: 'SUPERADMIN' }]
    },
    {
      include: [{ model: Roles }]
    }
  )

  Apps.create(
    {
      app: APPS.RSSNEWS,
      url: 'http://localhost:3000/#/',
      roles: [{ role: ROLES.ADMIN }]
    },
    {
      include: [{ model: Roles }]
    }
  )

  Apps.create(
    {
      app: APPS.CLIENT1PROTECTED,
      url: 'http://localhost:3002/protected',
      roles: [{ role: ROLES.USER }]
    },
    {
      include: [{ model: Roles }]
    }
  )

  Apps.create(
    {
      app: APPS.CLIENT1REGISTERED,
      url: 'http://localhost:3002/registered',
      roles: [{ role: ROLES.USER }]
    },
    {
      include: [{ model: Roles }]
    }
  )

  Apps.create(
    {
      app: APPS.CLIENT1ADMIN,
      url: 'http://localhost:3002/admin',
      roles: [{ role: ROLES.ADMIN }]
    },
    {
      include: [{ model: Roles }]
    }
  )

  Apps.create(
    {
      app: APPS.CLIENT2,
      url: 'http://localhost:3003',
      roles: [{ role: ROLES.ADMIN }, { role: ROLES.USER }]
    },
    {
      include: [{ model: Roles }]
    }
  )

  if (!dbConfig || !dbConfig.users) throw Error
  dbConfig.users.forEach(user => {
    Users.create({
      email: user.email,
      username: user.username,
      approved: user.approved,
      provider: user.provider
    })
      .then(created => {
        console.log('user created', created.username)
        user.rights.forEach(right => {
          console.log('user right', right)
          Apps.findOne({
            where: { app: right.app },
            include: [{ model: Roles }]
          }).then(app => {
            console.log(
              'find role id here==>',
              app.app,
              JSON.stringify(app.roles, null, 2)
            )
            // Rights.create({
            //   appId: app.id,
            //   userId: created.id,
            //   roleId: app.roles.roleId
            // })
          })
        })
      })
      .catch(e => {
        console.error('user create error', e)
      })
  })
}

// const getAppsAndRoles = async next => {
//   try {
//     const results = await Apps.findAll({
//       include: [{ model: Roles }],
//       order: [[{ model: Roles, as: 'Roles' }, 'role', 'ASC']]
//     })
//     return results
//   } catch (e) {
//     next(e)
//   }
// }

module.exports = {
  Models,
  APPS,
  ROLES,
  PROVIDERS,
  Op
}
