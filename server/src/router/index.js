const Router = require("express");
const UserRouter = require('./UserRouter.js')


const router = new Router()

router.use('/user', UserRouter)


module.exports = router