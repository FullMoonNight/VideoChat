const Router = require("express");
const UserAuthController = require('../controllers/UserAuthController')
const authMiddleware = require('../middlewares/AuthMiddleware')

const router = new Router()

router.post('/registration', UserAuthController.registration)
router.post('/login', UserAuthController.login)
router.post('/logout', UserAuthController.logout)
router.post('/refresh', UserAuthController.refresh)
router.get('/checkauth', authMiddleware, UserAuthController.checkAuth)

module.exports = router