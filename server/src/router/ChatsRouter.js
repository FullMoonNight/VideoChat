const Router = require('express')
const ChatController = require('../controllers/ChatController')


const router = new Router()

router.get('/', ChatController.getUserChats)
router.post('/send_message', ChatController.sendMessage)
router.post('/create_chat', ChatController.createChat)
router.get('/chat_messages', ChatController.getChatMessages)

module.exports = router