import express from 'express';
import { createUser, retrieveUserByAuthId } from '../../db/dao/userDao';

const router = express.Router();

const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_IMPLEMENTED = 501;

/** POST a new user from Firebase */
router.post('/', async (req, res) => {
    let dbUser = await retrieveUserByAuthId(req.body.firebaseUID);

    if (dbUser) {
        res.status(HTTP_BAD_REQUEST);
        res.send('account already exists');
        return res;
    }

    dbUser = await createUser({
        email: req.body.email,
        upi: req.body.upi,
        authUserId: req.body.firebaseUID,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        type: req.body.type,
    });

    return res.status(HTTP_CREATED).json(dbUser);
});

/** GET all users */
router.get('/', (req, res) => {
    // TODO: GET all users
    console.log(req.originalUrl);

    return res.status(HTTP_NOT_IMPLEMENTED).send('Unimplemented');
});

/** PUT edit Firebase information */
router.put('/', (req, res) => {
    // TODO: PUT edit Firebase information
    console.log(req.originalUrl);

    return res.status(HTTP_NOT_IMPLEMENTED).send('Unimplemented');
});

/** GET user bookings */
router.get('/booking', (req, res) => {
    // TODO: GET user bookings
    console.log(req.originalUrl);

    return res.status(HTTP_NOT_IMPLEMENTED).send('Unimplemented');
});

/** GET user info */
router.get('/info', (req, res) => {
    // TODO: GET user info
    console.log(req.originalUrl);

    return res.status(HTTP_NOT_IMPLEMENTED).send('Unimplemented');
});

/** GET user resource */
router.get('/resource', (req, res) => {
    // TODO: GET user resource
    console.log(req.originalUrl);

    return res.status(HTTP_NOT_IMPLEMENTED).send('Unimplemented');
});

export default router;
