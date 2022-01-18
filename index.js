const express = require('express');
const app = express();
const http = require('http');
const { SocketAddress } = require('net');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/pages/index.html');
});

app.use(express.static(__dirname + '/public'));

let clientOne = null;
let clientTwo = null;

var player = ['X', 'O'];
var playerCount = 0;

//User Connects
io.on('connection', (socket) => {
  console.log('a user connected with the ID: ' + socket.id);

  if (clientOne !== null && clientTwo !== null) {
    console.log("Sorry server is full!");
  } else if (clientOne == null) {
    clientOne = socket.id;
    playerCount += 1;
  } else if (clientTwo == null) {
    clientTwo = socket.id;
    playerCount += 1;
  } else if (clientOne == clientTwo) {
    clientTwo = socket.id;
    playerCount += 1;
  } 

  console.log('Client ID 1: ' + clientOne);
  console.log('Client ID 2: ' + clientTwo);

  //zuweisung von socketid zu player x und o
  //fallunterscheidungen player x belegt o nicht, o und x wenn x disco, beide belegt
  //bei weiterer connection nichts belegen (passiert in html)

  //User Disconnects
  socket.on('disconnect', () => {
    console.log('');
    console.log('user disconnected');
    console.log('Client ID 1: ' + clientOne);
    console.log('Client ID 2: ' + clientTwo);

    if (!(socket.id == clientOne || socket.id == clientTwo)) {
      return;
    } else if (clientTwo == socket.id) {
      clientTwo = null;
      playerCount -= 1;
    } else if (clientOne !== null) {
      clientOne = null;
      playerCount -= 1;
    }

    io.emit('restart board');
  });

  //Server get data and react
  console.log(playerCount)

  socket.on('game ready', function (data) {
    if (playerCount == 2) {
      io.emit('game ready', true);
    }
  });

  socket.on('set player', (data) => {
    io.to(clientOne).emit('set player', player[0]);
    io.to(clientTwo).emit('set player', player[1]);
  });

  socket.on('board state', (data) => {
    io.emit('board state', data);
  });

  socket.on('player won', (data) => {
    console.log('player: ' + data + " won");
    io.emit('player won', data);
  });

  socket.on('player tie', (data) => {
    console.log("its a tie");
    io.emit('player tie', data);
  });

  socket.on('player move', (data) => {
    console.log('cell ' + data + ' was clicket');
    io.emit('player move', data);
  });

  socket.on('restart board', (data) => {
    console.log("!!Round Restarted!!");
    io.emit('restart board', data);
  });

});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});