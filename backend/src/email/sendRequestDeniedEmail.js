import { retrieveUserById } from '../db/dao/userDao';
import { requestDeniedEmail } from './emailTemplates/requestDeniedEmail';
import { sendEmail } from './sendEmail';

export async function sendRequestDeniedEmail(recipientEmail, request) {
    const user = await retrieveUserById(request.userId);
    const email = requestDeniedEmail(user);
    sendEmail(recipientEmail, email.emailSubject, null, email.htmlContent);
}
