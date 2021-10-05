import { retrieveRequestsByStatus } from '../db/dao/signUpRequestDao';
import { lockWorkstationUser } from '../ssh';

export async function lockActiveUsers() {
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
