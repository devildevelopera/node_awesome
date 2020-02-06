const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('./config/database.js');
app.use(cors());

var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', function(client) {
  var online = Object.keys(io.engine.clients);
  client.emit('server message', JSON.stringify(online));

  client.on('subscribeToTimer', (interval) => {
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });

  client.on('disconnect', function(){
    var online = Object.keys(io.engine.clients);
    io.emit('server message', JSON.stringify(online));
    });
});

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
http.listen(port, function(){
  console.log('listening on port :', port);
});