/*
 * @Author: Mai Trung Duc
 * @Last Modified by: Mai Trung Duc
 * @Last Modified time: 2020-07-23 22:32:37
 * @Copyright © 2019 Mai Trung Duc. All rights reserved
 */

const User = require('../models/User')

class UserController {
  static async register(req, res, next) {
    try {

      const checkEmail = await User.findOne({ email: req.body.email })

      if (checkEmail) {
        return res.status(123).json({
          message: 'Email is already exist!',
        })
      }

      const user = new User({
        email: req.body.email.trim(),
        password: req.body.password.trim(),
        displayName: req.body.displayName ? req.body.displayName.trim() : 'No name',
      })

      await user.save()

      const { password, ...result } = user.toObject()

      return res.json(result)
    } catch (e) {
      if (e.name === 'ValidationError') {
        return res.status(122).json({
          message: e.message,
          status: 122,
        })
      }
      return res.status(500).json({
        message: 'Error when creating user',
      })
    }
  }

  static login(req, res, next) {
    try {
      return res.json(req.user)
    } catch (e) {
      return res.status(500).json({
        message: 'Server Error',
      })
    }
  }

  static async getUser(req, res, next) {
    try {
      return res.json(req.user)
    } catch (e) {
      return res.status(500).json({
        message: 'Server Error',
      })
    }
  }
}

module.exports = UserController