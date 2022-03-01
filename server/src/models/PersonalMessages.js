const sequelize = require('../database')
const {DataTypes} = require("sequelize");
const e = require("express");

const PersonalMessagesModel = sequelize.define('personal_messages', {
    id: {type: DataTypes.UUID, primaryKey: true, notNull: true},
    ext_path: {type: DataTypes.STRING, notNull: true},
    message_type: {type: DataTypes.STRING, notNull: true},
    dispatch_date: {type: DataTypes.DATE, notNull: true},
    checked: {type: DataTypes.BOOLEAN, notNull: true}
})

module.exports = PersonalMessagesModel