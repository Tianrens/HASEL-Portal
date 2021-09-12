import express from 'express';
import HTTP from './util/http_codes';
import { userHasBookingPerms } from './util/userPerms';
import { getUser, isAdmin } from './util/userUtil';
import {
    createBooking,
    deleteBooking,
    retrieveBookingById,
    updateBooking,
} from '../../db/dao/bookingDao';
import findMissingParams from './util/findMissingParams';
import { retrieveUserByAuthId } from '../../db/dao/userDao';

const router = express.Router();

/** POST add a new booking */
router.post('/', getUser, async (req, res) => {
    const expectedParams = [
        'resourceId',
        'startTimestamp',
        'endTimestamp',
        'gpuIndices',
    ];
    const missingParams = findMissingParams(req.body, expectedParams);
    if (missingParams) {
        return res.status(HTTP.BAD_REQUEST).send(missingParams);
    }

    // User can only book resource that matches signup request
    // Request must also be ACTIVE
    if (userHasBookingPerms(req)) {
        try {
            const booking = await createBooking({
                resourceId: req.body.resourceId,
                userId: req.user._id,
                startTimestamp: req.body.startTimestamp,
                endTimestamp: req.body.endTimestamp,
                gpuIndices: req.body.gpuIndices,
            });
            return res.status(HTTP.CREATED).json(booking);
        } catch (err) {
            return res.status(HTTP.BAD_REQUEST).send(err.message);
        }
    }

    return res
        .status(HTTP.FORBIDDEN)
        .send('No permission to book this resource');
});

/** GET all bookings */
router.get('/', (req, res) => {
    // TODO: GET all bookings
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** PUT edit a booking */
router.put('/:bookingId', getUser, async (req, res) => {
    const { bookingId } = req.params;

    const expectedParams = ['startTimestamp', 'endTimestamp', 'gpuIndices'];
    const missingParams = findMissingParams(req.body, expectedParams);
    if (missingParams) {
        return res.status(HTTP.BAD_REQUEST).send(missingParams);
    }

    // Get booking to check userId
    const booking = await retrieveBookingById(bookingId);
    // User can only edit resource if they own the booking, or they are ADMINs
    if (booking.userId !== req.user._id || isAdmin(req)) {
        try {
            // Only able to edit timmestamps and GPU counts
            await updateBooking(bookingId, {
                startTimestamp: req.body.startTimestamp,
                endTimestamp: req.body.endTimestamp,
                gpuIndices: req.body.gpuIndices,
            });
            return res.status(HTTP.NO_CONTENT).send('Successfully updated');
        } catch (err) {
            return res.status(HTTP.BAD_REQUEST).send(err.message);
        }
    }

    return res
        .status(HTTP.FORBIDDEN)
        .send('No permission to edit this booking');
});

/** DELETE a booking */
router.delete('/:bookingId', getUser, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await retrieveBookingById(bookingId);
        if (booking === null) {
            return res
                .status(HTTP.NOT_FOUND)
                .send(`Could not find booking with id: ${bookingId}`);
        }

        const user = await retrieveUserByAuthId(req.firebase.uid);
        if (!user._id.equals(booking.userId) && !isAdmin(req)) {
            return res
                .status(HTTP.FORBIDDEN)
                .send(
                    'Forbidden: User does not have permissions to delete the booking',
                );
        }

        await deleteBooking(bookingId);
    } catch (err) {
        return res.status(HTTP.BAD_REQUEST).json('Bad request');
    }

    return res.status(HTTP.NO_CONTENT).send('Successful');
});

export default router;
