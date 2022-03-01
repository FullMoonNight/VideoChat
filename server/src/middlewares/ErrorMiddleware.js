const {ApiError} = require('../Error/ApiError')

const ErrorMiddleware = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message})
    }
    return res.status(500).json({message: "Undefined error..."})
}

module.exports = ErrorMiddleware