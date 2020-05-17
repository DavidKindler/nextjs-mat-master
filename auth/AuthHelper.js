import decode from 'jwt-decode'
import CustomError from './CustomErrorObject'

export default class AuthHelper {
  /////////////////////  Auth Utils //////////////////////////////////////////////
  loggedIn = () => {
    const token = this.getToken()
    return !!token && !this.isTokenExpired(token)
  }

  isTokenExpired = token => {
    try {
      const decoded = decode(token)
      if (decoded.exp < Date.now() / 1000) {
        return true
      } else return false
    } catch (err) {
      console.log('token invalid or expired')
      return false
    }
  }

  setToken = tkn => {
    if (process.browser) {
      localStorage.setItem('jwt', tkn)
    }
  }

  getToken = () => {
    if (process.browser) {
      return localStorage.getItem('jwt')
    }
  }

  logout = () => {
    if (process.browser) {
      localStorage.removeItem('jwt')
    }
  }

  adminRole = () => {
    let user = this.decodeTkn()
    if (!user) return null
    if (!user.right) return false
    let adminRole = user.right.some(item => {
      if (typeof item.app === 'undefined' || typeof item.role === 'undefined') {
        return false
      } else {
        return (
          (item.app &&
            item.app.trim() === 'MASTER' &&
            item.role &&
            item.role.trim() === 'ADMIN') ||
          item.role.trim() === 'SUPERADMIN'
        )
      }
    })
    return adminRole ? true : false
  }

  appsAccess = () => {
    let user = this.decodeTkn()
    if (!user) return null
    if (!user.right) return false
    let apps = user.right.map(item => item.app)
    return apps
  }

  userRights = () => {
    let user = this.decodeTkn()
    if (!user) return null
    if (!user.right) return false
    let rights = user.right.map(item => {
      return { app: item.app, role: item.role }
    })
    return rights
  }

  decodeTkn = () => {
    let token = this.getToken()
    let answer
    try {
      answer = decode(token)
      return answer
    } catch (err) {
      return null
    }
  }

  /////////////////////  END Auth Utils //////////////////////////////////////////////

  ////////////////////// AUTH APIs  ////////////////////////////////////////////////////

  getApp = app => {
    console.log('get app', app)
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/getApp`, {
      method: 'POST',
      body: JSON.stringify({ app })
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp getApp err is', err)
      })
  }

  addApp = app => {
    console.log('add app', app)
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/addApp`, {
      method: 'POST',
      body: JSON.stringify(app)
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp addApp err is', err)
      })
  }

  deleteApp = app => {
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/deleteApp`, {
      method: 'POST',
      body: JSON.stringify(app)
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp deleteApp err is', err)
      })
  }

  addRole = newRoleInfo => {
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/addRole`, {
      method: 'POST',
      body: JSON.stringify(newRoleInfo)
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp addRole err is', err)
      })
  }

  deleteRole = role => {
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/deleteRole`, {
      method: 'POST',
      body: JSON.stringify(role)
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp addRole err is', err)
      })
  }

  getRoles = () => {
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/getRoles`, {
      method: 'POST'
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp getRoles err is', err)
      })
  }

  getRolesForApp = app => {
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/getRolesForApp`, {
      method: 'POST',
      body: JSON.stringify(app)
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp getRolesForApp err is', err)
      })
  }

  updateUrl = urlInfo => {
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/updateUrl`, {
      method: 'POST',
      body: JSON.stringify(urlInfo)
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp updateUrl err is', err)
      })
  }

  getUser = username => {
    console.log('get user', username)
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/getUser`, {
      method: 'POST',
      body: JSON.stringify({ username })
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp getUser err is', err)
      })
  }

  deleteRight = info => {
    console.log('deleteRight', info)
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/deleteRight`, {
      method: 'POST',
      body: JSON.stringify(info)
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp deleteRight err is', err)
      })
  }

  addRight = info => {
    console.log('addRight', info)
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/addRight`, {
      method: 'POST',
      body: JSON.stringify(info)
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp addRight err is', err)
      })
  }

  changeRight = newRoleInfo => {
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/changeRight`, {
      method: 'POST',
      body: JSON.stringify(newRoleInfo)
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp changeRight err is', err)
      })
  }

  deleteUser = user => {
    console.log('delete user', user)
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/deleteUser`, {
      method: 'POST',
      body: JSON.stringify(user)
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp getUser err is', err)
      })
  }

  getAllUsers = obj => {
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/getAllUsers`, {
      method: 'GET'
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp getAllUsers err is', err)
      })
  }

  getAllApps = obj => {
    return this.fetch(`${process.env.REACT_APP_AUTH_URL}/api/getAllApps`, {
      method: 'GET'
    })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.log('authHelp getAllApps err is', err)
      })
  }

  ///////////////////////   AUTH Fetch ///////////////////////////////////////////////
  fetch = (url, options) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    if (this.loggedIn()) {
      headers['Authorization'] = 'Bearer ' + this.getToken()
    }

    return fetch(url, { headers, ...options })
      .then(response => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        if (!response.ok) {
          // console.log('response not okay', response)
          // console.log('response not okay json', json)
          throw new CustomError(
            false,
            response.status,
            response.statusText,
            json.error.message
          )
        }
        // console.log('json response:::', json)
        return json
      })
      .catch(e => {
        console.log('fetch got an error', e.ok)
        console.log('fatch error name', e.name)
        console.log('fatch error status', e.status)
        console.log('fetch error statusText', e.statusText)
        console.log('fetch error message', e.message)
        return e
      })
  }

  ///////////////////// End Auth Fetch ////////////////////////////////////////////////
}
