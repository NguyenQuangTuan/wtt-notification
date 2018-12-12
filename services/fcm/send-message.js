const fcm_admin = require('./fcm');

const sendMessage = function(data, token) {
    let message = {
        notification: data,
        token
    }
    console.log('message', message);

    fcm_admin
        .messaging()
        .send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}

module.exports = sendMessage;