import { retrieveUserById } from '../db/dao/userDao';
import { sendEmail } from './sendEmail';

export async function sendRequestDeniedEmail(recipientEmail, request) {
    const emailSubject = 'Hasel Portal Request Denied';
    const user = await retrieveUserById(request.userId);
    const {firstName} = user;


    const message =
        `Hi ${firstName},\n\n` +
        'Your Hasel Portal Request has been denied.\n\n' +
        'Best regards,\n' +
        'Hasel Portal Team';

    console.log(message);
    sendEmail(recipientEmail, emailSubject, message);
}
