const {sign, verify} = require('jsonwebtoken')
const {TokensModel} = require("../models");
const {v4} = require("uuid");
require('dotenv').config()

class JwtService {
    generateTokens(payload) {
        const accessToken = sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_EXPIRES})
        const refreshToken = sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRES})

        return {
            accessToken,
            refreshToken
        }
    }

    async updateToken(userId, refreshToken) {
        const userToken = await TokensModel.findOne({where: {user_id: userId}})
        if (!userToken) {
            return await this.saveNewToken(userId, refreshToken)
        }
        userToken.token = refreshToken
        await userToken.save()
    }

    async saveNewToken(userId, refreshToken) {
        await TokensModel.create({
            id: v4(),
            user_id: userId,
            token: refreshToken
        })
    }

    async deleteToken(token) {
        const tokenDB = await TokensModel.findOne({where: {token}})
        tokenDB && await tokenDB.destroy()
    }

    validateAccessToken(accessToken) {
        try {
            return verify(accessToken, process.env.JWT_ACCESS_SECRET)
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(refreshToken) {
        try {
            return verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        } catch (e) {
            return null
        }
    }

    async findToken(user_id) {
        return await TokensModel.findOne({where: {user_id}})
    }
}

module.exports = new JwtService()