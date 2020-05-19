const passport = require('passport')

export default (req, res) => {
  res.status(200).json({ data: req.query })
  res.end()
}
