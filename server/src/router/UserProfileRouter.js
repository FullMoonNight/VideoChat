const Router = require("express");
const authMiddleware = require('../middlewares/AuthMiddleware')

const router = new Router()

router.post('/', (req, res, next) => {
    console.log('log', req.files)
    // console.log(req)
    res.json('ok')
})

module.exports = router