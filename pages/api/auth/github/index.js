const passport = require('passport')
const normalizeUrl = require('normalize-url')
const createError = require('http-errors')
const GitHubStrategy = require('passport-github2').Strategy
const sendMail = require('../../../../lib/sendEmail')
const { db } = require('../../../../lib/nedb')
const generateToken = require('../../../../lib/generateToken')

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

const logStatus = (profile, status) => {
  // db.create({
  //   userId: profile.id,
  //   username: profile.username,
  //   status: status
  // }).then(() => {
  //   console.log('github user logged with status', status)
  // })
}

////////////////////////   GITHUB STRATEGY  ///////////////////////////////////

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.dev.GITHUB_CLIENT_ID,
      clientSecret: process.env.dev.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.dev.GITHUB_CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log('github strategy called with profile', profile)
      // if you login via github we check to see if you are registered
      findGithubUserOrCreate(profile, done)
    }
  )
)

const findGithubUserOrCreate = (profile, done) => {
  console.log('gh profile passed ==>', profile)
  const username = profile.username ? profile.username : profile.email
  // console.log('UrlObj3 exists?', UrlObj)
  // const appUrl = normalizeUrl(UrlObj.query.redirect) || null
  // console.log('assign Rights to username==>', username, appUrl)

  // Apps.findOne({ where: { url: appurl } })
  //   .then(response => {
  //     process.env.NODE_ENV !== 'production' &&
  //       console.log('app response', response)
  //     const appToAssign = (response && response.app) || null
  //     const rightToAssign = {
  //       username: username,
  //       role: null,
  //       app: appToAssign
  //     }
  //     process.env.NODE_ENV !== 'production' &&
  //       console.log('rightToAssign', rightToAssign)

  //     Users.findOrCreate({
  //       where: { username: username },
  //       include: [{ model: Rights }],
  //       defaults: {
  //         username: username,
  //         approved: false,
  //         provider: PROVIDERS.GITHUB,
  //         rights: [rightToAssign]
  //       }
  //     })
  //       .spread(function (user, created) {
  //         const profile = user.get({ plain: true })
  //         // console.log('gh user return from Users DB==>', profile)
  //         if (created) {
  //           sendMail({
  //             to: process.env.EMAIL_SEND_TO,
  //             subject: `${profile.username} registered to ${appToAssign} at ${appurl}`,
  //             html: `<h2>${profile.username} Registered to ${appToAssign} at ${appurl} </h2>`
  //           })
  //           logStatus(
  //             profile,
  //             `${PROVIDERS.GITHUB} registered to ${appToAssign}`
  //           )
  //           done(null, profile, `new ${PROVIDERS.GITHUB} user was registered`)
  //         } else {
  //           sendMail({
  //             to: process.env.EMAIL_SEND_TO,
  //             subject: `${profile.username} logged in to ${appToAssign} at ${appurl}`,
  //             html: `<h2>${profile.username} Logged in to ${appToAssign} at ${appurl} </h2>`
  //           })
  //           logStatus(profile, `${PROVIDERS.GITHUB} login`)
  //           done(null, profile, `${PROVIDERS.GITHUB} user logged in`)
  //         }
  //       })
  //       .catch(err => {
  //         done(err, false, { message: `${PROVIDERS.GITHUB} create error` })
  //       })
  // })
  // .catch(err => {
  //   console.error(err)
  //   done(createError(503, 'Error with DB access'))
  // })
}

////////////////////////   GITHUB STRATEGY  ///////////////////////////////////
export default (req, res) => {
  console.log(req.query)
  // res.status(200).json({ text: 'github api' })
  if (!req.query.appurl || !req.query.redirecturl)
    throw createError(500, 'Not all info needed for request')

  console.log('github authenticate route / called now')
  let appurl = req.query.appurl
  let redirecturl = req.query.redirecturl || req.query.appurl
  console.log('redirecturl', redirecturl)
  console.log('appurl', appurl)

  passport.authenticate(
    'github',
    {
      scope: ['user:email'],
      state: appurl
    },
    function (err, user, info) {
      //////////////////////////////////////////////////////
      // None of this happens.  We go to callback route now.
      // We do it this way to pass the request object
      //////////////////////////////////////////////////////
      // console.log('custom callback err::', err)
      // console.log('custom callback user::', user)
      // console.log('custom callback info::', info)
      // if (err) { return next(err) }
      // if (!user) { return res.redirect('/login') }
      // req.logIn(user, function (err) {
      //   if (err) { return next(err) }
      //   return res.redirect('/protected')
      // })
    }
  )(req, res)
}

// // Custom callback for authenticate
// router.get('/', (req, res, next) => {
//   if (!req.query.appurl || !req.query.redirecturl)
//     throw createError(500, 'Not all info needed for request')

//   console.log('github authenticate route / called now')
//   appurl = req.query.appurl
//   redirecturl = req.query.redirecturl || req.query.appurl
//   console.log('redirecturl', redirecturl)
//   console.log('appurl', appurl)

//   passport.authenticate(
//     'github',
//     {
//       scope: ['user:email'],
//       state: appurl
//     },
//     function (err, user, info) {
//       //////////////////////////////////////////////////////
//       // None of this happens.  We go to callback route now.
//       // We do it this way to pass the request object
//       //////////////////////////////////////////////////////
//       // console.log('custom callback err::', err)
//       // console.log('custom callback user::', user)
//       // console.log('custom callback info::', info)
//       // if (err) { return next(err) }
//       // if (!user) { return res.redirect('/login') }
//       // req.logIn(user, function (err) {
//       //   if (err) { return next(err) }
//       //   return res.redirect('/protected')
//       // })
//     }
//   )(req, res, next)
// })
