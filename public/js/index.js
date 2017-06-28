const socket = io();

socket.on('connect', function connectListener() {
    console.log('Connected to server.');

    socket.emit('createMessage', {
        text: 'hello how are you?',
        to: 'Hiren Gondhiya'
    });
});

socket.on('disconnect', function disconnectListener() {
    console.log('Disconnected from server.');
});

socket.on('newMessage', function newMessageListener(message) {
    console.log('New message: ', JSON.stringify(message, undefined, 2));
});
