(function () {
    const socket = io();
    var messageTextBox = $('[name="message"]');
    var messagesOl = $('#messages');
    var locationButton = $('#send-location');

    const createMessageAcknowledgement = function createMessageAcknowledgementMethod(data) {
        messageTextBox.val('');
        console.log(data);
    };
    const sendFormData = function sendFormDataMethod(e) {
        e.preventDefault();
        socket.emit('createMessage', { from: 'Frank', text: messageTextBox.val() }, createMessageAcknowledgement);
    };
    const sendLocation = function sendLocationMethod(e) {
        if (!navigator.geolocation) {
            return console.log('Gelocation not supported by the browser. ', e);
        }
        locationButton.attr('disabled', 'disabled').text('Sending location');
        navigator.geolocation.getCurrentPosition(function successCase(location) {
            locationButton.removeAttr('disabled').text('Send location');
            console.log('current position is ', location);
            socket.emit('createLocationMessage', {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude
            });
        }, function errorCase() {
            console.log('Gelocation not allowed. :(');
        });
    };

    socket.on('connect', function connectListener() {
        console.log('Connected to server.');
    });

    socket.on('disconnect', function disconnectListener() {
        console.log('Disconnected from server.');
    });

    socket.on('newLocationMessage', function newLocationMessageListener(message) {
        var li = $(document.createElement('li'));
        var a = $('<a target="_blank">My Current location</a>');
        li.text(`${message.from}: `);
        a.attr('href', message.url);
        li.append(a);
        messagesOl.append(li);
    });

    socket.on('newMessage', function newMessageListener(message) {
        var li = $(document.createElement('li'));
        li.text(`${message.from}: ${message.text}`);
        messagesOl.append(li);
        console.log('New message: ', JSON.stringify(message, undefined, 2));
    });

    // socket.emit('createMessage', { from: 'Frank', text: 'Hi' }, createMessageAcknowledgement);

    $('#message-form').on('submit', sendFormData) ;

    locationButton.on('click', sendLocation);
})();
