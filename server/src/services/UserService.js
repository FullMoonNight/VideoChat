const sequelize = require('../database')


class UserService {
    async getUsers(usernamePart) {
        const SQL_query = `
            select *
            from user_settings
            where username like concat('%', :usernamePart, '%')
        `;
        return  await sequelize.query(SQL_query, {
            replacements: {
                usernamePart
            }
        })
    }
}

module.exports = new UserService()