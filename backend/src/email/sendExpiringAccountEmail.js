import { expiringAccountEmail } from './emailTemplates/expiringAccountEmail';
import { sendEmail } from './sendEmail';

/**
 * Send email to user telling them their account is expiring.
 * @param {SignupRequest} signUpRequest THe request of the user that is expiring.
 */
export async function sendExpiringAccountEmail(signUpRequest) {
    const { email: recipientEmail } = signUpRequest.userId;
    const email = expiringAccountEmail(signUpRequest);

    sendEmail(recipientEmail, email.emailSubject, null, email.htmlContent);
}
