const Router = require("express");
const UserController = require('../controllers/UserController')
const authMiddleware = require('../middlewares/AuthMiddleware')

const router = new Router()

router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.post('/refresh', UserController.refresh)
router.get('/checkauth', authMiddleware, UserController.checkAuth)

module.exports = router