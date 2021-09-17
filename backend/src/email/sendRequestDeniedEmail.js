import { retrieveWorkstationById } from '../db/dao/workstationDao';
import { sendEmail } from './sendEmail';

export async function sendRequestDeniedEmail(recipientEmail, request) {
    const emailSubject = 'Hasel Lab Request Denied';
    const workstation = await retrieveWorkstationById(
        request.allocatedWorkstationId,
    );
    const workstationName = workstation.name;

    const message =
        `Your Hasel Lab Request for ${workstationName} has been denied. ` +
        'Please submit another request or talk to a Hasel lab technician';

    sendEmail(recipientEmail, emailSubject, message);
}
