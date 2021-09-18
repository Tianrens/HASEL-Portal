import { retrieveBookingById } from '../../../db/dao/bookingDao';
import HTTP from './http_codes';

async function getBooking(req, res, next) {
    const { bookingId } = req.params;
    const booking = await retrieveBookingById(bookingId);
    if (!booking) {
        return res
            .status(HTTP.NOT_FOUND)
            .send(`Could not find booking with id: ${bookingId}`);
    }

    req.booking = booking;
    return next();
}

export { getBooking };
