import nodemailer from 'nodemailer';

require('dotenv').config();

/**
 * Sends an email using Nodemailer from the email specified in the ENV file.
 * @param {String} recipientEmail the email of the recipient(s)
 * @param {String} emailSubject the subject of the email to send
 * @param {String} emailText the main text of the email. This is used OR htmlContent is used.
 * @param {String} htmlContent the main content of the email in html form. If this is used, emailText should be null.
 * @returns 
 */
export function sendEmail(
    recipientEmail,
    emailSubject,
    emailText = null,
    htmlContent = null,
    ccRecipients = null,
    sender = null,
) {
    // if not in production mode, the email is not sent to prevent too much spam.
    // instead, the email is logged for debugging.
    if (process.env.NODE_ENV !== 'production') {
        console.log(
            'From Name: ',
            sender ? sender.name : process.env.EMAIL_NAME,
        );
        console.log(
            'From Email: ',
            sender ? sender.email : process.env.EMAIL_ADDRESS,
        );
        console.log('To: ', recipientEmail);
        console.log('CC:', ccRecipients);
        console.log('Subject: ', emailSubject);
        console.log('Content: ', htmlContent);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        secure: false,
        port: 25,
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: {
            name: sender ? sender.name : process.env.EMAIL_NAME,
            address: sender ? sender.email : process.env.EMAIL_ADDRESS,
        },
        to: recipientEmail,
        cc: ccRecipients,
        subject: emailSubject,
        text: emailText,
        html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw error;
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
}
