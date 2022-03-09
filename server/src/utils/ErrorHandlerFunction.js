const {ApiError} = require("../Error/ApiError");

module.exports.errorHandler = function errorHandler(e) {
    if (e instanceof ApiError) return e
    return ApiError.badRequest(e.message)
}