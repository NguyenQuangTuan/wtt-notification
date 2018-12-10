const fcm_admin = require('./fcm');

const sendMessage = function(data, token) {
    let message = {
        notification: {
            title: data.title,
            body: data.content
        },
        token
    }
    fcm_admin
        .messaging()
        .send(message)
        .then((response) => {
            console.log('message', message);
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}

module.exports = sendMessage;