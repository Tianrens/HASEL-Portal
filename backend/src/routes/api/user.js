import express from 'express';
import { createUser, retrieveUserByAuthId } from '../../db/dao/userDao';
import findMissingParams from './util/findMissingParams';
import HTTP from './util/http_codes';
import { getUser } from './util/userUtil';
import { retrieveWorkstationOfUser } from '../../db/dao/workstationDao';

const router = express.Router();

/** POST a new user from Firebase */
router.post('/', async (req, res) => {
    let dbUser = await retrieveUserByAuthId(req.firebase.uid);

    if (dbUser) {
        res.status(HTTP.BAD_REQUEST);
        return res.send('account already exists');
    }

    const expectedParams = ['upi', 'firstName', 'lastName', 'type'];
    const missingParams = findMissingParams(req.body, expectedParams);
    if (missingParams) {
        res.status(HTTP.BAD_REQUEST);
        res.send(missingParams);
        return res;
    }

    dbUser = await createUser({
        email: req.firebase.email,
        upi: req.body.upi,
        authUserId: req.firebase.uid,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        type: req.body.type,
    });

    return res.status(HTTP.CREATED).json(dbUser);
});

/** GET all users */
router.get('/', (req, res) => {
    // TODO: GET all users
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** PUT edit Firebase information */
router.put('/', (req, res) => {
    // TODO: PUT edit Firebase information
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** GET user bookings */
router.get('/booking', (req, res) => {
    // TODO: GET user bookings
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** GET user info */
router.get('/info', async (req, res) => {
    const dbUser = await retrieveUserByAuthId(req.firebase.uid);
    if (!dbUser) {
        res.status(HTTP.NOT_FOUND);
        return res.send('User has not signed up');
    }
    return res.send(dbUser);
});

/** GET user workstation */
router.get('/workstation', getUser, async (req, res) => {
    let workstation;
    try {
        workstation = await retrieveWorkstationOfUser(req.user._id);
        if (workstation === null) {
            return res
                .status(HTTP.BAD_REQUEST)
                .send(
                    'User does not have an active request with an allocated workstation',
                );
        }
    } catch (err) {
        return res.status(HTTP.BAD_REQUEST).json('Bad request');
    }

    return res.status(HTTP.OK).json(workstation);
});

export default router;
