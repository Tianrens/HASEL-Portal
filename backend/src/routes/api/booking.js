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

const router = express.Router();

/** POST add a new booking. User can only book workstation that matches signup request.
 * Request must also be ACTIVE */
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

            const specialUserTypes = ['ADMIN', 'SUPERADMIN', 'NON_ACADEMIC_STAFF', 'ACADEMIC_STAFF'];
            if (specialUserTypes.includes(req.user.type)) {
                const workstation = await retrieveWorkstationById(booking.workstationId); 
                createWorkstationUser(workstation.host, req.user.upi); // Ignores if user already exists on workstation.
            }

            return res.status(HTTP.CREATED).json(booking);
        } catch (err) {
            return res.status(HTTP.BAD_REQUEST).send(err.message);
        }
    },
);

/** GET all bookings */
router.get('/', (req, res) => {
    // TODO: GET all bookings
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** GET single booking by ID */
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

/** PUT edit a booking. Can only edit if they are ADMINS */
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

/** ARCHIVE a booking */
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
