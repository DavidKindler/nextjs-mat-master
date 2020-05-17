module.exports = {
  env: {
    customKey: 'my-value',
    EMAIL_ADDRESS: 'nxp.emailer@gmail.com',
    EMAIL_PASSWORD: 'tvcfdrujwdnracoa',
    EMAIL_SEND_TO: 'david.kindler@nxp.com',
    JWT_SECRET: 'nxpSuperSecretJWTPassword',
    JWT_EXPIRESIN: '30m',
    dev: {
      GITHUB_CLIENT_ID: 'c4ba0cb061db10f326f4',
      GITHUB_CLIENT_SECRET: 'ce8aafa5ab1262f35dcd95cf4a407dd969692d4c',
      GITHUB_CALLBACK_URL: 'http://localhost:3000/api/auth/github/callback',
      REACT_APP_AUTH_URL: 'http://localhost:3000'
    },
    prod: {
      REACT_APP_AUTH_URL: 'http://az84ap07v.am.freescale.net:3000'
    }
  }
}
