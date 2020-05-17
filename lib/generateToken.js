const jwt = require('jsonwebtoken');

const newToken = user => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN
  })
}

const generateToken = (user) => {
  console.log('generate Token::', user)
  // return jwt.sign({
  //   id: user.id,
  //   email: user.email,
  //   name: user.name,
  //   provider: user.provider,
  //   right: user.right
  // }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESIN });
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN
  })

};

module.exports = generateToken;

