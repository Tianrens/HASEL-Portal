import { sendEmail } from './sendEmail';

export async function sendExpiringAccountEmail(recipientEmail, upi) {
    const emailSubject = `Hasel Lab Workstation Account Expiring - ${upi}`;
    const emailHTML = `<html><body>Your Hasel Lab Workstation Account ${upi} is about to expire!\n\n</body></html>`;

    sendEmail(recipientEmail, emailSubject, null, emailHTML);
}
