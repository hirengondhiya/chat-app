const socket = io();

socket.on('connect', function connectListener() {
    console.log('Connected to server.');
});

socket.on('disconnect', function disconnectListener() {
    console.log('Disconnected from server.');
});

socket.on('newMessage', function newMessageListener(message) {
    console.log('New message: ', JSON.stringify(message, undefined, 2));
});
