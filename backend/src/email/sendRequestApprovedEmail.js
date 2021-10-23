import { sendEmail } from './sendEmail';
import { retrieveUserById } from '../db/dao/userDao';
import { retrieveWorkstationById } from '../db/dao/workstationDao';
import { requestApprovedEmail } from './emailTemplates/requestApprovedEmail';

/**
 * Sends an email to the user when their request is approved by a super admin.
 * @param {String} recipientEmail The email of the user to send the email to.
 * @param {SignUpRequest} request The request of the user that has been approved.
 * @param {String} url The URL of the HASEL portal.
 */
export async function sendRequestApprovedEmail(recipientEmail, request, url) {
    const getUser = retrieveUserById(request.userId);
    const getWorkstation = retrieveWorkstationById(
        request.allocatedWorkstationId,
    );
    // need to await together to prevent concurrency issues where it doesn't await for the 
    // second one to finish.
    const [user, workstation] = [await getUser, await getWorkstation];
    const email = requestApprovedEmail(user, workstation, request, url);
    sendEmail(recipientEmail, email.emailSubject, null, email.htmlContent);
}
