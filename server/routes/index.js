const express = require('express')
const router = express.Router()
const passport = require('../modules/passport')
const UserController = require('../controllers/UserController')
const middlewares = require('../middlewares/index')

router.get('/user', middlewares.isAuthenticated, UserController.getUser)
router.post('/login', passport.authenticate('local', { session: false, failWithError: true }), UserController.login)
router.post('/register', UserController.register)

module.exports = router
