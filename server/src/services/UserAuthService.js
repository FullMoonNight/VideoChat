const sequelize = require("../database");
const JwtService = require("./JwtService")
const UserProfileService = require("./UserProfileService.js")
const {UserModel, TokensModel, UserSettingsModel} = require('../models')
const {v4} = require('uuid')
const {hash, compare} = require("bcrypt");
const {ApiError} = require("../Error/ApiError");

class UserAuthService {
    async registration(email, username, password) {
        return await sequelize.transaction(async (t) => {
            const emailCandidate = await UserModel.findOne({where: {email}})
            if (emailCandidate) {
                throw new Error('User with this email already exist')
            }
            const usernameCandidate = await UserSettingsModel.findOne({where: {username}})
            if (usernameCandidate) {
                throw new Error('User with this username already exist')
            }
            const encodedPassword = await hash(password, 4)
            const user = await UserModel.create({
                user_id: v4(),
                email,
                password: encodedPassword,
                accountApprove: false
            })
            const userAvatarId = await UserProfileService.generateDefaultUserAvatar(user.user_id, username)
            await UserSettingsModel.create({
                id: v4(),
                user_id: user.user_id,
                username,
                imageId: userAvatarId,
                status: 'active'
            })
            const {accessToken, refreshToken} = JwtService.generateTokens({userId: user.user_id, email: user.email})

            await JwtService.saveNewToken(user.user_id, refreshToken)

            return {
                userId: user.user_id,
                email: user.email,
                accessToken,
                refreshToken
            }
        })
    }

    async login(email, password) {
        return await sequelize.transaction(async () => {
            const user = await UserModel.findOne({where: {email}})
            if (!user) {
                throw new Error("Incorrect email or password")
            }
            if (!user.accountApprove) {
                //Perform some logic for send message to confirm the account email
                // throw new Error("Email on this account isn't confirm")
            }
            const equalPasswords = await compare(password, user.password)
            if (!equalPasswords) {
                throw new Error("Incorrect email or password")
            }

            const {accessToken, refreshToken} = JwtService.generateTokens({userId: user.user_id, email: user.email})

            await JwtService.updateToken(user.user_id, refreshToken)

            return {
                userId: user.user_id,
                email: user.email,
                accessToken,
                refreshToken
            }
        })
    }

    async logout(refreshToken) {
        if (!refreshToken) throw new Error()
        await JwtService.deleteToken(refreshToken)
    }

    async refresh(refreshToken) {
        return sequelize.transaction(async () => {
            if (!refreshToken) {
                throw ApiError.unauthorized()
            }
            const userData = JwtService.validateRefreshToken(refreshToken)
            const tokenFromDB = await JwtService.findToken(userData.userId)
            if (!userData || tokenFromDB.token !== refreshToken) {
                throw ApiError.unauthorized()
            }

            const {accessToken, refreshToken: newRefreshToken} = JwtService.generateTokens({userId: userData.userId, email: userData.email})
            await JwtService.updateToken(userData.userId, newRefreshToken)
            return {
                userId: userData.userId,
                email: userData.email,
                accessToken,
                refreshToken: newRefreshToken
            }
        })
    }

}

module.exports = new UserAuthService()