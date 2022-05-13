const sequelize = require('../database')
const {DataTypes} = require("sequelize");

const UserSettingsModel = sequelize.define('user_settings', {
    id: {type: DataTypes.UUID, primaryKey: true, notNull: true, unique: true},
    name: {type: DataTypes.STRING},
    surname: {type: DataTypes.STRING},
    username: {type: DataTypes.STRING},
    imageId: {type: DataTypes.UUID},
    status: {type: DataTypes.STRING}
    //user_id - ссылка на пользователя
})

module.exports = UserSettingsModel