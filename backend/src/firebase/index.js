import firebase from 'firebase-admin';
import tunnel from 'tunnel';

// Initialize firebase.
require('dotenv').config();

const tunnelingAgent = tunnel.httpsOverHttp({
    proxy: {
        host: process.env.PROXY_HOST,
        port: process.env.PROXY_PORT,
    },
});

firebase.initializeApp({
    credentials: firebase.credential.applicationDefault(),
    httpAgent: process.env.NODE_ENV === 'production' && tunnelingAgent,
});

export default firebase;
