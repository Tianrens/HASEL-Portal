import express from 'express';
import { SSHError } from 'node-ssh';
import { addDays } from 'date-fns';
import { getUser } from './util/userUtil';
import HTTP from './util/http_codes';
import {
    archiveRequest,
    countRequests,
    createSignUpRequest,
    retrieveRequestById,
    retrieveRequests,
    setRequestEndDate,
    updateRequest,
    updateRequestStatus,
} from '../../db/dao/signUpRequestDao';
import {
    sendNewRequestEmailToSuperAdmins,
    sendRequestApprovedEmail,
    sendRequestDeniedEmail,
} from '../../email';
import { checkSuperAdmin, userHasRequestViewPerms } from './util/userPerms';
import {
    changeUserExpireDate,
    createWorkstationUser,
    deleteWorkstationUser,
} from '../../ssh';
import { retrieveWorkstationById } from '../../db/dao/workstationDao';

const router = express.Router();
const BASE_INT_VALUE = 10;

/** 
 * POST /api/request
 * Creates a new request using the input request
 * @returns {signUpRequest} The link to the created request in the response
 */
router.post('/', getUser, async (req, res) => {
    try {
        const signUpRequest = await createSignUpRequest({
            userId: req.user._id,
            allocatedWorkstationId: req.body.allocatedWorkstationId,
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

/** GET requests
 * GET /api/request/status/${status}
 * @param   status      The status of the request (where its active, pending, declined, etc.)
 * @query   page        The page number specified
 * @query   limit       The number of requests in a page
 * @returns count       The number of matching requests in the database
 * @returns pageCount   The number of pages the results span over
 * @returns requests    The array of matching request objects
 */
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

/** GET request count
 * GET /api/request/count/status/${status}
 * @param   status      The status of the request (where its active, pending, declined, etc.)
 * @returns count       The number of matching requests in the database with the given status
 */
router.get(
    '/count/status/:status',
    getUser,
    checkSuperAdmin,
    async (req, res) => {
        const { status } = req.params;
        try {
            const count = await countRequests(status);
            return res.status(HTTP.OK).json({
                count,
            });
        } catch (err) {
            return res.status(HTTP.BAD_REQUEST).json('Bad request');
        }
    },
);

/** GET single request
 * GET /api/request/${requestId}
 * @param   requestId   Id of the request object which needs to be retrieved
 * @returns request     The matching request object
 */
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

/** PATCH - approve or deny requests
 * PATCH /api/request/${requestId}
 * @param   requestId   Id of the request object which needs to be changed
 */
router.patch('/:requestId', getUser, checkSuperAdmin, async (req, res) => {
    // Status must be either ACTIVE or DECLINED
    if (
        !req.body.status ||
        (req.body.status !== 'ACTIVE' && req.body.status !== 'DECLINED')
    ) {
        return res.status(HTTP.BAD_REQUEST).send('Bad request');
    }

    const { requestId } = req.params;
    let request = await retrieveRequestById(requestId);
    if (!request) {
        return res
            .status(HTTP.NOT_FOUND)
            .send(`Could not find request with id: ${requestId}`);
    }
    const requestUser = request.userId;
    const startDate = Date.now();

    let endDate;
    let expireDateString;
    if ('endDate' in req.body) {
        endDate = new Date(req.body.endDate);
        [expireDateString] = addDays(endDate, 1).toISOString().split('T');
    }

    let { allocatedWorkstationId } = request;
    if ('allocatedWorkstationId' in req.body) {
        allocatedWorkstationId = req.body.allocatedWorkstationId;
    }
    const workstation = await retrieveWorkstationById(allocatedWorkstationId);

    try {
        if (request.status === 'PENDING' && req.body.status === 'ACTIVE') {
            // Initial approval, need to create
            // Need to create the workstation user first to ensure that if an error occurs,
            // database is not affected
            await createWorkstationUser(
                workstation.host,
                request.userId.upi,
                -1,
                expireDateString,
            );

            // Update database
            await updateRequest(requestId, {
                allocatedWorkstationId,
                startDate,
            });

            await updateRequestStatus(requestId, req.body.status);
            await setRequestEndDate(requestId, endDate);
            request = await retrieveRequestById(request._id);
            sendRequestApprovedEmail(
                requestUser.email,
                request,
                `${req.protocol}://${req.get('host')}`,
            );
        } else if (request.status === 'ACTIVE') {
            // Request already approved, editing information
            // Change workstation information first
            if (
                allocatedWorkstationId !==
                request.allocatedWorkstationId.toString()
            ) {
                // Get original workstation
                const oldWorkstation = await retrieveWorkstationById(
                    request.allocatedWorkstationId,
                );
                // Delete and recreate user on new workstation and expireDate
                await deleteWorkstationUser(
                    oldWorkstation.host,
                    request.userId.upi,
                );
                await createWorkstationUser(
                    workstation.host,
                    request.userId.upi,
                    -1,
                    expireDateString,
                );
            } else if (req.body.endDate !== request.endDate.toISOString()) {
                // Just change expire date
                await changeUserExpireDate(
                    workstation.host,
                    request.userId.upi,
                    expireDateString,
                );
            }
            // Change database information
            await updateRequest(requestId, {
                allocatedWorkstationId,
                endDate,
            });
            request = await retrieveRequestById(request._id);
            // Send new approved email to indicate that host/endDate has changed
            sendRequestApprovedEmail(
                requestUser.email,
                request,
                `${req.protocol}://${req.get('host')}`,
            );
        } else {
            await updateRequestStatus(requestId, req.body.status);
            sendRequestDeniedEmail(requestUser.email, request);
        }
    } catch (err) {
        if (err instanceof SSHError) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json(err);
        }
        return res.status(HTTP.BAD_REQUEST).json(err);
    }

    return res.status(HTTP.NO_CONTENT).send('Successful');
});

/** DELETE archive a request
 * DELETE /api/request/${requestId}
 * @param   requestId   Id of the request object which needs to be archived
 */
router.delete('/:requestId', getUser, checkSuperAdmin, async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await retrieveRequestById(requestId);
        if (request === null) {
            return res
                .status(HTTP.NOT_FOUND)
                .send(`Could not find request with id: ${requestId}`);
        }
        const workstation = await retrieveWorkstationById(
            request.allocatedWorkstationId,
        );

        // TODO: Need to check whether EXPIRED users also still have their account
        // Need to delete the workstation user first to ensure that if an error occurs,
        // database is not affected
        if (request.status === 'ACTIVE') {
            await deleteWorkstationUser(workstation.host, request.userId.upi);
        }
        // Update database
        await archiveRequest(requestId);
    } catch (err) {
        if (err instanceof SSHError) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json(err);
        }
        return res.status(HTTP.BAD_REQUEST).json(err);
    }

    return res.status(HTTP.NO_CONTENT).send('Successful');
});

export default router;
