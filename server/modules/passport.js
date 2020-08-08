const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
  },
  async (email, pass, done) => {
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return done(null, false)
    }

    if (!bcrypt.compareSync(pass, user.password)) {
      return done(null, false)
    }

    const token = jwt.sign({
      email: user.email,
      id: user._id,
    }, 'secret_key', {
      expiresIn: '30d',
    })

    const updatedUser = await User.findByIdAndUpdate(user._id, {
      $set: {
        token
      }
    }, { new: true })

    const { password, ...result } = updatedUser.toObject()
    
    return done(null, result)
  }
))

module.exports = passport