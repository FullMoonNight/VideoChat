const Router = require("express");
const UserAuthRouter = require('./UserAuthRouter')
const UserProfileRouter = require('./UserProfileRouter')
const authMiddleware = require('../middlewares/AuthMiddleware')


const router = new Router()

router.use('/authenticate', UserAuthRouter)
router.use('/profile_settings', authMiddleware, UserProfileRouter)

module.exports = router