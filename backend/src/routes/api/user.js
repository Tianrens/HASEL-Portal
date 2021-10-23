import express from 'express';
import {
    countUsers,
    createUser,
    retrieveAllUsersCSV,
    retrieveUserByAuthId,
    retrieveUserById,
    retrieveUsers,
    retrieveUsersBySearchQuery,
    updateUser,
} from '../../db/dao/userDao';
import { checkCorrectParams } from './util/checkCorrectParams';
import HTTP from './util/http_codes';
import { getUser } from './util/userUtil';
import { checkAdmin } from './util/userPerms';
import { retrieveWorkstationOfUser } from '../../db/dao/workstationDao';
import { specialUserTypes } from '../../config';
import { lockWorkstationUser, unlockWorkstationUser } from '../../ssh';
import { sendContactFormEmail } from '../../email/sentContactFormEmail';

const router = express.Router();

const BASE_INT_VALUE = 10;

/** POST a new user from Firebase */
router.post(
    '/',
    checkCorrectParams(['upi', 'firstName', 'lastName', 'type']),
    async (req, res) => {
        try {
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
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(HTTP.BAD_REQUEST).json('Invalid user type');
            }
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json('Server error');
        }
    },
);
/** GET ALL users
 * GET /api/user/?page=${page}&limit=${limit}
 * @query   page        The page number specified
 * @query   limit       The number of users in a page
 * @returns count       The number of matching users in the database
 * @returns pageCount   The number of pages in the database
 * @returns users       The array of matching user objects
 */
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

/** GET ALL users with specific fields for CSV
 * GET /api/user/download
 * @returns users       The array of matching user objects
 */
router.get('/download', getUser, checkAdmin, async (req, res) => {
    try {
        const users = await retrieveAllUsersCSV();
        return res.status(HTTP.OK).json({
            users,
        });
    } catch (err) {
        return res.status(HTTP.BAD_REQUEST).json('Bad request');
    }
});

/** PATCH edit user
 * PATCH /api/user/${userId}
 * @param userId The id of the user whose information needs to be updated
 */
router.patch(
    '/:userId',
    getUser,
    checkAdmin,
    checkCorrectParams(['type']),
    async (req, res) => {
        try {
            const { userId } = req.params;
            const newUserInfo = req.body;
            const user = await retrieveUserById(userId);
            if (!user) {
                return res.status(HTTP.NOT_FOUND).send('User does not exist');
            }

            if (newUserInfo.type !== user.type) {
                // Order matters because unlock/lock workstation user cannot occur on a special user type
                if (specialUserTypes.includes(newUserInfo.type)) { // Special to non-special
                    await updateUser(userId, newUserInfo);
                    lockWorkstationUser(user.currentRequestId.allocatedWorkstationId.host, user.upi);
                } else { // Non-special to special
                    unlockWorkstationUser(user.currentRequestId.allocatedWorkstationId.host, user.upi);
                    await updateUser(userId, newUserInfo);
                }
            } else {
                await updateUser(userId, newUserInfo);
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(HTTP.BAD_REQUEST).json('Invalid user type');
            }
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json('Server error');
        }

        return res.status(HTTP.NO_CONTENT).send('User type has been updated');
    },
);

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

/** GET users by search query
 * GET /api/user/search/${searchParam}/?page=${page}&limit=${limit}
 * @param   searchParam The partial or full upi, firstname, lastname or fullname to search users by
 * @query   page        The page number specified
 * @query   limit       The number of users in a page
 * @returns count       The number of matching users in the database
 * @returns pageCount   The number of pages in the database
 * @returns bookings    The array of matching user objects
 */
router.get('/search/:searchParam', getUser, checkAdmin, async (req, res) => {
    try {
        const { searchParam } = req.params;

        const page = parseInt(req.query.page, BASE_INT_VALUE);
        const limit = parseInt(req.query.limit, BASE_INT_VALUE);
        const result = await retrieveUsersBySearchQuery(
            searchParam,
            page,
            limit,
        );

        const { matchingUsers } = result;
        const { count } = result;
        const pageCount = Math.ceil(count / limit);

        return res.status(HTTP.OK).json({
            count,
            pageCount,
            matchingUsers,
        });
    } catch (err) {
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json('Server error');
    }
});

/** Send an email to an admin. SENDS TO EMAIL IN .env FILE !
 * POST /api/user/contact
 * @query   subject     The subject of the user's query
 * @query   message     The message of the user's query
 */
router.post(
    '/contact',
    getUser,
    checkCorrectParams(['subject', 'message']),
    async (req, res) => {
        try {
            const userName = `${req.user.firstName} ${req.user.lastName}`;
            const { upi, email } = req.user;

            sendContactFormEmail(req.body, userName, upi, email);

            return res.status(HTTP.CREATED).json(req.user);
        } catch (error) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json('Server error');
        }
    },
);

export default router;
