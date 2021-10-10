import express from 'express';
import HTTP from './util/http_codes';
import { getUser, isAdmin } from './util/userUtil';
import {
    archiveWorkstation,
    createWorkstation,
    retrieveAllWorkstations,
    retrieveWorkstationById,
    updateWorkstation,
} from '../../db/dao/workstationDao';
import {
    archiveBooking,
    retrieveBookingsByWorkstation,
    retrieveBookingsByWorkstationForGantt,
    retrieveBookingsByWorkstationWithPagination,
} from '../../db/dao/bookingDao';
import { checkAdmin, userHasWorkstationViewPerms } from './util/userPerms';
import { checkCorrectParams } from './util/checkCorrectParams';
import { getWorkstation } from './util/workstationUtil';
import { createWorkstationUser } from '../../ssh';
import { retrieveAllUsersOfWorkstation } from '../../db/dao/signUpRequestDao';
import { sendRequestApprovedEmail } from '../../email';

const router = express.Router();
const BASE_INT_VALUE = 10;

/** POST add a new workstation. Only admins can add a new workstation. */
router.post(
    '/',
    getUser,
    checkCorrectParams([
        'name',
        'host',
        'location',
        'numGPUs',
        'gpuDescription',
        'ramDescription',
        'cpuDescription',
    ]),
    async (req, res) => {
        if (isAdmin(req)) {
            try {
                const workstation = await createWorkstation({
                    name: req.body.name,
                    host: req.body.host,
                    location: req.body.location,
                    numGPUs: req.body.numGPUs,
                    gpuDescription: req.body.gpuDescription,
                    ramDescription: req.body.ramDescription,
                    cpuDescription: req.body.cpuDescription,
                });
                return res.status(HTTP.CREATED).json(workstation);
            } catch (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err.message);
            }
        }

        return res
            .status(HTTP.FORBIDDEN)
            .send('User does not have permissions to add a new workstation');
    },
);

/** GET all workstations
 * GET /api/workstation
 * @returns The workstations in the database
 */
router.get('/', async (req, res) => {
    const workstations = await retrieveAllWorkstations();
    return res.status(HTTP.OK).json(workstations);
});

/** GET workstation details
 * GET /api/workstation/${workstationId}
 * @param   workstationId  The workstation to query
 * @returns The workstation specified
 */
router.get('/:workstationId', async (req, res) => {
    try {
        const workstation = await retrieveWorkstationById(
            req.params.workstationId,
        );
        return res.status(HTTP.OK).json(workstation);
    } catch (err) {
        return res.status(HTTP.BAD_REQUEST).send(err.message);
    }
});

/** GET bookings for a workstation.
 * Mainly for Gantt chart use
 * Only gets bookings 1 month in the future
 * userId is populated
 * GET /api/workstation/${workstationId}/booking
 * @returns The workstation bookings 1 month into the future
 */
router.get(
    '/:workstationId/booking',
    getUser,
    userHasWorkstationViewPerms,
    async (req, res) => {
        const { workstationId } = req.params;

        try {
            const bookings = await retrieveBookingsByWorkstationForGantt(
                workstationId,
            );
            return res.status(HTTP.OK).json(bookings);
        } catch (err) {
            return res.status(HTTP.BAD_REQUEST).send(err.message);
        }
    },
);

/** GET bookings for a workstation with pagination.
 * User can query for ACTIVE, FUTURE, CURRENT and PAST bookings statuses
 * userId is populated
 * GET /api/workstation/${workstationId}/booking/${status}?page=${page}&limit=${limit}
 * @param   workstationId  The workstation to query
 * @param   status      The status to query, one of ACTIVE, FUTURE, CURRENT or PAST
 * @query   page        The page number specified
 * @query   limit       The number of bookings in a page
 * @returns count       The number of bookings in the database
 * @returns pageCount   The number of pages in the database
 * @returns bookings    The bookings specified
 */
router.get(
    '/:workstationId/booking/:status',
    getUser,
    userHasWorkstationViewPerms,
    async (req, res) => {
        const page = parseInt(req.query.page, BASE_INT_VALUE);
        const limit = parseInt(req.query.limit, BASE_INT_VALUE);
        if (Number.isNaN(page) || Number.isNaN(limit)) {
            return res
                .status(HTTP.BAD_REQUEST)
                .send('The page or limit was not a number');
        }

        const { workstationId, status } = req.params;

        try {
            const { bookings, count } =
                await retrieveBookingsByWorkstationWithPagination(
                    workstationId,
                    page,
                    limit,
                    status,
                );
            const pageCount = Math.ceil(count / limit);
            return res.status(HTTP.OK).json({ count, pageCount, bookings });
        } catch (err) {
            return res.status(HTTP.BAD_REQUEST).send(err.message);
        }
    },
);

/** PUT edit a workstation */
router.put(
    '/:workstationId',
    getUser,
    checkAdmin,
    getWorkstation,
    checkCorrectParams([
        'name',
        'host',
        'location',
        'numGPUs',
        'gpuDescription',
        'ramDescription',
        'cpuDescription',
    ]),
    async (req, res) => {
        const { workstationId } = req.params;
        const { workstation: oldWorkstation } = req;

        const newWorkstation = {
            name: req.body.name,
            host: req.body.host,
            location: req.body.location,
            numGPUs: req.body.numGPUs,
            gpuDescription: req.body.gpuDescription,
            ramDescription: req.body.ramDescription,
            cpuDescription: req.body.cpuDescription,
        };

        try {
            await updateWorkstation(workstationId, newWorkstation);
        } catch (err) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err.message);
        }

        if (oldWorkstation.host !== newWorkstation.host) {
            const requests = await retrieveAllUsersOfWorkstation(
                oldWorkstation._id,
            );
            for (const request of requests) {
                try {
                    const user = request.userId;
                    const endDate = request.endDate
                        ? new Date(request.endDate).toISOString().split('T')[0]
                        : '';
                    await createWorkstationUser(
                        newWorkstation.host,
                        user.upi,
                        -1,
                        endDate,
                    );
                    sendRequestApprovedEmail(user.email, request);
                } catch (err) {
                    return res
                        .status(HTTP.INTERNAL_SERVER_ERROR)
                        .send(err.message);
                }
            }
        }

        // Delete bookings using the deleted GPUs
        if (oldWorkstation.numGPUs > newWorkstation.numGPUs) {
            const bookings = await retrieveBookingsByWorkstation(
                oldWorkstation._id,
            );

            for (let i = 0; i < bookings.length; i += 1) {
                const booking = bookings[i];
                for (let j = 0; j < booking.gpuIndices.length; j += 1) {
                    if (
                        booking.gpuIndices[j] >= newWorkstation.numGPUs &&
                        booking.gpuIndices[j] < oldWorkstation.numGPUs
                    ) {
                        await archiveBooking(booking._id);
                        break;
                    }
                }
            }
        }

        return res.status(HTTP.NO_CONTENT).send('Successful');
    },
);

/** ARCHIVE a workstation */
router.delete(
    '/:workstationId',
    getUser,
    checkAdmin,
    getWorkstation,
    async (req, res) => {
        const { workstation } = req;
        try {
            await archiveWorkstation(workstation._id);
            return res.status(HTTP.NO_CONTENT).send();
        } catch (err) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err.message);
        }
    },
);

export default router;
