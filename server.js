var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/view.html');
});

io.on('connection', function (socket) {
  var names = {}; 
  socket.on('newMessage', function (data) {
    // broadcast the received message to all the other clients
    socket.broadcast.emit('appendMsg', {name: names[socket.id], message: data});
  });

  socket.on('nameChange', function(name){
    names[socket.id] = name;
  })
});



