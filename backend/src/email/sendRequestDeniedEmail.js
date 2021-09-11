import { retrieveResourcebyId } from '../db/dao/resourceDao';
import { sendEmail } from './sendEmail';

export async function sendRequestDeniedEmail(recipientEmail, request) {
    const emailSubject = 'Hasel Lab Request Denied';
    const resource = await retrieveResourcebyId(request.allocatedResourceId);
    const resourceName = resource.name;

    const message =
        `Your Hasel Lab Request for ${resourceName} has been denied. ` +
        'Please submit another request or talk to a Hasel lab technician';

    sendEmail(recipientEmail, emailSubject, message);
}
