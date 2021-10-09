import { expiringRequests } from './expiringRequests';
import { lockUnlockUsers, manageUserLocks } from './manageUserLocks';
import { checkServerStatus } from './checkServerStatus';

/**
 * Should initialize all cron jobs
 * Also needs to make sure that all current booking workstation users are unlocked
 */
export async function initCron() {
    // Run initialization steps to ensure workstations are in a correct state
    await lockUnlockUsers();

    // Run cron jobs
    expiringRequests();
    manageUserLocks();
    checkServerStatus();
}
