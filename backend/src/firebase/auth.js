import firebase from './index';

/**
 * Middleware. Checks if firebase sesion id is valid.
 * If so, the request body is set with the firebaeUID, for ease of access.
 */
// eslint-disable-next-line consistent-return
function firebaseAuth(request, response, next) {
    const headerToken = request.headers.authorization;

    if (!headerToken) {
        response.status(401);
        response.send({ message: 'No token provided' });
        return;
    }

    if (headerToken && headerToken.split(' ')[0] !== 'Bearer') {
        response.status(401);
        response.send({ message: 'Invalid token' });
        return;
    }

    const token = headerToken.split(' ')[1];
    firebase
        .auth()
        .verifyIdToken(token)
        .then((user) => {
            request.firebase = user;
            next();
        })
        .catch(() => {
            response.status(403);
            response.send({ message: 'Could not authorize' });
        });
}

export default firebaseAuth;
