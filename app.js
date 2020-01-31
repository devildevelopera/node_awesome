const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('./config/database.js');

app.use(cors());
app.use(bodyParser.json());

const postsRoute = require('./routes/posts');

app.use('/uploads', express.static('uploads'));

app.use('/posts', postsRoute);

app.get('/', (req, res) => {
    res.send('We are on home');
});

app.listen(3005);