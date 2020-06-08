const { db } = require('./nedb')

/**
 * User methods. The example doesn't contain a DB, but for real applications you must use a
 * db here, such as MongoDB, Fauna, SQL, etc.
 */

export async function createUser ({ username, profile }) {
  // Here you should create the user and save the salt and hashed password (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):
  //
  // const salt = crypto.randomBytes(16).toString('hex')
  // const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  // const user = await DB.createUser({ username, salt, hash })

  return { profile }
}

export async function findUser ({ username, profile }) {
  if (!username || !profile) return null
  let user_name = username ? username : profile.id
  console.log('assign Rights to username==>', user_name)
  let user = await db.findOne({ username: user_name })
  profile = {
    username: 'foo',
    email: 'foo@nxp.com',
    provider: 'UAT'
  }
  // Here you should lookup for the user in your DB and compare the password:
  //
  // const user = await DB.findUser(...)
  // const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex')
  // const passwordsMatch = user.hash === hash

  return profile
}

// const findUatUserOrCreate = async (username, profile, done) => {
//   if (!username || !profile) return null

//   const username = username ? username : profile.id

//   process.env.NODE_ENV !== 'production' &&
//     console.log('assign Rights to username==>', username)

//   let getUser = await db.findOne({ username: username })
//   console.log('getUser', getUser)

//   profile = {
//     username: 'foo',
//     email: 'foo@nxp.com',
//     provider: 'UAT'
//   }
//   done(null, getUser, `UAT user logged in`)
// }
