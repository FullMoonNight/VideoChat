const path = require("path");

const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const app = express()
const server = require('http').createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)

const MainRouter = require('./router')
const ErrorMiddleware = require('./middlewares/ErrorMiddleware')

const sequelize = require('./database')
const {} = require('./models')

const SocketInterface = require('./socket/SocketInterface')

const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(fileUpload({}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', MainRouter);
app.use(ErrorMiddleware);

new SocketInterface(io);

(async function start() {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(PORT, () => console.log(`Server has been started on ${PORT}`))
    } catch (e) {
        console.log(e)
    }
})()