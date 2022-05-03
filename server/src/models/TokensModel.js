const sequelize = require('../database')
const {DataTypes} = require("sequelize");


const TokensModel = sequelize.define('tokens', {
    id: {type: DataTypes.UUID, primaryKey: true, unique: true},
    token: {type: DataTypes.STRING, notNull: true, unique: true}
    //user_id - ссылка на пользователя, которому принадлежит токен
})

module.exports = TokensModel