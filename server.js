const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
require('dotenv').config();

const app = express();
app.use(express.json())
app.use(cors({
    origin: 'https://tcultivator.github.io',
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
    const islogin = true;
    const query = 'SELECT * FROM bankappAcc WHERE username = ? && password = ?';
    const query2 = 'UPDATE bankappAcc SET islogin =? WHERE username = ? && password = ?'
    db.query(query, [data.username, data.password], (err, result) => {
        if (!result.length) {
            res.status(500).json({ message: 'no data found!' })
        } else {
            const userData = JSON.parse(JSON.stringify(result[0]));
            console.log(userData);
            if (result[0].islogin == true) {
                res.status(500).json({ message: 'This account is currently active!' })
                console.log('This account is currently active!')
            }
            else {
                db.query(query2, [islogin, data.username, data.password], (err, result) => {
                    if (err) {
                        res.status(200).json({ message: 'no data found!' })
                    } else {
                        const token = jwt.sign(userData, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: '1h' })
                        res.cookie('token', token, {
                            httpOnly: true,
                            sameSite: 'none',
                            maxAge: 60 * 60 * 1000,
                            secure: true
                        })
                        res.status(200).json({ message: 'Login Successfully!' })
                    }
                })
            }

        }
    })
})

app.post('/getme', auth, (req, res) => {
    const verifiedUserId = req.userId;
    console.log('eto na ung verify na id ', verifiedUserId)
    const query = 'SELECT * FROM bankappAcc WHERE id = ?';
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
    const accountBalance = 0;
    const userData = req.body;
    const query = 'INSERT INTO bankappAcc (username,password,accountBalance,isLogin)VALUES(?,?,?,?)'
    db.query(query, [userData.username, userData.password,accountBalance,0], (err, result) => {
        if (err) {
            res.status(401).json({ message: 'error signup' })
        }
        else {
            res.status(200).json({ message: 'Success Sigunp! Please wait!' })
        }
    })
})










app.put('/deposit', auth, (req, res) => {
    const depositData = req.body;
    const verifiedUserId = req.userId;
    const query = 'UPDATE bankappAcc SET accountBalance = ? WHERE id = ?'
    db.query(query, [depositData.depositAmmount, verifiedUserId], (err, result) => {
        if (err) {
            res.status(401).json({ message: 'error deposit' })
        }
        else {
            res.status(200).json({ message: 'success deposit' })
            console.log('success!')
        }
    })
})


app.put('/withdraw', auth, (req, res) => {
    const withdrawData = req.body;
    const verifiedUserId = req.userId;
    const query = 'UPDATE bankappAcc SET accountBalance = ? WHERE id = ?'
    db.query(query, [withdrawData.withdrawAmmount, verifiedUserId], (err, result) => {
        if (err) {
            res.status(401).json({ message: 'error withdraw' })
        }
        else {
            res.status(200).json({ message: 'success withdraw' })
            console.log('success!')
        }
    })
})

app.post('/userLogout', auth, (req, res) => {
    const verifiedUserId = req.userId;
    const islogin = false;
    const query1 = 'SELECT * FROM bankappAcc WHERE id = ?'
    const query2 = 'UPDATE bankappAcc SET islogin = ? WHERE id = ?'

    db.query(query1, [verifiedUserId], (err, result) => {
        if (!result.length) {
            res.status(401).json({ message: 'error ka una' })
        }
        else {
            db.query(query2, [islogin, verifiedUserId], (err, result) => {
                if (err) {
                    res.status(401).json({ message: 'error ka pangalawa' })
                }
                else {
                    res.clearCookie('token', {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        maxAge: 60 * 60 * 1000
                    })
                    res.status(200).json({ message: 'success logout!' })
                }
            })
        }
    })

})

app.listen(port, () => {
    console.log('server is running in port ', port)
})
