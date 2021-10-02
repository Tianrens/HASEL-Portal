import schedule from 'node-schedule';
import {
    retrieveBookingsByEndTimestampRange,
    retrieveBookingsByStartTimestampRange,
} from '../db/dao/bookingDao';
import { lockWorkstationUser, unlockWorkstationUser } from '../ssh';

const REPEAT_EVERY_NTH_MINUTE = 15;

export async function lockUsers(startRange, endRange) {
    const endingBookings = await retrieveBookingsByEndTimestampRange(
        startRange,
        endRange,
    );
    for (let i = 0; i < endingBookings.length; i += 1) {
        const booking = endingBookings[i];
        // eslint-disable-next-line no-await-in-loop
        await lockWorkstationUser(
            booking.workstationId.host,
            booking.userId.upi,
        );
    }
}

export async function unlockUsers(startRange, endRange) {
    const startingBookings = await retrieveBookingsByStartTimestampRange(
        startRange,
        endRange,
    );
    for (let i = 0; i < startingBookings.length; i += 1) {
        const booking = startingBookings[i];
        // eslint-disable-next-line no-await-in-loop
        await unlockWorkstationUser(
            booking.workstationId.host,
            booking.userId.upi,
        );
    }
}

export async function lockUnlockUsers() {
    const coeff = 1000 * 60 * REPEAT_EVERY_NTH_MINUTE;
    const endRange = new Date(Math.round(Date.now() / coeff) * coeff);
    const startRange = new Date(endRange - coeff);

    // Lock first, then unlock
    await lockUsers(startRange, endRange);
    await unlockUsers(startRange, endRange);
}

export function manageUserLocks() {
    const rule = new schedule.RecurrenceRule();

    // Job repeats every nth minute
    rule.minute = [new schedule.Range(0, 59, REPEAT_EVERY_NTH_MINUTE)];
    rule.tz = 'Pacific/Auckland';

    schedule.scheduleJob(rule, lockUnlockUsers);
}
