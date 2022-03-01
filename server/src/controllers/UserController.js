const {ApiError} = require("../Error/ApiError");
const UserService = require('../services/UserService')

function errorHandler(e) {
    if (e instanceof ApiError) return e
    return ApiError.badRequest(e.message)
}

class UserController {
    async registration(req, res, next) {
        try {
            const {email, username, password} = req.body
            const {refreshToken: newRefreshToken, email: e, ...userDto} = await UserService.registration(email, username, password)
            res.cookie('refreshToken', newRefreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.status(200).json(userDto)
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const {refreshToken: newRefreshToken, email: e, ...userDto} = await UserService.login(email, password)
            res.cookie('refreshToken', newRefreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.status(200).json(userDto)
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.send('ok');
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const {refreshToken: newRefreshToken, email, ...userDto} = await UserService.refresh(refreshToken)
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

module.exports = new UserController()