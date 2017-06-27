var loadEnv = require('./env/load-environment');

var htttp = require('http');
var socketIO = require('socket.io');

var express = require('express');
const path = require('path');

var app = express();
var server = htttp.createServer(app);
var io = socketIO(server);
const publicFolder = path.join(__dirname, '../public');
app.use(express.static(publicFolder));

io.on('connection', (socket) => {
    console.log('New user connected.')

    socket.emit('newMessage', {
        from: 'Chandni Gondhiya',
        text: 'Hello Hiren',
        createdAt: new Date().getDate().toString()
    });

    socket.on('createMessage', function createMessageListener (message) {
        console.log(`Create message: ${JSON.stringify(message, undefined, 2)}`);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from client.')
    });
});



server.listen(process.env.PORT, () => {
    console.log(`******** Server is up on port: ${process.env.PORT} ********`);
});

