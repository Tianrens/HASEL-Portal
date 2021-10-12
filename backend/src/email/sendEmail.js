import nodemailer from 'nodemailer';

require('dotenv').config();

export function sendEmail(
    recipientEmail,
    emailSubject,
    emailText = null,
    htmlContent = null,
) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(recipientEmail);
        console.log(emailSubject);
        console.log(htmlContent);
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
