import { retrieveCurrentBookings } from '../db/dao/bookingDao';
import { unlockWorkstationUser } from '../ssh';

export async function unlockCurrentBookingUsers() {
    // Unlock all current bookings
    const currentBookings = await retrieveCurrentBookings();
    for (let i = 0; i < currentBookings.length; i += 1) {
        const booking = currentBookings[i];
        // eslint-disable-next-line no-await-in-loop
        await unlockWorkstationUser(
            booking.workstationId.host,
            booking.userId.upi,
        );
    }
}
