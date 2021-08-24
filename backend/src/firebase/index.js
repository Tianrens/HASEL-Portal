import firebase from 'firebase-admin';
// Initialize firebase.
require('dotenv').config();

firebase.initializeApp({
    credentials: firebase.credential.applicationDefault(),
});

export default firebase;
