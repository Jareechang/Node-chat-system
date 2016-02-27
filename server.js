"use strict";

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Listen on port 3000
server.listen(3000);

// Request for static template
app.get('/', function (req, res) {
    res.sendFile(`${__dirname}/view.html`);
});


// Temporary User management *****************************
var users = {        
    assignName(socket){
        let rand = Math.random().toString(36).substring(7);        
        users[socket.id] = `User${rand}`;
    }
}; 

// Socket *********************************************

io.on('connection', function (socket) {
    // Give users arbitrary name on connection
    users.assignName(socket);
    // Emit username to client
    socket.emit('connected', { name: `${users[socket.id]}` });

    socket.on('newMessage', function (data) {    
        // broadcast the received message to all the other clients        
        socket.broadcast.emit('appendMsg', 
            {   
                name: users[socket.id], 
                message: data
            }        
        );
    });

    socket.on('nameChange', function(name){
        users[socket.id] = name;
     })
});



