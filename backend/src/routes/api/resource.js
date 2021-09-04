import express from 'express';
import HTTP from './util/http_codes';
import { getUser } from './util/userUtil';
import { retrieveAllResources } from '../../db/dao/resourceDao';
import { retrieveBookingsByResource } from '../../db/dao/bookingDao';

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

/** GET bookings for a resource */
router.get('/booking/:resourceId', getUser, async (req, res) => {
    // TODO: GET bookings for a resource
    const { resourceId } = req.params;
    const { currentRequestId } = req.user;

    // User can only view resource if they are allocated the resource or if they are ADMINs
    if (
        (currentRequestId?.status === 'ACTIVE' &&
            currentRequestId?.allocatedResourceId === resourceId) ||
        req.user.type === 'SUPERADMIN' ||
        req.user.type === 'ADMIN'
    ) {
        // TODO: Probably need to limit retrieved bookings within a range as to not overload the client
        const bookings = await retrieveBookingsByResource(resourceId);
        return res.status(HTTP.OK).json(bookings);
    }
    return res
        .status(HTTP.FORBIDDEN)
        .send('No permission to view this resource');
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
