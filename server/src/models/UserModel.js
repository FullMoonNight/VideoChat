const sequelize = require('../database')
const {DataTypes} = require("sequelize");

const UserModel = sequelize.define('user', {
    user_id: {type: DataTypes.UUID, primaryKey: true, unique: true},
    email: {type: DataTypes.STRING, unique: true, notNull: true},
    password: {type: DataTypes.STRING, notNull: true},
    accountApprove: {type: DataTypes.BOOLEAN, notNull: true}
})

module.exports = UserModel