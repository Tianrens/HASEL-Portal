import nodemailer from 'nodemailer';

import { retrieveUserByType, retrieveUserById } from '../db/dao/userDao';

require('dotenv').config();

export function sendEmail(
    recipientEmail,
    emailSubject,
    emailText = null,
    htmlContent = null,
) {
    if (process.env.NODE_ENV !== 'production') {
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
            name: process.env.EMAIL_NAME,
            address: process.env.EMAIL_ADDRESS,
        },
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
        const { firstName, lastName, type } = user;

        const emailSubject = `New Sign Up Request - ${firstName} ${lastName}`;
        const requestLink = `${url}/requests/${signUpRequest._id}`;
        const htmlContent = `<html><body>A user of type ${type} has submitted a new sign up request. 
        <br/><br/>To view their request, click <a href=${requestLink}>here</a></body></html>`;

        for (let i = 0; i < superAdmins.length; i += 1) {
            const superAdmin = superAdmins[i];
            sendEmail(superAdmin.email, emailSubject, null, htmlContent);
        }
    });
}
