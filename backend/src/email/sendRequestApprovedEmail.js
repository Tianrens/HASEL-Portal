import { sendEmail } from './sendEmail';
import { retrieveUserById } from '../db/dao/userDao';
import { retrieveWorkstationById } from '../db/dao/workstationDao';

export async function sendRequestApprovedEmail(recipientEmail, request) {
    const emailSubject = 'Hasel Portal Request Approved';

    const user = await retrieveUserById(request.userId);
    const {firstName} = user;
    const username = user.upi;
    const password = process.env.DEFAULT_HASEL_PASSWORD;
    const { endDate } = request;
    const workstation = await retrieveWorkstationById(
        request.allocatedWorkstationId,
    );
    const workstationName = workstation.name;
    const { host } = workstation;

    let endDateFormatted = '';
    if (endDate) {
        endDateFormatted = `${endDate.getDate()}/${endDate.getMonth()}/${endDate.getFullYear()}`;
    } else {
        endDateFormatted = 'Unlimited access';
    }

    const message =
        `<html><body>Hi ${firstName},<br/><br/>` +
        'Your Hasel Portal Request has been approved.<br/>' +
        'Here is your account:<br/><ul>' +
        `<li>Machine: ${host} (${workstationName})</li>` +
        `<li>Username: ${username}</li>` +
        `<li>Default password: ${password}</li>` +
        `<li>Access valid until: ${endDateFormatted}</li></ul></br>` +
        'You will be prompted to change your password on your first login.<br/><br/>' +
        'If you already have an account on the workstation, your password will not be changed.<br/><br/>' + 
        'Let us know by replying to this email if you have any questions.<br/><br/>' +
        'Best regards,<br/>' +
        'Hasel Portal Team</body></html>';

    sendEmail(recipientEmail, emailSubject, null, message);
}
