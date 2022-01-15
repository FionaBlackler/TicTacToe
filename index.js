const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/pages/index.html');
});

app.use(express.static(__dirname + '/public'));

//User Connects
io.on('connection', (socket) => {
  console.log('a user connected');

  //User Disconnects
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  //Server get data and reacts

  socket.on('player won', (data) => {
    console.log('player: ' + data + " won");
    io.emit('player won', data);
  });

  socket.on('player tie', (data) => {
    console.log("its a tie");
    io.emit('player tie', data);
  });

  socket.on('player move', (data) => {
    console.log('message: ' + data);
    io.emit('player move', data);
  });

  socket.on('reset board', (data) => {
    console.log('message: ' + data);
    io.emit('reset board', data);
  });

});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});