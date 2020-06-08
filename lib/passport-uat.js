// import Local from 'passport-local'
const CasStrategy = require('passport-cas2')
const { findUser } = require('./user')

export const uatStrategy = new CasStrategy.Strategy(
  { casURL: process.env.UAT_URL },
  (username, profile, done) => {
    console.log('uat strategy called', username, profile)
    // findUatUserOrCreate(username, profile, done)
    findUser({ username, profile })
      .then(user => {
        done(null, user)
      })
      .catch(error => {
        done(error)
      })
  }
)

// export const uatStrategy = new Local.Strategy(function (
//   username,
//   password,
//   done
// ) {
//   findUser({ username, password })
//     .then((user) => {
//       done(null, user)
//     })
//     .catch((error) => {
//       done(error)
//     })
// })
