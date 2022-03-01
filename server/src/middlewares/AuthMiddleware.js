const {ApiError} = require('../Error/ApiError')
const JwtService = require('../services/JwtService')

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.unauthorized());
        }
        const accessToken = authorizationHeader.split(" ")[1];
        if (!accessToken) {
            return next(ApiError.unauthorized());
        }
        const userData = JwtService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.unauthorized());
        }
        req._user = userData
        next();
    } catch (e) {
        return next(ApiError.unauthorized());
    }
};