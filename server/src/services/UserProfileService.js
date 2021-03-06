const sequelize = require('../database')
const {UserSettingsModel} = require("../models");
const fs = require("fs/promises");

const path = require("path");
const {v4} = require("uuid");
const {generateImage} = require("../utils/GenerateImageFunction");


class UserProfileService {
    #defaultAvatarPath = path.join(__dirname, '..', 'static', 'user-avatar')

    async getProfileSettings(userId) {
        const userSettings = await UserSettingsModel.findOne({where: {user_id: userId}});
        return {
            username: userSettings.username,
            name: userSettings.name,
            surname: userSettings.surname,
            userImageId: userSettings.imageId,
            status: userSettings.status
        }
    }

    async generateDefaultUserAvatar(userId, username) {
        const buffer = generateImage(username)

        const userAvatarId = v4()
        try {
            await fs.access(this.#defaultAvatarPath)
        } catch (e) {
            console.log('created user-avatar dir')
            await fs.mkdir(this.#defaultAvatarPath)
        }
        await fs.writeFile(`${this.#defaultAvatarPath}/${userId}--${userAvatarId}.png`, buffer)

        return userAvatarId
    }

    async updateUserSettings(userId, settings, imageFile) {
        return await sequelize.transaction(async () => {
            const currentUserSettings = await UserSettingsModel.findOne({where: {user_id: userId}})
            Object.entries(settings).forEach(([key, value]) => {
                if (value) {
                    currentUserSettings[key] = value
                }
            });
            if (imageFile.size) {
                try {
                    await fs.access(this.#defaultAvatarPath)
                } catch (e) {
                    console.log('created user-avatar dir')
                    await fs.mkdir(this.#defaultAvatarPath)
                }
                await fs.writeFile(`${this.#defaultAvatarPath}/${userId}--${currentUserSettings.imageId}.png`, imageFile.data)
            }
            await currentUserSettings.save()
            return {
                username: currentUserSettings.username,
                name: currentUserSettings.name,
                surname: currentUserSettings.surname,
                userImageId: currentUserSettings.imageId,
                status: currentUserSettings.status
            }
        })
    }
}

module.exports = new UserProfileService()