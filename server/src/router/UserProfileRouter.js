const Router = require("express");
const UserProfileController = require('../controllers/UserProfileController')


const router = new Router()


router.get('/', UserProfileController.getProfileSettings)
router.post('/', UserProfileController.saveProfileSettings)

module.exports = router