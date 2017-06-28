(function () {
    const socket = io();
    const createMessageAcknowledgement = function createMessageAcknowledgementMethod(data) {
        console.log(data);
    };
    const sendFormData = function sendFormDataMethod(e) {
        e.preventDefault();
        socket.emit('createMessage', { from: 'Frank', text: $('[name="message"]').val() }, createMessageAcknowledgement);
    };

    socket.on('connect', function connectListener() {
        console.log('Connected to server.');
    });

    socket.on('disconnect', function disconnectListener() {
        console.log('Disconnected from server.');
    });

    socket.on('newMessage', function newMessageListener(message) {
        var li = $('<li></li>');
        li.text(`${message.from}: ${message.text}`);
        $('#messages').append(li);
        console.log('New message: ', JSON.stringify(message, undefined, 2));
    });

    // socket.emit('createMessage', { from: 'Frank', text: 'Hi' }, createMessageAcknowledgement);

    $('#message-form').on('submit', sendFormData) ;
})();
