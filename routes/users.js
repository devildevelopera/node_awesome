const express = require('express');

const users = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var contactContoller = require('../controller/email');
const User = require('../models/User');

users.use(cors());

process.env.SECRET_KEY = 'secret'

users.post('/register', (req, res) => {
    const today = new Date();
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created: today
    }
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(!user) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                userData.password = hash
                User.create(userData)
                .then(user => {
                    res.send("success")
                })
                .catch(err =>{
                    res.send("fail")
                })
            })
        } else {
            res.send("exist")
        }
    })
    .catch(err => {
        res.send("fail")
    })
})

users.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(user) {
            if(bcrypt.compareSync(req.body.password, user.password)) {
                const payload = {
                    _id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                }
                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.send(token)
            }else{
                res.send(false);
            }
        }else{
            res.send(false)
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
});

users.get('/:user_id', (req, res) => {
    User.findOne({
        _id: req.params.user_id
    })
    .then(user => {
        res.send(user);
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

users.get('/profile', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    User.findOne({
        _id: decoded._id
    })
    .then(user => {
        if(user) {
            res.json(user)
        }else{
            res.send("User does not exist")
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

users.post('/forgotpass', (req, res) => {
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(user) {
            // contactContoller.sendemail();
            res.send(user._id);
        }else{
            res.send(false)
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

users.patch('/resetpass/:user_id', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        User.updateOne(
            { _id: req.params.user_id},
            { $set: {
                    password: hash,
                } }
        )
        .then(() => {
            res.send('success');
        })
        .catch((err) => {
            res.send(false);
        })
    });
})

module.exports = users