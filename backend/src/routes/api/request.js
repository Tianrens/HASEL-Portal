import express from 'express';
import { getUser } from './util/userUtil';

import {
    createSignUpRequest,
    updateRequestStatus,
    retrieveAllRequests,
} from '../../db/dao/signUpRequestDao';

const router = express.Router();

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_IMPLEMENTED = 501;

/** POST new request */
router.post('/', getUser, async (req, res) => {
    let signUpRequest;
    try {
        signUpRequest = await createSignUpRequest({
            userId: req.user._id,
            allocatedResourceId: req.body.allocatedResourceId,
            supervisorName: req.body.supervisorName,
            comments: req.body.comments,
            status: 'PENDING',
        });
    } catch (err) {
        return res.status(HTTP_BAD_REQUEST).json('Bad request');
    }

    return res.status(HTTP_CREATED).json(signUpRequest);
});

/** GET all requests */
router.get('/', getUser, async (req, res) => {
    // TODO: GET all requests
    if (req.user.type !== 'SUPERADMIN') {
        return res.status(HTTP_FORBIDDEN).send('Forbidden: SUPERADMINs only');
    }

    // TODO: Pagination of some kind
    // TODO: Filtering by type
    const requests = await retrieveAllRequests();
    return res.status(HTTP_OK).json(requests);
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
