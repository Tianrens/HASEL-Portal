import { retrieveUserByType } from '../db/dao/userDao';
import { contactFormEmail } from './emailTemplates/contactFormEmail';
import { sendEmail } from './sendEmail';

export async function sendContactFormEmail(body, name, upi, email) {
    let adminEmails;
    // get email addresses of all Admins
    await Promise.all([retrieveUserByType('ADMIN')]).then(([admins]) => {
        adminEmails = admins.map((admin) => admin.email);
    });

    const emailContent = contactFormEmail(body, name, upi);
    // send email to admins, with other admins being cc'd
    // send from the sender's email
    sendEmail(
        adminEmails[0],
        emailContent.emailSubject,
        null,
        emailContent.htmlContent,
        adminEmails.slice(1),
        { name, email },
    );
}
