const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy

export default (req, res) => {
  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (obj, done) {
    done(null, obj)
  })

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
        // findGithubUserOrCreate(profile, done)
      }
    )
  )

  // const findGithubUserOrCreate = async (profile, done) => {
  //   console.log('findgithubuser 1')
  //   console.log('gh1 profile passed ==>', profile)
  //   let appurl = req.query.state
  //   console.log('appurl is set to==>', appurl)
  //   const username = profile.username ? profile.username : profile.email

  //   let getUser = await db.findOne({ email: profile.email })
  //   let app = await db.findOne({ url: appurl })

  //   console.log('getUser', getUser)
  //   console.log('app', app)

  //   profile = {
  //     username: 'foo',
  //     email: 'foo@goo.com',
  //     provider: 'GITHUB'
  //   }
  //   done(null, profile, `new github user was registered`)
  // }

  ////////////////////////   GITHUB STRATEGY  ///////////////////////////////////

  console.log('req.query object', req.query)
  // res.status(200).json({ text: 'github api' })
  if (!req.query.appurl || !req.query.redirecturl) {
    res.status(500).json({ error: 'Not all info needed for request' })
    res.end()
  }

  console.log('github authenticate route / called now')
  let appurl = req.query.appurl
  let redirecturl = req.query.redirecturl || req.query.appurl
  console.log('redirecturl1', redirecturl)
  console.log('appurl1', appurl)

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
      // if (err) {
      //   return next(err)
      // }
      // if (!user) {
      //   return res.redirect('/login')
      // }
      // req.logIn(user, function (err) {
      //   if (err) {
      //     return next(err)
      //   }
      //   return res.redirect('/protected')
      // })
    }
  )(req, res, a => {
    console.log('next function called with==>', a)
  })
}
