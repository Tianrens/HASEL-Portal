import express from 'express';
import {
    countUsers,
    createUser,
    retrieveUserByAuthId,
    retrieveUserById,
    retrieveUsers,
} from '../../db/dao/userDao';
import { checkCorrectParams } from './util/checkCorrectParams';
import HTTP from './util/http_codes';
import { getUser } from './util/userUtil';
import { checkAdmin } from './util/userPerms';
import { retrieveWorkstationOfUser } from '../../db/dao/workstationDao';

const router = express.Router();

const BASE_INT_VALUE = 10;

/** POST a new user from Firebase */
router.post(
    '/',
    checkCorrectParams(['upi', 'firstName', 'lastName', 'type']),
    async (req, res) => {
        let dbUser = await retrieveUserByAuthId(req.firebase.uid);

        if (dbUser) {
            res.status(HTTP.BAD_REQUEST);
            return res.send('account already exists');
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
    },
);

/** GET all users */
router.get('/', getUser, checkAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page, BASE_INT_VALUE);
        const limit = parseInt(req.query.limit, BASE_INT_VALUE);

        const count = await countUsers();
        const pageCount = Math.ceil(count / limit);
        const users = await retrieveUsers(page, limit);
        
        return res.status(HTTP.OK).json({
            count,
            pageCount,
            users,
        });
    } catch (err) {
        return res.status(HTTP.BAD_REQUEST).json('Bad request');
    }
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

/** GET user by id
 * GET /api/user/${userId}
 * @param   userId  The user to query
 * @returns The user specified
 */
router.get('/:userId', getUser, checkAdmin, async (req, res) => {
    const user = await retrieveUserById(req.params.userId);
    if (!user) {
        return res.status(HTTP.NOT_FOUND).send('User does not exist');
    }
    return res.status(HTTP.OK).json(user);
});

export default router;
