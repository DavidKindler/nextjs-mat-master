const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
global.fetch = require('node-fetch')

module.exports = (phase, { defaultConfig }) => {
  let port = 3000
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      target: 'server',
      env: {
        PORT: port,
        EMAIL_ADDRESS: 'nxp.emailer@gmail.com',
        EMAIL_PASSWORD: 'tvcfdrujwdnracoa',
        EMAIL_SEND_TO: 'david.kindler@nxp.com',
        JWT_SECRET: 'nxpSuperSecretJWTPassword',
        JWT_EXPIRESIN: '15m',
        UAT_URL: 'https://uat.nxp.com/security',
        GITHUB_CLIENT_ID: 'c4ba0cb061db10f326f4',
        GITHUB_CLIENT_SECRET: 'ce8aafa5ab1262f35dcd95cf4a407dd969692d4c',
        GITHUB_CALLBACK_URL: `http://localhost:${port}/api/auth/github/callback`,
        REACT_APP_AUTH_URL: `http://localhost:${port}`,
        API_URL: `http://localhost:${port}`
      }
    }
  }
  port = 4000
  return {
    target: 'server',
    env: {
      PORT: port,
      EMAIL_ADDRESS: 'nxp.emailer@gmail.com',
      EMAIL_PASSWORD: 'tvcfdrujwdnracoa',
      EMAIL_SEND_TO: 'david.kindler@nxp.com',
      JWT_SECRET: 'nxpSuperSecretJWTPassword',
      JWT_EXPIRESIN: '30m',
      UAT_URL: 'https://uat.nxp.com/security',
      REACT_APP_AUTH_URL: `http://localhost:${port}`,
      API_URL: `http://localhost:${port}`
    }
  }
}
