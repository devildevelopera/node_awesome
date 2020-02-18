const express = require('express');
var multer = require('multer');
var fs = require('fs');
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

users.post('/forgotpass', (req, res) => {
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(user) {
            user_id = JSON.stringify(user._id);
            let encodedID = Buffer.from(user_id).toString('base64');
            // contactContoller.sendemail(encodedID);
            res.send("success");
        }else{
            res.send(false)
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

users.patch('/resetpass/:user_id', (req, res) => {
    let decodedID = Buffer.from(req.params.user_id, 'base64').toString('ascii');
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        User.updateOne(
            { _id: JSON.parse(decodedID)},
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

users.patch('/updatepass/:user_id', (req, res) => {
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

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname )
    }
});

var upload = multer({ storage: storage }).single('file');

users.post('/upload/:user_id', async (req, res) => {
    User.findOne({
        _id: req.params.user_id
    })
    .then(user => {
        if(user.photo !=="seller.png") {
            const path = './uploads/profile/'+user.photo;
            fs.unlink(path, (err) => {
                if (err) {
                console.error(err);
                return
                }
            })
        }
    })
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)
    });
});

users.patch('/:user_id', async (req, res) => {
    try {
        const updatePost = await User.updateOne(
            { _id: req.params.user_id},
            { $set: {
                    photo: req.body.filename
                } }
        );
        res.json(updatePost);
    } catch (err) {
        res.json({message: err});
    }
})

users.delete('/removePhoto/:user_id', async (req, res) => {
    User.findOne({
        _id: req.params.user_id
    })
    .then(user => {
        if(user.photo !=="seller.png") {
            const path = './uploads/profile/'+user.photo;
            fs.unlink(path, (err) => {
                if (err) {
                  console.error(err);
                  return
                }
            })
        }
    })
    try {
        const updatePost = await User.updateOne(
            { _id: req.params.user_id},
            { $set: {
                    photo: "seller.png"
                } }
        );
        res.json(updatePost);
    } catch (err) {
        res.json({message: err});
    }
})

users.patch('/userUpdate/:user_id', async (req, res) => {
    try {
        const updatePost = await User.updateOne(
            { _id: req.params.user_id},
            { $set: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone: req.body.phone,
                    country: req.body.country,
                    city: req.body.city
                } }
        );
        res.json(updatePost);
    } catch (err) {
        res.json({message: err});
    }
})

module.exports = users