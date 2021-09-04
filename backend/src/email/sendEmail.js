import nodemailer from 'nodemailer';

import { retrieveUserByType, retrieveUserById } from '../db/dao/userDao';

require('dotenv').config();

function sendEmail(
    recipientEmail,
    emailSubject,
    emailText = null,
    htmlContent = null,
) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        to: recipientEmail,
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

export async function sendNewRequestEmailToSuperAdmins(signUpRequest, url) {
    await Promise.all([
        retrieveUserById(signUpRequest.userId),
        retrieveUserByType('SUPERADMIN'),
    ]).then(([user, superAdmins]) => {
        const { firstName, lastName } = user;

        const emailSubject = `New Sign Up Request - ${firstName} ${lastName}`;
        const requestLink = `${url}/request/${signUpRequest._id}`;
        const htmlContent = `<html><body>To view their request, click <a href=${requestLink}>here</a></body></html>`;

        for (let i = 0; i < superAdmins.length; i += 1) {
            const superAdmin = superAdmins[i];
            sendEmail(superAdmin.email, emailSubject, null, htmlContent);
        }
    });
}
