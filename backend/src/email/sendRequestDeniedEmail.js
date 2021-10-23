import { retrieveUserById } from '../db/dao/userDao';
import { requestDeniedEmail } from './emailTemplates/requestDeniedEmail';
import { sendEmail } from './sendEmail';

/**
 * Sends an email to the user when their request is denied by a super admin.
 * @param {String} recipientEmail The email of the user to send the email to.
 * @param {SignUpRequest} request The request of the user that has been denied.
 */
export async function sendRequestDeniedEmail(recipientEmail, request) {
    const user = await retrieveUserById(request.userId);
    const email = requestDeniedEmail(user);
    sendEmail(recipientEmail, email.emailSubject, null, email.htmlContent);
}
