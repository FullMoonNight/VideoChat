const Router = require("express");
const RoomsController = require('../controllers/RoomsController')


const router = new Router()

router.get('/', RoomsController.getUserRooms)
router.post('/create_room', RoomsController.createNewRoom)
router.get('/room_info', RoomsController.getRoomInfo)
router.post('/confirm', RoomsController.confirmJoinRoom)
router.post('/leave', RoomsController.leaveRoom)


module.exports = router