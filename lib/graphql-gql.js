import { gql } from 'apollo-boost'

export const PROVIDERS = gql`
  query Providers {
    providers
  }
`

export const ALL_USERS_QUERY = gql`
  query Users {
    users {
      _id
      username
      email
      provider
      rights {
        app
        role
      }
    }
  }
`
export const ONE_USER_QUERY = gql`
  query User($userInput: UserInput!) {
    user(input: $userInput) {
      _id
      username
      email
      provider
      rights {
        app
        role
      }
    }
  }
`

export const ADD_USER = gql`
  mutation addUser($newUser: NewUserInput!) {
    newUser(input: $newUser) {
      _id
      email
      username
      provider
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUser: DeleteUserInput!) {
    deleteUser(input: $deleteUser) {
      deleted
      _id
    }
  }
`

export const ADD_USER_RIGHTS = gql`
  mutation AddUserRights($newRights: NewUserRights!) {
    addUserRights(input: $newRights) {
      _id
      username
      email
      provider
      rights {
        app
        role
      }
    }
  }
`

export const REMOVE_USER_RIGHTS = gql`
  mutation RemovedUserRights($removeRights: RemoveUserRights!) {
    removeUserRights(input: $removeRights) {
      _id
      username
      email
      provider
      rights {
        app
        role
      }
    }
  }
`

export const UPDATE_USER_RIGHT = gql`
  mutation UpdateUserRight($newRole: UpdateUserRoleInput!) {
    updateUserRole(input: $newRole) {
      _id
      username
      email
      provider
      rights {
        app
        role
      }
    }
  }
`

export const ROLES_FOR_APP = gql`
  query RolesForApp($appname: AppInput!) {
    rolesForApp(input: $appname) {
      app
      roles
    }
  }
`

export const ALL_APPS_QUERY = gql`
  query allApps {
    apps {
      _id
      app
      url
      roles
    }
  }
`

export const ADD_APP = gql`
  mutation addApp($newApp: NewAppInput!) {
    newApp(input: $newApp) {
      _id
      app
      url
      roles
    }
  }
`

export const UPDATE_APP = gql`
  mutation updateApp($appUpdated: UpdateAppInput!) {
    newApp(input: $appUpdated) {
      _id
      app
      url
      roles
    }
  }
`

export const DELETE_APP = gql`
  mutation deleteApp($deleteApp: DeleteAppInput!) {
    deleteApp(input: $deleteApp) {
      deleted
      _id
    }
  }
`
