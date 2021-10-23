import express from 'express';
import HTTP from './util/http_codes';
import { userHasBookingPerms } from './util/userPerms';
import { getUser } from './util/userUtil';
import { getBooking } from './util/bookingUtil';
import {
    createBooking,
    archiveBooking,
    updateBooking,
} from '../../db/dao/bookingDao';
import { retrieveWorkstationById } from '../../db/dao/workstationDao';
import { checkCorrectParams } from './util/checkCorrectParams';
import { createWorkstationUser } from '../../ssh';
import { specialUserTypes } from '../../config';

const router = express.Router();

/**
 * Create a new booking. User can only book workstation that matches signup request.
 * Request must also be ACTIVE
 * POST /api/booking
 * @body workstationId of the booking
 * @body startTimestamp of the booking
 * @body endTimestamp of the booking
 * @body gpuIndices to book
 * @return booking that has been created
 */
router.post(
    '/',
    getUser,
    userHasBookingPerms,
    checkCorrectParams(['workstationId', 'startTimestamp', 'endTimestamp', 'gpuIndices']),
    async (req, res) => {
        try {
            const booking = await createBooking({
                workstationId: req.body.workstationId,
                userId: req.user._id,
                startTimestamp: req.body.startTimestamp,
                endTimestamp: req.body.endTimestamp,
                gpuIndices: req.body.gpuIndices,
            });

            if (specialUserTypes.includes(req.user.type)) {
                const workstation = await retrieveWorkstationById(booking.workstationId); 
                await createWorkstationUser(workstation.host, req.user.upi); // Ignores if user already exists on workstation.
            }

            return res.status(HTTP.CREATED).json(booking);
        } catch (err) {
            return res.status(HTTP.BAD_REQUEST).send(err.message);
        }
    },
);


/**
 * Get single booking by ID. Booking must belong to the user or the user must be an admin or above.
 * GET /api/booking/${bookingId}
 * @param bookingId of the booking to get
 * @return the singular booking
 */
router.get(
    '/:bookingId',
    getUser,
    getBooking,
    userHasBookingPerms,
    async (req, res) => {
        try {
            return res.status(HTTP.OK).send(req.booking);
        } catch (err) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json('Server error');
        }
    },
);

/**
 * Update a booking. Can only edit if they are ADMINS.
 * PUT /api/booking/${bookingId}
 * @param bookingId of the booking to update
 * @body startTimestamp of the booking
 * @body endTimestamp of the booking
 * @body gpuIndices to book
 */
router.put(
    '/:bookingId',
    getUser,
    getBooking,
    userHasBookingPerms,
    checkCorrectParams(['startTimestamp', 'endTimestamp', 'gpuIndices']),
    async (req, res) => {
        const { bookingId } = req.params;
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
    },
);

/**
 * Archive a booking.
 * DELETE /api/booking/${bookingId}
 * @param bookingId of the booking to delete
 */
router.delete(
    '/:bookingId',
    getUser,
    getBooking,
    userHasBookingPerms,
    async (req, res) => {
        const { bookingId } = req.params;
        try {
            await archiveBooking(bookingId);
        } catch (err) {
            return res.status(HTTP.BAD_REQUEST).json('Bad request');
        }

        return res.status(HTTP.NO_CONTENT).send('Successful');
    },
);

export default router;
