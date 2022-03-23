const Router = require('express')
const UserFriendsController = require('../controllers/UserFriendsController')


const router = new Router()

router.get('/', UserFriendsController.getAllFriends)
router.post('/sendFriendRequest', UserFriendsController.sendFriendRequest)
router.post('/acceptFriendRequest', UserFriendsController.acceptFriendRequest)
router.post('/rejectFriendRequest', UserFriendsController.rejectFriendRequest)


module.exports = router