const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require("path");

const app = express()
const server = require('http').createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)

const MainRouter = require('./router')
const ErrorMiddleware = require('./middlewares/ErrorMiddleware')

const sequelize = require('./database')
const {} = require('./models')

const PORT = process.env.PORT || 5000;
console.log(path.resolve(__dirname, 'static'))


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', MainRouter);
app.use(ErrorMiddleware);


(async function start() {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server has been started on ${PORT}`))
    } catch (e) {
        console.log(e)
    }
})()