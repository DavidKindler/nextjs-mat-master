const passport = require('passport')
const normalizeUrl = require('normalize-url')
const generateToken = require('../../../../lib/generateToken')
import { useRouter } from 'next/router'

function RedirectPage ({ ctx }) {
  const router = useRouter()
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push('/new/url')
    return
  }
}

RedirectPage.getInitialProps = ctx => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: '/new/url' })
    ctx.res.end()
  }
  return {}
}

export default (req, res, next) => {
  // res.status(200).json({ text: 'github callback' })
  // }

  // router.get('/callback', (req, res, next) => {
  console.log('github callback route /auth/github/callback called now')
  let appurl = req.query.state
  let redirecturl = appurl
  process.env.NODE_ENV !== 'production' && console.log('appurl2', appurl)
  passport.authenticate(
    'github',
    { scope: ['user:email'], state: appurl },
    function (err, profile) {
      console.log('callback function with profile', profile)
      if (err) {
        // return next(err)
        // createError(500, err)
        res.writeHead(503)
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
          }authredirect/?redirecturl=${appurl}&token=${token}`
        )
        res.writeHead(302, {
          Location: `${appNormalUrl}${
            hasHash ? '' : '/'
          }authredirect/?redirecturl=${appurl}&token=${token}`
        })
        res.end()

        // res.redirect(
        //   `${appNormalUrl}${
        //     hasHash ? '' : '/'
        //   }authredirect/?redirecturl=${appurl}&token=${token}`
        // )
      } else {
        // createError(503, 'No Profile')
        // next(createError(503, 'No profile'))
        res.writeHead(503)
        res.end()
      }
    }
  )(req, res)
}
