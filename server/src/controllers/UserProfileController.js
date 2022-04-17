const {errorHandler} = require('../utils/ErrorHandlerFunction')
const UserProfileService = require('../services/UserProfileService.js')


class UserProfileController {
    async getProfileSettings(req, res, next) {
        try {
            const userId = req._user.userId
            const userProfileSettings = await UserProfileService.getProfileSettings(userId)
            res.json(userProfileSettings)
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async saveProfileSettings(req, res, next) {
        try {
            const userId = req._user.userId
            const imageFile = req.files.files
            const userSettings = JSON.parse(req.body.body)

            const savedUserSettings = await UserProfileService.updateUserSettings(userId, userSettings, imageFile)
            res.json(savedUserSettings)
        } catch (e) {
            next(errorHandler(e))
        }
    }
}

module.exports = new UserProfileController()