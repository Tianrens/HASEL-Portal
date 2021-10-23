import nodemailer from 'nodemailer';

require('dotenv').config();

export function sendEmail(
    recipientEmail,
    emailSubject,
    emailText = null,
    htmlContent = null,
    ccRecipients = null,
    sender = null,
) {
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
