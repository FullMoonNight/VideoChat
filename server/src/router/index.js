const Router = require("express");
const UserAuthRouter = require('./UserAuthRouter')
const UserProfileRouter = require('./UserProfileRouter')


const router = new Router()

router.use('/authenticate', UserAuthRouter)
router.use('/profile_settings', UserProfileRouter)

module.exports = router