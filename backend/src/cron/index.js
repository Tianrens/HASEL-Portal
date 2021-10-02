import { expiringRequests } from './expiringRequests';
import { manageUserLocks } from './manageUserLocks';
import { lockActiveUsers } from './lockActiveUsers';
import { unlockCurrentBookingUsers } from './unlockCurrentBookingUsers';

/**
 * Should initialize all cron jobs
 * Also needs to make sure that all current booking workstation users are unlocked
 */
export async function initCron() {
    // Run initialization steps to ensure workstations are in a correct state
    await lockActiveUsers();
    await unlockCurrentBookingUsers();

    // Run cron jobs
    expiringRequests();
    manageUserLocks();
}
