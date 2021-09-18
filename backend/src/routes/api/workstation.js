import express from 'express';
import HTTP from './util/http_codes';
import { getUser, isAdmin } from './util/userUtil';
import {
    createWorkstation,
    retrieveAllWorkstations,
    retrieveWorkstationById,
} from '../../db/dao/workstationDao';
import { retrieveBookingsByWorkstation } from '../../db/dao/bookingDao';
import { userHasWorkstationViewPerms } from './util/userPerms';
import findMissingParams from './util/findMissingParams';

const router = express.Router();
const BASE_INT_VALUE = 10;

/** POST add a new workstation */
router.post('/', getUser, async (req, res) => {
    const expectedParams = [
        'name',
        'host',
        'location',
        'numGPUs',
        'gpuDescription',
        'ramDescription',
        'cpuDescription',
    ];

    const missingParams = findMissingParams(req.body, expectedParams);
    if (missingParams) {
        return res.status(HTTP.BAD_REQUEST).send(missingParams);
    }
    // Only admins can add a new workstation
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
});

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
    const workstation = await retrieveWorkstationById(req.params.workstationId);
    return res.status(HTTP.OK).json(workstation);
});

/** GET bookings for a workstation.
 * User can query for ACTIVE, FUTURE, CURRENT and PAST bookings statuses
 * GET /api/workstation/${workstationId}/booking/${status}?page=${page}&limit=${limit}
 * @param   workstationId  The workstation to query
 * @param   status      The status to query, one of ACTIVE, FUTURE, CURRENT or PAST
 * @query   page        The page number specified
 * @query   limit       The number of bookings in a page
 * @returns count       The number of bookings in the database
 * @returns pageCount   The number of pages in the database
 * @returns bookings    The bookings specified
 */
router.get('/:workstationId/booking/:status', getUser, async (req, res) => {
    const page = parseInt(req.query.page, BASE_INT_VALUE);
    const limit = parseInt(req.query.limit, BASE_INT_VALUE);
    if (Number.isNaN(page) || Number.isNaN(limit)) {
        return res
            .status(HTTP.BAD_REQUEST)
            .send('The page or limit was not a number');
    }

    const { workstationId, status } = req.params;

    if (!userHasWorkstationViewPerms(req)) {
        return res
            .status(HTTP.FORBIDDEN)
            .send('No permission to view this workstation');
    }

    try {
        const { bookings, count } = await retrieveBookingsByWorkstation(
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
});

/** PUT edit a workstation */
router.put('/', (req, res) => {
    // TODO: PUT edit a workstation
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** DELETE a workstation */
router.delete('/', (req, res) => {
    // TODO: DELETE a workstation
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

export default router;
