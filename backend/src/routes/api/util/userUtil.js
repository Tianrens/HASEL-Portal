import { retrieveUserByAuthId } from '../../../db/dao/userDao';

const HTTP_FORBIDDEN = 403;

// Gets the user related to the current auth token, and sets to req.user
// Should always be called after auth
async function getUser(req, res, next) {
    if (req.body.firebaseUID) {
        req.user = await retrieveUserByAuthId(req.body.firebaseUID);
    }
    if (!req.body.firebaseUID || !req.user) {
        return res.status(HTTP_FORBIDDEN).send('Token not in database');
    }
    return next();
}

// Checks if the current user is an admin or above
// Should always be called after getUser
async function checkAdmin(req, res, next) {
    if (req.user.type === 'SUPERADMIN' || req.user.type === 'ADMIN') {
        return next();
    }
    return res.status(HTTP_FORBIDDEN).send('Forbidden: ADMINs only');
}

// Checks if the current user is a superadmin
// Should always be called after getUser
async function checkSuperAdmin(req, res, next) {
    if (req.user.type === 'SUPERADMIN') {
        return next();
    }
    return res.status(HTTP_FORBIDDEN).send('Forbidden: SUPERADMINs only');
}

export { getUser, checkAdmin, checkSuperAdmin };
