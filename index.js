var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var numUsers = 0;

io.on('connection', function(socket){
  var addedUser = false;
  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;
    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    // echo globally (all clients) that a person has connected
  });

  //Listens and notifies when a disconnect occurs
  socket.on('disconnect', function(){
    socket.broadcast.emit('chat message', {
      username: socket.username,
      message: ' has left!'
    });
  });

  socket.on('chat message', function(msg){

    socket.broadcast.emit('chat message', {
      username: socket.username,
      message: msg
    });
  });
});


http.listen(3000, function(){
  console.log('Listening on port 3000');
});
