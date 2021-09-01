import express from 'express';
import { checkSuperAdmin, getUser } from './util/userUtil';

import {
    createSignUpRequest,
    updateRequestStatus,
    retrieveRequests,
    countRequests,
} from '../../db/dao/signUpRequestDao';

const router = express.Router();

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_IMPLEMENTED = 501;

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
        return res.status(HTTP_CREATED).json(signUpRequest);
    } catch (err) {
        return res.status(HTTP_BAD_REQUEST).json('Bad request');
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
        return res.status(HTTP_OK).json({
            pageCount,
            requests,
        });
    } catch (err) {
        return res.status(HTTP_BAD_REQUEST).json('Bad request');
    }
});

/** PATCH approve or deny request */
router.patch('/', getUser, (req, res) => {
    // TODO: PATCH approve or deny request
    if (req.user.type !== 'SUPERADMIN') {
        return res.status(HTTP_FORBIDDEN).send('Forbidden: SUPERADMINs only');
    }

    // Status must be either ACTIVE or DECLINED
    if (
        !req.body.status ||
        req.body.status !== 'ACTIVE' ||
        req.body.status !== 'DECLINED'
    ) {
        return res.status(HTTP_BAD_REQUEST).send('Bad request');
    }

    try {
        updateRequestStatus(req.body.requestId, req.body.status);
    } catch (err) {
        console.err(err);
        return res.status(HTTP_BAD_REQUEST).send('Bad request');
    }

    // TODO: Set start and end dates

    return res.status(HTTP_NO_CONTENT).send('Successful');
});

/** DELETE a request */
router.delete('/', (req, res) => {
    // TODO: DELETE a request
    console.log(req.originalUrl);

    return res.status(HTTP_NOT_IMPLEMENTED).send('Unimplemented');
});

export default router;
