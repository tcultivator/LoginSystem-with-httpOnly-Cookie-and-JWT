const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
require('dotenv').config();

const app = express();
app.use(express.json())
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}))
app.use(cookieparser())
const port = 8080;
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log('error connecting to database')
    }
    else {
        console.log('connected to database!')
    }
})


app.post('/login', (req, res) => {
    const data = req.body;
    const query = 'SELECT id FROM accounts WHERE username = ? && password = ?';
    db.query(query, [data.username, data.password], (err, result) => {
        if (!result.length) {
            res.status(200).json({ message: 'no data found!' })
        } else {
            const userData = JSON.parse(JSON.stringify(result[0]));
            const token = jwt.sign(userData, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: '1h' })
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000,
                secure: true
            })
            res.status(200).json({ message: 'success' })
        }
    })
})

app.post('/getme', auth, (req, res) => {
    const verifiedUserId = req.userId;
    console.log('eto na ung verify na id ', verifiedUserId)
    const query = 'SELECT * FROM accounts WHERE id = ?';
    db.query(query, [verifiedUserId], (err, result) => {
        if (!result.length) {
            res.status(401).json({ message: 'no data found' })
        } else {
            const verifiedUserData = JSON.parse(JSON.stringify(result[0]))
            res.status(200).json({ verifiedUserData, message: 'success!!!!!' })
        }
    })

})


function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: 'unathorized user' })
    } else {
        const verifiedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY)
        console.log(verifiedToken.id)
        req.userId = verifiedToken.id;
        next()
    }
}



app.post('/signup', (req, res) => {
    const userData = req.body;
    const query = 'INSERT INTO accounts (username,password)VALUES(?,?)'
    db.query(query, [userData.username, userData.password], (err, result) => {
        if (err) {
            res.status(401).json({ message: 'error signup' })
        }
        else {
            res.status(200).json({ message: 'Success Sigunp! Please wait!' })
        }
    })
})

app.listen(port, () => {
    console.log('server is running in port ', port)
})
