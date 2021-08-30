import {
    retrieveUserByAuthId, 
} from '../../../db/dao/userDao';

const HTTP_FORBIDDEN = 403;

// Gets the user related to the current auth token, and sets to req.user
async function getUser(req, res, next) {
    if(req.body.firebaseUID){
        req.user = await retrieveUserByAuthId(req.body.firebaseUID);
    }
    if(!req.body.firebaseUID || !req.user) {
        res.status(HTTP_FORBIDDEN).send('Token not in database');
        return;
    }
    next();
}

export {
    getUser
};
