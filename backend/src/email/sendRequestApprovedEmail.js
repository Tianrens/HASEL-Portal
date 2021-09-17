import { sendEmail } from './sendEmail';
import { retrieveUserById } from '../db/dao/userDao';
import { retrieveWorkstationById } from '../db/dao/workstationDao';

export async function sendRequestApprovedEmail(recipientEmail, request) {
    const emailSubject = 'Hasel Lab Request Approved';

    const user = await retrieveUserById(request.userId);
    const workstation = await retrieveWorkstationById(
        request.allocatedWorkstationId,
    );
    const username = user.upi;
    const password = process.env.DEFAULT_HASEL_PASSWORD;
    const workstationName = workstation.name;
    const { host } = workstation;
    const { startDate, endDate } = request;

    let datePeriod = '';

    const startDateFormatted = `${startDate.getDate()}/${startDate.getMonth()}/${startDate.getFullYear()}`;

    if (endDate) {
        const endDateFormatted = `${endDate.getDate()}/${endDate.getMonth()}/${endDate.getFullYear()}`;
        datePeriod = `${startDateFormatted} to ${endDateFormatted}`;
    } else {
        datePeriod = startDateFormatted;
    }

    const message =
        `Your Hasel Lab Request for ${workstationName} from ${datePeriod} has ` +
        'been approved. Your login details are below: ' +
        `\n\nhost: ${host} \nusername: ${username}\npassword: ${password}`;

    sendEmail(recipientEmail, emailSubject, message);
}
