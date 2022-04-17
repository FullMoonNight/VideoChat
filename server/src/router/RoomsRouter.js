const Router = require("express");
const RoomsController = require('../controllers/RoomsController')


const router = new Router()

router.get('/', RoomsController.getUserRooms)
router.post('/create_room', RoomsController.createNewRoom)


module.exports = router