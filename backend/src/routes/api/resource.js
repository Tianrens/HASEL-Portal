import express from 'express';
import HTTP from './util/http_codes';
import { getUser } from './util/userUtil';
import { retrieveAllResources, retrieveResourcebyId } from '../../db/dao/resourceDao';
import { retrieveBookingsByResource } from '../../db/dao/bookingDao';
import { getBookingsByStatus } from './util/bookingUtil';
import { userHasResourceViewPerms } from './util/userPerms';

const router = express.Router();

/** POST add a new resource */
router.post('/', (req, res) => {
    // TODO: POST add a new resource
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** GET all resources */
router.get('/', async (req, res) => {
    const resources = await retrieveAllResources();
    return res.status(HTTP.OK).json(resources);
});

/** GET resource details */
router.get('/:resourceId', async (req, res) => {
    const resource = await retrieveResourcebyId(req.params.resourceId);
    return res.status(HTTP.OK).json(resource);
});

/** GET bookings for a resource. User can query for ACTIVE bookings */
router.get('/booking/:resourceId', getUser, async (req, res) => {
    const { query } = req;
    const { resourceId } = req.params;

    if (!userHasResourceViewPerms(req)) {
        return res.status(HTTP.FORBIDDEN).send('No permission to view this resource');
    }

    // TODO: Probably need to limit retrieved bookings within a range as to not overload the client
    let bookings = await retrieveBookingsByResource(resourceId);
    if (query.status) {
        bookings = getBookingsByStatus(query.status, bookings);
        if (!bookings) {
            return res.status(HTTP.BAD_REQUEST).send('Bad query paramater');
        }
    }
    return res.status(HTTP.OK).json(bookings);
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
