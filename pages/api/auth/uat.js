const nextConnect = require('next-connect')
const { session } = require('next-session')
const passport = require('passport')
const CasStrategy = require('passport-cas2').Strategy
const normalizeUrl = require('normalize-url')
var url = require('url')
const generateToken = require('../../../lib/generateToken')
const sendMail = require('../../../lib/sendEmail')
const { db } = require('../../../lib/nedb')

let sessionOptions = {}
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

const authenticate = (req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate('cas', async profile => {
      console.log('passport.authenticate called')
      console.log('req object', req.query)
      console.log('profile object', profile)
      let user = await db.findOne({ username: profile.id })
      console.log('User', user)
      if (!user) {
        let userToAdd = {
          username: profile.id,
          email: profile.id,
          provider: 'UAT'
        }
        console.log('user to add', userToAdd)
        user = await db.insert(userToAdd)
      }
      resolve(user)
    })(req, res)
  })

passport.use(
  new CasStrategy(
    { casURL: process.env.UAT_URL },
    (username, profile, done) => {
      console.log('uat strategy called')
      console.log('username ===> ', username)
      console.log('profile==>', profile)
      // findUatUserOrCreate(username, profile, done)
      done(profile)
    }
  )
)

export default nextConnect()
  .use(passport.initialize())
  .use(session({ ...sessionOptions }))
  .get(async (req, res) => {
    try {
      console.log('1uat callback route called')
      console.log('casurl', process.env.UAT_URL)
      console.log('1request object', req.query)
      const user = await authenticate(req, res)

      let { appurl, redirecturl } = req.query
      const token = generateToken(user)
      let appNormalUrl = normalizeUrl(appurl)
      let hasHash = appNormalUrl.indexOf('#/') !== -1
      console.log('token returned==>', token)
      console.log('appurl normalized==>', appNormalUrl)
      console.log('hashash==>', hasHash)
      console.log(
        'redirecting now to==>',
        `${appNormalUrl}${
          hasHash ? '' : '/'
        }login?redirecturl=${redirecturl}&token=${token}`
      )

      // res.status(200).send({ done: user })
      res.writeHead(302, {
        Location: `${appNormalUrl}${
          hasHash ? '' : '/'
        }login?redirecturl=${redirecturl}&token=${token}`
      })
      res.end()
    } catch (error) {
      console.error(error)
      let { appurl, redirecturl } = req.query
      let appNormalUrl = normalizeUrl(appurl)
      let hasHash = appNormalUrl.indexOf('#/') !== -1
      res.writeHead(302, {
        Location: `${appNormalUrl}${hasHash ? '' : '/'}login?error=${
          error.message
        }`
      })
      res.end()
      // res.status(401).send(error.message)
    }
  })

// export default (req, res) => {

//   console.log('casurl', process.env.UAT_URL)

//   console.log('1uat callback route /auth/uat called now')
//   console.log('1request object', req.query)

//   // let x = url.parse(req.query.state)
//   // console.log('state parsed ', x)
//   // let appurl = `${x.protocol}//${x.host}${x.pathname}`
//   let appurl = req.query.appurl
//   console.log('1appurl is now', appurl)

//   // const regex = /(?:^|[?&])appurl=([^&]*)/g
//   // let m = regex.exec(req.query.state)

//   // let redirecturl = `${m[1]}`
//   let redirecturl = req.query.redirecturl
//   console.log('1redirecturl', redirecturl)

//   passport.authenticate('cas', (req, res) => {
//     console.log('passport.authenticate called')
//     console.log('req object', req)
//     res.writeHead(302, { Location: '/login' })
//     res.end()
//   })(req, res, a => {
//     console.log('next function called with==>', a)
//   })

//   // passport.authenticate('cas', (err, profile) => {
//   //   console.log('passport.authenticate called')
//   //   if (err) {
//   //     res.status(503).json({ error: err })
//   //     res.end()
//   //   }
//   //   if (profile) {
//   //     console.log('authenticated??', profile)
//   //     console.log('normalize profile')
//   //     let profileNormalized = {
//   //       id: profile.id,
//   //       email: profile.email,
//   //       username: profile.username,
//   //       provider: profile.provider,
//   //       right: profile.rights
//   //     }

//   //     const token = generateToken(profileNormalized)
//   //     let appNormalUrl = normalizeUrl(appurl)
//   //     let hasHash = appNormalUrl.indexOf('#/') !== -1
//   //     console.log('token returned==>', token)
//   //     console.log('appurl normalized==>', appNormalUrl)
//   //     console.log('hashash==>', hasHash)
//   //     console.log(
//   //       'redirecting now to==>',
//   //       `${appNormalUrl}${
//   //         hasHash ? '' : '/'
//   //       }login?redirecturl=${redirecturl}&token=${token}`
//   //     )
//   //     res.writeHead(302, {
//   //       Location: `${appNormalUrl}${
//   //         hasHash ? '' : '/'
//   //       }login?redirecturl=${redirecturl}&token=${token}`
//   //     })
//   //     res.end()
//   //   }
//   // })(req, res, a => {
//   //   console.log('next function called with==>', a)
//   // })
// }
