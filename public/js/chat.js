(function () {
    const socket = io();
    var messageTextBox = $('[name="message"]');
    var messagesOl = $('#messages');
    var locationButton = $('#send-location');

    const scrollToBottom = function scrollToBottomMethod() {
        const newMessage = messagesOl.children('li:last-child');
        const scrollHeight = messagesOl.prop('scrollHeight');
        const clientHeight = messagesOl.prop('clientHeight');
        const scrollTop = messagesOl.prop('scrollTop');
        const newMessageHeight = newMessage.innerHeight();
        const lastMessageHeight = newMessage.prev().innerHeight();

        if (scrollTop + clientHeight + lastMessageHeight + newMessageHeight >= scrollHeight) {
            messagesOl.scrollTop(scrollHeight);
        }
    };
    const createMessageAcknowledgement = function createMessageAcknowledgementMethod(data) {
        messageTextBox.val('');
        console.log(data);
    };
    const sendFormData = function sendFormDataMethod(e) {
        e.preventDefault();
        socket.emit('createMessage', { text: messageTextBox.val() }, createMessageAcknowledgement);
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

    const messageListener = function messageListenerMethod(message) {
        var templateName = '';
        var templateBody = {};
        const formattedTime = moment(message.createdAt).format('h:mm a');

        if (message.text) {
            templateName = '#message-template';
            templateBody = {
                text: message.text,
                from: message.from,
                createdAt: formattedTime
            };
        } else {
            templateName = '#location-message-template';
            templateBody = {
                url: message.url,
                from: message.from,
                createdAt: formattedTime
            };
        }
        const template = $(templateName).html();
        const html = Mustache.render(template, templateBody);
        messagesOl.append(html);
        scrollToBottom();
    };
    const joinAckowledgeListener = function joinAckowledgeListenerMethod(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    };

    const updateUsersListListener = function updateUsersListListenerMethod(users) {
        const usersDiv = $('#users');
        const ol = $(document.createElement('ol'));
        users.forEach(function (user) {
            const li = $(document.createElement('li')).text(user);
            ol.append(li);
        }, this);
        usersDiv.html(ol);
        console.log(users);
    };

    socket.on('connect', function connectListener() {
        const params = $.deparam(window.location.search);

        socket.emit('join', params, joinAckowledgeListener)
    });
    socket.on('disconnect', function disconnectListener() {
        console.log('Disconnected from server.');
    });
    socket.on('newLocationMessage', messageListener);
    socket.on('newMessage', messageListener);
    socket.on('updateUsersList', updateUsersListListener);
    $('#message-form').on('submit', sendFormData) ;
    locationButton.on('click', sendLocation);
})();
