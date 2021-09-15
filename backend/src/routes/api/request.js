import express from 'express';
import { checkSuperAdmin, getUser } from './util/userUtil';
import HTTP from './util/http_codes';
import {
    countRequests,
    createSignUpRequest,
    deleteRequest,
    retrieveRequestById,
    retrieveRequests,
    setRequestEndDate,
    updateRequest,
    updateRequestStatus,
} from '../../db/dao/signUpRequestDao';
import { retrieveUserById } from '../../db/dao/userDao';
import {
    sendNewRequestEmailToSuperAdmins,
    sendRequestApprovedEmail,
    sendRequestDeniedEmail,
} from '../../email';
import { userHasRequestViewPerms } from './util/userPerms';

const router = express.Router();

const UNDERGRAD_REQUEST_VALIDITY = 3;
const MASTERS_REQUEST_VALIDITY = 6;
const POSTGRAD_REQUEST_VALIDITY = 6;
const PHD_REQUEST_VALIDITY = 12;

const BASE_INT_VALUE = 10;

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

        sendNewRequestEmailToSuperAdmins(
            signUpRequest,
            `${req.protocol}://${req.get('host')}`,
        );

        return res.status(HTTP.CREATED).json(signUpRequest);
    } catch (err) {
        return res.status(HTTP.BAD_REQUEST).json('Bad request');
    }
});

/** GET requests */
router.get('/status/:status', getUser, checkSuperAdmin, async (req, res) => {
    const { status } = req.params;
    try {
        const page = parseInt(req.query.page, BASE_INT_VALUE);
        const limit = parseInt(req.query.limit, BASE_INT_VALUE);

        const count = await countRequests(status);
        const pageCount = Math.ceil(count / limit);
        const requests = await retrieveRequests(status, page, limit);
        return res.status(HTTP.OK).json({
            count,
            pageCount,
            requests,
        });
    } catch (err) {
        return res.status(HTTP.BAD_REQUEST).json('Bad request');
    }
});

/** GET single request */
router.get(
    '/:requestId',
    getUser,
    userHasRequestViewPerms,
    async (req, res) => {
        const { requestId } = req.params;
        try {
            const request = await retrieveRequestById(requestId);
            return res.status(HTTP.OK).json(request);
        } catch (err) {
            return res.status(HTTP.BAD_REQUEST).json('Bad request');
        }
    },
);

/** PATCH approve or deny request */
router.patch('/:requestId', getUser, checkSuperAdmin, async (req, res) => {
    // Status must be either ACTIVE or DECLINED
    if (
        !req.body.status ||
        (req.body.status !== 'ACTIVE' && req.body.status !== 'DECLINED')
    ) {
        return res.status(HTTP.BAD_REQUEST).send('Bad request');
    }

    try {
        const { requestId } = req.params;
        let request = await retrieveRequestById(requestId);

        if (request === null) {
            return res
                .status(HTTP.NOT_FOUND)
                .send(`Could not find request with id: ${requestId}`);
        }
        await updateRequestStatus(requestId, req.body.status);

        if (req.body.status === 'ACTIVE') {
            const requestUser = request.userId;
            const userType = requestUser.type;
            let requestValidity;
            if (userType === 'UNDERGRAD') {
                requestValidity = UNDERGRAD_REQUEST_VALIDITY;
            } else if (userType === 'MASTERS') {
                requestValidity = MASTERS_REQUEST_VALIDITY;
            } else if (userType === 'POSTGRAD') {
                requestValidity = POSTGRAD_REQUEST_VALIDITY;
            } else if (userType === 'PHD') {
                requestValidity = PHD_REQUEST_VALIDITY;
            } else if ('requestValidity' in req.body) {
                // If a custom request duration is specified
                // The requestValidity specifies in months how long the request will be active for
                requestValidity = req.body.requestValidity;
            }

            const startDate = Date.now();
            let { allocatedResourceId } = request;
            if ('allocatedResourceId' in req.body) {
                allocatedResourceId = req.body.allocatedResourceId;
            }

            await updateRequest(requestId, {
                allocatedResourceId,
                startDate,
            });

            const endDate = new Date(startDate);

            if (requestValidity) {
                await setRequestEndDate(
                    requestId,
                    endDate.setMonth(endDate.getMonth() + requestValidity),
                );
            }

            request = await retrieveRequestById(request._id);
            sendRequestApprovedEmail(requestUser.email, request);
        } else {
            const requestUser = await retrieveUserById(request.userId);
            sendRequestDeniedEmail(requestUser.email, request);
        }
    } catch (err) {
        console.log(err);
        return res.status(HTTP.BAD_REQUEST).send('Bad request');
    }

    return res.status(HTTP.NO_CONTENT).send('Successful');
});

/** DELETE a request */
router.delete('/:requestId', getUser, checkSuperAdmin, async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await retrieveRequestById(requestId);
        if (request === null) {
            return res
                .status(HTTP.NOT_FOUND)
                .send(`Could not find request with id: ${requestId}`);
        }
        await deleteRequest(requestId);
    } catch (err) {
        return res.status(HTTP.BAD_REQUEST).json('Bad request');
    }

    return res.status(HTTP.NO_CONTENT).send('Successful');
});

export default router;
