const {
  getAppsAndRoles,
  Users,
  Rights,
  Roles,
  Apps,
  APPS,
  ROLES
} = require('../../lib/db')

export default (req, res) => {
  res.status(200).json({ text: 'Hello graphql' })
}
