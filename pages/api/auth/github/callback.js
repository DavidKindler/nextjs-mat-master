const passport = require('passport')
const normalizeUrl = require('normalize-url')
var url = require('url')
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
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
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
    // console.log('gh profile passed ==>', profile)
    let appurl = req.query.state
    // console.log('appurl is set to==>', appurl)
    const username = profile._json.login
      ? profile._json.login
      : profile._json.email

    let getUser = await db.findOne({ username: username })
    let app = await db.findOne({ url: appurl })

    console.log('getUser', getUser)
    console.log('app', app)

    // check if getUser returned a value and define profile
    // else create user without a right
    // const profile = getUser
    profile = {
      username: 'foo',
      email: 'foo@goo.com',
      provider: 'GITHUB'
    }
    // sendMail({
    //   to: process.env.EMAIL_SEND_TO,
    //   subject: `${profile.username} logged in to ${appToAssign} at ${appurl}`,
    //   html: `<h2>${profile.username} Logged in to ${appToAssign} at ${appurl} </h2>`
    // })

    done(null, profile, `new github user was registered`)
  }

  // router.get('/callback', (req, res, next) => {
  console.log('1github callback route /auth/github/callback called now')
  console.log('1request object', req.query)
  // let z = `https://www.nxp.com/support/support/nxp-partner-directory:PARTNER-DIRECTORY#/{collection=partners&start=0&max=25&language=en&app=PartnerDirectory&parameters=applicationTax.deviceTax.ProdPartnerType.engagementModel.Location.serviceType.Vendor&query=applicationTax%3E%3Ec209&siblings=false}`
  // console.log('test parse', url.parse(z))
  let x = url.parse(req.query.state)
  console.log('state parsed ', x)
  let appurl = `${x.protocol}//${x.host}${x.pathname}`
  console.log('1appurl is now', appurl)

  const regex = /(?:^|[?&])appurl=([^&]*)/g
  let m = regex.exec(req.query.state)

  let redirecturl = `${m[1]}`
  console.log('1redirecturl', redirecturl)

  passport.authenticate(
    'github',
    {
      scope: ['user:email'],
      state: `${appurl}?appurl=${redirecturl}`
    },
    function (err, profile) {
      console.log('2passport.authenticate callback called')

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
          }login?redirecturl=${redirecturl}&token=${token}`
        )
        res.writeHead(302, {
          Location: `${appNormalUrl}${
            hasHash ? '' : '/'
          }login?redirecturl=${redirecturl}&token=${token}`
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
