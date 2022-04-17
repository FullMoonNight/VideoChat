const Router = require("express");
const UserAuthRouter = require('./UserAuthRouter')
const UserProfileRouter = require('./UserProfileRouter')
const UserFriendRouter = require('./UserFriendRouter')
const RoomsRouter = require('./RoomsRouter')
const authMiddleware = require('../middlewares/AuthMiddleware')


const router = new Router()

router.use('/authenticate', UserAuthRouter)
router.use('/profile_settings', authMiddleware, UserProfileRouter)
router.use('/friends', authMiddleware, UserFriendRouter)
router.use('/user_rooms', authMiddleware, RoomsRouter)

module.exports = router