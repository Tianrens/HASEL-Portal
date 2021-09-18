import { retrieveUserByAuthId } from '../../../db/dao/userDao';
import HTTP from './http_codes';

// Gets the user related to the current auth token, and sets to req.user
// Should always be called after auth
async function getUser(req, res, next) {
    if (req.firebase) {
        req.user = await retrieveUserByAuthId(req.firebase.uid);
    }
    if (!req.firebase || !req.user) {
        return res.status(HTTP.FORBIDDEN).send('Token not in database');
    }
    return next();
}

function isAdmin(req) {
    return req.user.type === 'SUPERADMIN' || req.user.type === 'ADMIN';
}

function isSuperAdmin(req) {
    return req.user.type === 'SUPERADMIN';
}

export { getUser, isAdmin, isSuperAdmin };
