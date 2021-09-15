import express from 'express';
import HTTP from './util/http_codes';
import { getUser } from './util/userUtil';
import {
    retrieveAllResources,
    retrieveResourcebyId,
} from '../../db/dao/resourceDao';
import { retrieveBookingsByResource } from '../../db/dao/bookingDao';
import { userHasResourceViewPerms } from './util/userPerms';

const router = express.Router();
const BASE_INT_VALUE = 10;

/** POST add a new resource */
router.post('/', (req, res) => {
    // TODO: POST add a new resource
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** GET all resources
 * GET /api/resource
 * @returns The resources in the database
 */
router.get('/', async (req, res) => {
    const resources = await retrieveAllResources();
    return res.status(HTTP.OK).json(resources);
});

/** GET resource details
 * GET /api/resource/${resourceId}
 * @param   resourceId  The resource to query
 * @returns The resource specified
 */
router.get('/:resourceId', async (req, res) => {
    const resource = await retrieveResourcebyId(req.params.resourceId);
    return res.status(HTTP.OK).json(resource);
});

/** GET bookings for a resource.
 * User can query for ACTIVE, FUTURE, CURRENT and PAST bookings statuses
 * GET /api/resource/${resourceId}/booking/${status}?page=${page}&limit=${limit}
 * @param   resourceId  The resource to query
 * @param   status      The status to query, one of ACTIVE, FUTURE, CURRENT or PAST
 * @query   page        The page number specified
 * @query   limit       The number of bookings in a page
 * @returns count       The number of bookings in the database
 * @returns pageCount   The number of pages in the database
 * @returns bookings    The bookings specified
 */
router.get('/:resourceId/booking/:status', getUser, async (req, res) => {
    const page = parseInt(req.query.page, BASE_INT_VALUE);
    const limit = parseInt(req.query.limit, BASE_INT_VALUE);
    if (Number.isNaN(page) || Number.isNaN(limit)) {
        return res
            .status(HTTP.BAD_REQUEST)
            .send('The page or limit was not a number');
    }

    const { resourceId, status } = req.params;

    if (!userHasResourceViewPerms(req)) {
        return res
            .status(HTTP.FORBIDDEN)
            .send('No permission to view this resource');
    }

    try {
        const { bookings, count } = await retrieveBookingsByResource(
            resourceId,
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

/** PUT edit a resource */
router.put('/', (req, res) => {
    // TODO: PUT edit a resource
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** DELETE a resource */
router.delete('/', (req, res) => {
    // TODO: DELETE a resource
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

export default router;
