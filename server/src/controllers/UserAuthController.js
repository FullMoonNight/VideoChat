const {ApiError} = require("../Error/ApiError");
const UserAuthService = require('../services/UserAuthService')
const {errorHandler} = require("../utils/ErrorHandlerFunction");


class UserAuthController {
    async registration(req, res, next) {
        try {
            const {email, username, password} = req.body
            const {refreshToken: newRefreshToken, email: e, ...userDto} = await UserAuthService.registration(email, username, password)
            res.cookie('refreshToken', newRefreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.status(200).json(userDto)
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const {refreshToken: newRefreshToken, email: e, ...userDto} = await UserAuthService.login(email, password)
            res.cookie('refreshToken', newRefreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.status(200).json(userDto)
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            await UserAuthService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.send('ok');
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const {refreshToken: newRefreshToken, email, ...userDto} = await UserAuthService.refresh(refreshToken)
            res.cookie('refreshToken', newRefreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.json(userDto);
        } catch (e) {
            next(errorHandler(e))
        }
    }

    checkAuth(req, res, next) {
        try {
            if (req._user) {
                const {iat, exp, email, ...userDto} = req._user
                res.json(userDto)
            } else {
                next(ApiError.unauthorized())
            }
        } catch (e) {
            next(errorHandler(e))
        }
    }
}

module.exports = new UserAuthController()