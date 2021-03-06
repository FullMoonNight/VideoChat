const sequelize = require('../database')
const {DataTypes} = require("sequelize");

const FriendsModel = sequelize.define('friends_link', {
    id: {type: DataTypes.UUID, primaryKey: true, unique: true},
    accepted: {type: DataTypes.BOOLEAN}
    //user_id_first - пользователь
    //user_id_second - его друг
})

module.exports = FriendsModel