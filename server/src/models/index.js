const UserModel = require('./UserModel')
const TokensModel = require('./TokensModel')
const UserSettingsModel = require('./UserSettingsModel')
const ChatMessagesModel = require('./ChatMessagesModel')
const RoomChatModel = require('./RoomChatModel')
const RoomModel = require('./RoomModel')
const FriendsModel = require('./FriendsModel')
const PersonalMessagesModel = require('./PersonalMessages')
const {DataTypes} = require("sequelize");

//User-Tokens relation
UserModel.hasMany(TokensModel, {
    foreignKey: 'user_id',
    keyType: DataTypes.UUID
})
TokensModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    keyType: DataTypes.UUID
})

//User-UserAccountSettings relation
UserModel.hasOne(UserSettingsModel, {
    foreignKey: 'user_id',
    keyType: DataTypes.UUID
})
UserSettingsModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    keyType: DataTypes.UUID
})

//User-ChatMessages relation
UserModel.hasMany(ChatMessagesModel, {
    foreignKey: 'user_id',
    keyType: DataTypes.UUID
})
ChatMessagesModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    keyType: DataTypes.UUID
})

//User-Room relation
UserModel.hasMany(RoomModel, {
    foreignKey: 'owner',
    keyType: DataTypes.UUID
})
RoomModel.belongsTo(UserModel, {
    foreignKey: 'owner',
    keyType: DataTypes.UUID
})

//User-Friends relation
UserModel.hasMany(FriendsModel, {
    foreignKey: 'user_id_first',
    keyType: DataTypes.UUID
})
FriendsModel.belongsTo(UserModel, {
    foreignKey: 'user_id_first',
    keyType: DataTypes.UUID
})

UserModel.hasMany(FriendsModel, {
    foreignKey: 'user_id_second',
    keyType: DataTypes.UUID
})
FriendsModel.belongsTo(UserModel, {
    foreignKey: 'user_id_second',
    keyType: DataTypes.UUID
})

//Room-RoomChat relation
RoomModel.hasOne(RoomChatModel, {
    foreignKey: 'room_id',
    keyType: DataTypes.UUID
})
RoomChatModel.belongsTo(RoomModel, {
    foreignKey: 'room_id',
    keyType: DataTypes.UUID
})

//RoomChat-ChatMessages relation
RoomChatModel.hasMany(ChatMessagesModel, {
    foreignKey: 'chat_id',
    keyType: DataTypes.UUID
})
ChatMessagesModel.belongsTo(RoomChatModel, {
    foreignKey: 'chat_id',
    keyType: DataTypes.UUID
})

//User - PersonalMessages
UserModel.hasMany(PersonalMessagesModel, {
    foreignKey: 'source_user_id',
    keyType: DataTypes.UUID
})
PersonalMessagesModel.belongsTo(UserModel, {
    foreignKey: 'source_user_id',
    keyType: DataTypes.UUID
})

UserModel.hasMany(PersonalMessagesModel, {
    foreignKey: 'destination_user_id',
    keyType: DataTypes.UUID
})
PersonalMessagesModel.belongsTo(UserModel, {
    foreignKey: 'destination_user_id',
    keyType: DataTypes.UUID
})

module.exports = {
    UserModel,
    TokensModel,
    UserSettingsModel,
    ChatMessagesModel,
    RoomChatModel,
    RoomModel,
    FriendsModel,
    PersonalMessagesModel,
}