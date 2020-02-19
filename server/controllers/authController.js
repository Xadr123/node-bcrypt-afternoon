const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const { username, password, isAdmin } = req.body
        const db = req.app.get('db')

        const result = await db.get_user([username])
        if (result[0]) {
            return res.status(409).send('Username Taken')
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const registeredUser = await db.register_user([isAdmin, username, hash])
        const user = registeredUser[0]
        req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username }
        res.status(200).send(req.session.user)
    },

    login: async (req, res) => {
        const { username, password } = req.body
        const db = req.app.get('db')

        const result = await db.get_user(username)
        if (!result[0]) {
            return res.status(401).send('User not found, Please register as a new user')
        }
        const authenticated = bcrypt.compareSync(password, result[0].hash)
        if (authenticated) {
            req.session.user = { isAdmin: result[0].isAdmin, id: result[0].id, username: result[0].username }
            res.status(200).send(req.session.user)
        } else {
            return res.status(401).send('Incorrect password')
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        console.log('destroyed')
        return res.sendStatus(200);
    }
}