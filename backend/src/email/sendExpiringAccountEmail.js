import { expiringAccountEmail } from './emailTemplates/expiringAccountEmail';
import { sendEmail } from './sendEmail';

export async function sendExpiringAccountEmail(signUpRequest) {
    const { email: recipientEmail } = signUpRequest.userId;
    const email = expiringAccountEmail(signUpRequest);

    sendEmail(recipientEmail, email.emailSubject, null, email.htmlContent);
}
