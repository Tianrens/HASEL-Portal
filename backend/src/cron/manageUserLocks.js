import schedule from 'node-schedule';
import { retrieveRequestsByStatus } from '../db/dao/signUpRequestDao';
import { lockWorkstationUser, unlockWorkstationUser } from '../ssh';
import { retrieveCurrentBookings } from '../db/dao/bookingDao';

const REPEAT_EVERY_NTH_MINUTE = 15;

async function lockActiveUsers() {
    // TODO: Need to check if expired requests have workstation accounts
    // Lock all ACTIVE accounts
    const activeRequests = await retrieveRequestsByStatus('ACTIVE');
    // Will not lock ADMINs, SUPERADMINs, ACADEMIC_STAFF and NON_ACADEMIC_STAFF
    for (let i = 0; i < activeRequests.length; i += 1) {
        const request = activeRequests[i];
        // eslint-disable-next-line no-await-in-loop
        await lockWorkstationUser(
            request.allocatedWorkstationId.host,
            request.userId.upi,
        );
    }
}

async function unlockCurrentBookingUsers() {
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

export async function lockUnlockUsers() {
    await lockActiveUsers();
    await unlockCurrentBookingUsers();
}

export function manageUserLocks() {
    const rule = new schedule.RecurrenceRule();

    // Job repeats every nth minute
    rule.minute = [new schedule.Range(1, 59, REPEAT_EVERY_NTH_MINUTE)];
    rule.tz = 'Pacific/Auckland';

    schedule.scheduleJob(rule, lockUnlockUsers);
}
