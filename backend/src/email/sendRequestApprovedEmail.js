import { sendEmail } from './sendEmail';
import { retrieveUserById } from '../db/dao/userDao';
import { retrieveWorkstationById } from '../db/dao/workstationDao';
import { requestApprovedEmail } from './emailTemplates/requestApprovedEmail';

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
