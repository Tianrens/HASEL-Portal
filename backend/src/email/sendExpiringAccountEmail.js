import { sendEmail } from './sendEmail';

export async function sendExpiringAccountEmail(recipientEmail, upi) {
    const emailSubject = `Hasel Lab Workstation Account Expiring - ${upi}`;
    const emailHTML = `<html><body>Your Hasel Lab Workstation Account ${upi} is about to expire!\n\n</body></html>`;

    // Maybe move this check into sendEmail.js
    if (process.env.NODE_ENV === 'production') { 
        sendEmail(recipientEmail, emailSubject, null, emailHTML);
    }
}
