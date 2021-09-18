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
import { checkCorrectParams } from './util/checkCorrectParams';

const router = express.Router();

/** POST add a new booking. User can only book workstation that matches signup request.
 * Request must also be ACTIVE */
router.post(
    '/',
    getUser,
    checkCorrectParams(['workstationId','startTimestamp','endTimestamp','gpuIndices']),
    async (req, res) => {
        if (userHasBookingPerms(req)) {
            try {
                const booking = await createBooking({
                    workstationId: req.body.workstationId,
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
            .send('No permission to book this workstation');
    },
);

/** GET all bookings */
router.get('/', (req, res) => {
    // TODO: GET all bookings
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** GET single booking by ID */
router.get('/:id', getUser, async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await retrieveBookingById(id);
        if (booking === null) {
            return res
                .status(HTTP.NOT_FOUND)
                .send(`Could not find booking with id: ${id}`);
        }

        if (!req.user._id.equals(booking.userId) && !isAdmin(req)) {
            return res
                .status(HTTP.FORBIDDEN)
                .send(
                    'Forbidden: User does not have permissions to get this booking',
                );
        }

        return res.status(HTTP.OK).send(booking);
    } catch (err) {
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json('Server error');
    }
});

/** PUT edit a booking */
router.put(
    '/:bookingId',
    getUser,
    checkCorrectParams(['startTimestamp', 'endTimestamp', 'gpuIndices']),
    async (req, res) => {
        const { bookingId } = req.params;

        // Get booking to check userId
        const booking = await retrieveBookingById(bookingId);
        // User can only edit workstation if they own the booking, or they are ADMINs
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
    },
);

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

        if (!req.user._id.equals(booking.userId) && !isAdmin(req)) {
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
