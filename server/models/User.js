/*
 * @Author: Mai Trung Duc
 * @Last Modified by: Mai Trung Duc
 * @Last Modified time: 2020-07-23 21:10:00
 * @Copyright © 2019 Mai Trung Duc. All rights reserved
 */

const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    lowercase: true,
    // match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Email provided is not a valid email address'],
    minlength: [6, 'Email must be at least 6 characters long'],
    required: true,
    trim: true,
    type: String,
    unique: true,
  },
  password: {
    minlength: [6, 'Password must be at least 6 characters long'],
    required: true,
    select: false,
    trim: true,
    type: String,
  },
  displayName: {
    type: String,
    default: 'No name'
  },
  token: {
    type: String
  }
}, { timestamps: true })

userSchema.pre('save', function(next) {
  if (this.password) {
    this.password = bcrypt.hashSync(this.password, 10)
  }

  return next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
