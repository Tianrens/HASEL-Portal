import { sendEmail } from './sendEmail';
import { retrieveUserById } from '../db/dao/userDao';
import { retrieveResourcebyId } from '../db/dao/resourceDao';

export async function sendRequestApprovedEmail(recipientEmail, request) {
    const emailSubject = 'Hasel Lab Request Approved';

    const user = await retrieveUserById(request.userId);
    const resource = await retrieveResourcebyId(request.allocatedResourceId);
    const username = user.upi;
    const password = process.env.DEFAULT_HASEL_PASSWORD;
    const resourceName = resource.name;
    const { host } = resource;
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
        `Your Hasel Lab Request for ${resourceName} from ${datePeriod} has ` +
        'been approved. Your login details are below: ' +
        `\n\nhost: ${host} \nusername: ${username}\npassword: ${password}`;

    sendEmail(recipientEmail, emailSubject, message);
}
