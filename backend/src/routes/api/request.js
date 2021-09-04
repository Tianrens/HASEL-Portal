import express from 'express';
import { checkSuperAdmin, getUser } from './util/userUtil';
import HTTP from './util/http_codes';
import {
    createSignUpRequest,
    updateRequestStatus,
    retrieveRequests,
    countRequests,
} from '../../db/dao/signUpRequestDao';
import { sendNewRequestEmailToSuperAdmins } from '../../email';

const router = express.Router();

const BASE_VALUE = 10;

/** POST new request */
router.post('/', getUser, async (req, res) => {
    try {
        const signUpRequest = await createSignUpRequest({
            userId: req.user._id,
            allocatedResourceId: req.body.allocatedResourceId,
            supervisorName: req.body.supervisorName,
            comments: req.body.comments,
            status: 'PENDING',
        });

        if (process.env.NODE_ENV === 'production') {
            sendNewRequestEmailToSuperAdmins(
                signUpRequest,
                `${req.protocol}://${req.get('host')}`,
            );
        }

        return res.status(HTTP.CREATED).json(signUpRequest);
    } catch (err) {
        return res.status(HTTP.BAD_REQUEST).json('Bad request');
    }
});

/** GET requests */
router.get('/:status', getUser, checkSuperAdmin, async (req, res) => {
    const { status } = req.params;
    try {
        const page = parseInt(req.query.page, BASE_VALUE);
        const limit = parseInt(req.query.limit, BASE_VALUE);

        const count = await countRequests(status);
        const pageCount = Math.ceil(count / limit);
        const requests = await retrieveRequests(status, page, limit);
        return res.status(HTTP.OK).json({
            pageCount,
            requests,
        });
    } catch (err) {
        return res.status(HTTP.BAD_REQUEST).json('Bad request');
    }
});

/** PATCH approve or deny request */
router.patch('/', getUser, (req, res) => {
    // TODO: PATCH approve or deny request
    if (req.user.type !== 'SUPERADMIN') {
        return res.status(HTTP.FORBIDDEN).send('Forbidden: SUPERADMINs only');
    }

    // Status must be either ACTIVE or DECLINED
    if (
        !req.body.status ||
        req.body.status !== 'ACTIVE' ||
        req.body.status !== 'DECLINED'
    ) {
        return res.status(HTTP.BAD_REQUEST).send('Bad request');
    }

    try {
        updateRequestStatus(req.body.requestId, req.body.status);
    } catch (err) {
        console.err(err);
        return res.status(HTTP.BAD_REQUEST).send('Bad request');
    }

    // TODO: Set start and end dates

    return res.status(HTTP.NO_CONTENT).send('Successful');
});

/** DELETE a request */
router.delete('/', (req, res) => {
    // TODO: DELETE a request
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

export default router;
