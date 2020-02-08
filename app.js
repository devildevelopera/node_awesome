const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('./config/database.js');
app.use(cors());

const port = process.env.PORT || 3005
let server = app.listen(port, function(){
  console.log('listening on port :', port);
});

var io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
  }));

const postsRoute = require('./routes/posts');
const usersRoute = require('./routes/users');

app.use('/uploads', express.static('uploads'));

app.use('/posts', postsRoute);
app.use('/users', usersRoute);

onlineUsers = {};

io.on('connection', function(socket) {
  socket.on('client message', function(user_id){
    onlineUsers[socket.id] = user_id;
    io.emit('server message', onlineUsers);
  })
  socket.on('disconnect', function(){
    io.emit('server message', socket.id);
    delete onlineUsers[socket.id];
    });
});

app.delete('/users/logout/:user_id', (req, res) => {
  var user_id = req.params.user_id
  for(var key in onlineUsers) {
    if(onlineUsers[key] == user_id) {
        delete onlineUsers[key];
    }
  }
  io.emit('server message', onlineUsers);
})

app.get('/', (req, res) => {
    res.send('We are on home');
});
