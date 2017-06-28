(function () {
    const socket = io();
    const createMessageAcknowledgement = function createMessageAcknowledgementMethod(data) {
        console.log(data);
    };
    const sendFormData = function sendFormDataMethod(e) {
        e.preventDefault();
        socket.emit('createMessage', { from: 'Frank', text: $('[name="message"]').val() }, createMessageAcknowledgement);
    };
    const sendLocation = function sendLocationMethod(e) {
        if (!navigator.geolocation) {
            return console.log('Gelocation not supported by the browser. ', e);
        }

        navigator.geolocation.getCurrentPosition(function successCase(location) {
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
        var li = $('<li></li>');
        var a = $('<a target="_blank">My Current location</a>');
        li.text(`${message.from}: `);
        a.attr('href', message.url);
        li.append(a);
        $('#messages').append(li);
    });

    socket.on('newMessage', function newMessageListener(message) {
        var li = $('<li></li>');
        li.text(`${message.from}: ${message.text}`);
        $('#messages').append(li);
        console.log('New message: ', JSON.stringify(message, undefined, 2));
    });

    // socket.emit('createMessage', { from: 'Frank', text: 'Hi' }, createMessageAcknowledgement);

    $('#message-form').on('submit', sendFormData) ;

    var locationButton = $('#send-location');
    locationButton.on('click', sendLocation);
})();
