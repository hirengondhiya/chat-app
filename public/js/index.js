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
        const formattedTime = moment(message.createdAt).format('h:mm a');
        const template = $('#location-message-template').html();
        const html = Mustache.render(template, {
            url: message.url,
            from: message.from,
            createdAt: formattedTime
        });
        messagesOl.append(html);
    });

    socket.on('newMessage', function newMessageListener(message) {
        const formattedTime = moment(message.createdAt).format('h:mm a');
        const template = $('#message-template').html();
        const html = Mustache.render(template, {
            text: message.text,
            from: message.from,
            createdAt: formattedTime
        });
        messagesOl.append(html);
    });

    // socket.emit('createMessage', { from: 'Frank', text: 'Hi' }, createMessageAcknowledgement);

    $('#message-form').on('submit', sendFormData) ;

    locationButton.on('click', sendLocation);
})();
