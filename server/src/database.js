const {Sequelize} = require('sequelize')
const cls = require('cls-hooked')
const namespace = cls.createNamespace('main-namespace')
Sequelize.useCLS(namespace)

require('dotenv').config()

const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
)

module.exports = sequelize