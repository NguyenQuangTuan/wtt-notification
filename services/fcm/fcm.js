const serviceAccount = require('./firebase.json')
const fcm_admin = require('firebase-admin')

fcm_admin.initializeApp({
    credential: fcm_admin
        .credential
        .cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
})
process.env.GCLOUD_PROJECT = serviceAccount.project_id;
module.exports = fcm_admin;
