require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const authCtrl = require('./controllers/authController')

const app = express()
const PORT = 4000

let { CONNECTION_STRING, SESSION_SECRET } = process.env

app.use(express.json())

app.use(
    session({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: false
    })
)

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
})

app.post('/auth/register', authCtrl.register)

app.post('/auth/login', authCtrl.login)

app.get('/auth/logout', authCtrl.logout)

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})