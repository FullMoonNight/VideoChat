class ApiError extends Error {
    constructor(status, message) {
        super();
        this.message = message
        this.status = status
    }

    static badRequest(message) {
        return new ApiError(404, message)
    }

    static forbidden(message) {
        return new ApiError(403, message)
    }

    static unauthorized(message) {
        return new ApiError(401, message || 'User is not authorized')
    }

    static internal(message) {
        return new ApiError(500, message)
    }
}

module.exports = {ApiError}