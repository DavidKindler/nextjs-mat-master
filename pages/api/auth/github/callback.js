const passport = require('passport')
const normalizeUrl = require('normalize-url')
const generateToken = require('../../../../lib/generateToken')
const GitHubStrategy = require('passport-github2').Strategy
const sendMail = require('../../../../lib/sendEmail')
const { db } = require('../../../../lib/nedb')

export default (req, res) => {
  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (obj, done) {
    done(null, obj)
  })

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

  const findGithubUserOrCreate = async (profile, done) => {
    console.log('findgithubuser 2')
    console.log('gh profile passed ==>', profile.email, profile.username)
    let appurl = req.query.state
    console.log('appurl is set to==>', appurl)
    const username = profile.username ? profile.username : profile.email

    let getUser = await db.findOne({ username: username })
    let app = await db.findOne({ url: appurl })

    console.log('getUser', getUser)
    console.log('app', app)

    profile = {
      username: 'foo',
      email: 'foo@goo.com',
      provider: 'GITHUB'
    }
    done(null, profile, `new github user was registered`)
  }

  // router.get('/callback', (req, res, next) => {
  console.log('github callback route /auth/github/callback called now')
  let appurl = req.query.state
  let redirecturl = appurl
  process.env.NODE_ENV !== 'production' && console.log('appurl2', appurl)
  passport.authenticate(
    'github',
    { scope: ['user:email'], state: appurl },
    function (err, profile) {
      // console.log('callback function with profile', profile)
      if (err) {
        // return next(err)
        // createError(500, err)
        res.status(503).json({ error: err })
        res.end()
      }
      if (profile) {
        console.log('normalize profile')
        let profileNormalized = {
          id: profile.id,
          email: profile.email,
          username: profile.username,
          provider: profile.provider,
          right: profile.rights
        }

        const token = generateToken(profileNormalized)
        let appNormalUrl = normalizeUrl(appurl)
        let hasHash = appNormalUrl.indexOf('#/') !== -1
        console.log('token returned==>', token)
        console.log('appurl normalized==>', appNormalUrl)
        console.log('hashash==>', hasHash)
        console.log(
          'redirecting now to==>',
          `${appNormalUrl}${
            hasHash ? '' : '/'
          }authredirect?redirecturl=${appurl}&token=${token}`
        )
        res.writeHead(302, {
          Location: `${appNormalUrl}${
            hasHash ? '' : '/'
          }authredirect?redirecturl=${appurl}&token=${token}`
        })
        res.end()

        // res.redirect(
        //   `${appNormalUrl}${
        //     hasHash ? '' : '/'
        //   }authredirect/?redirecturl=${appurl}&token=${token}`
        // )
      } else {
        res.status(503).json({ error: 'No profile' })
        res.end()
      }
    }
  )(req, res, b => {
    console.log('next2 called again with==>', b)
  })
}
