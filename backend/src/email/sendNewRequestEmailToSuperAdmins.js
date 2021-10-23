import { retrieveUserById, retrieveUserByType } from '../db/dao/userDao';
import { newRequestEmail } from './emailTemplates/newRequestEmail';
import { sendEmail } from './sendEmail';

/**
 * Sends an email to all super admins when a new request has been made.
 * @param {SignUpRequest} signUpRequest The request made by a user.
 * @param {String} url The URL of the user request.
 */
export async function sendNewRequestEmailToSuperAdmins(signUpRequest, url) {
    await Promise.all([
        retrieveUserById(signUpRequest.userId),
        retrieveUserByType('SUPERADMIN'),
    ]).then(([user, superAdmins]) => {
        for (let i = 0; i < superAdmins.length; i += 1) {
            const superAdmin = superAdmins[i];
            const email = newRequestEmail(user, superAdmin, signUpRequest, url);
            sendEmail(superAdmin.email, email.emailSubject, null, email.htmlContent);
        }
    });
}
