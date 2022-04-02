const sequelize = require('../database')
const {UserSettingsModel} = require("../models");
const {createCanvas, loadImage} = require('canvas')
const fs = require("fs/promises");
const path = require("path");
const {v4} = require("uuid");
const sharp = require('sharp')


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
        const w = 100, h = 100;
        const usernameFirstLetters = username.toUpperCase().split(' ').filter(e => e).map(e => e[0]).join('')
        const canvas = createCanvas(w, h)
        const ctx = canvas.getContext('2d')

        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 255;
            color += ('00' + value.toString(16)).substr(-2);
        }

        ctx.fillStyle = color
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.font = '90px impact'
        ctx.fillText(usernameFirstLetters, w / 2, h / 2 + 35)
        ctx.fillStyle = '#000'
        ctx.strokeText(usernameFirstLetters, w / 2, h / 2 + 35)

        const userAvatarId = v4()
        const buffer = canvas.toBuffer('image/png')
        await fs.writeFile(`${this.#defaultAvatarPath}/${userId}--${userAvatarId}.png`, buffer)

        return userAvatarId
    }

    async changeUserAvatar(userId, avatarBuffer) {
        const userSettings = await UserSettingsModel.findOne({where: {user_id: userId}})
        const userAvatarId = userSettings.imageId
        await fs.writeFile(`${this.#defaultAvatarPath}/${userId}--${userAvatarId}.png`, avatarBuffer)

        return userAvatarId
    }

    async updateUserSettings(userId, settings) {
        return await sequelize.transaction(async (t) => {
            const currentUserSettings = await UserSettingsModel.findOne({where: {user_id: userId}})
            Object.entries(settings).forEach(([key, value]) => {
                if (value) {
                    currentUserSettings[key] = value
                }
            });
            await currentUserSettings.save()

            return settings
        })
    }
}

module.exports = new UserProfileService()