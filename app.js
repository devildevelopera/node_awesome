const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('./config/database.js');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
  }));

const postsRoute = require('./routes/posts');
const usersRoute = require('./routes/users')

app.use('/uploads', express.static('uploads'));

app.use('/posts', postsRoute);
app.use('/users', usersRoute)

app.get('/', (req, res) => {
    res.send('We are on home');
});

const port = process.env.PORT || 3005
app.listen(port);