const passport = require('passport')
const normalizeUrl = require('normalize-url')
const createError = require('http-errors')
const GitHubStrategy = require('passport-github2').Strategy

export default (req, res, next) => {
  // res.status(200).json({ text: 'github callback' })
  // }

  // router.get('/callback', (req, res, next) => {
  console.log('github callback route /auth/github/callback called now')
  let appurl = req.query.state
  let redirecturl = appurl
  process.env.NODE_ENV !== 'production' && console.log('appurl', appurl)
  passport.authenticate(
    'github',
    { scope: ['user:email'], state: appurl },
    function (err, profile) {
      if (err) {
        return next(err)
      }
      if (profile) {
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
          }authredirect/?redirecturl=${appurl}&token=${token}`
        )
        res.redirect(
          `${appNormalUrl}${
            hasHash ? '' : '/'
          }authredirect/?redirecturl=${appurl}&token=${token}`
        )
      } else {
        next(createError(503, 'No profile'))
      }
    }
  )(req, res, next)
}
