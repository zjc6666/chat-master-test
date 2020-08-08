const User = require('../models/User')
const jwt = require('jsonwebtoken')


function decodeToken(token) {
  try {
    const decode = jwt.verify(token, 'secret_key')
    return decode
  } catch (error) {
    console.log(error)
    return null
  }
}

async function isAuthenticated(req, res, next) { // check if token is belonged to user
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = decodeToken(token) // always pass because it passed isTokenValid
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        message: 'Access token doesn\'t belong to any user!',
      })
    }

    if (token !== user.token) {
      return res.status(401).json({
        message: 'Access token doesn\'t exist or expired. Please login again to get your token!',
      })
    }

    req.user = user

    return next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      message: 'Unauthenticated!',
    })
  }
}

exports.isAuthenticated = isAuthenticated