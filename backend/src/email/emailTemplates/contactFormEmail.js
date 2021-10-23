export function contactFormEmail(body, name, upi) {
    const { subject, message } = body;
    const email = {};

    email.emailSubject = `HASEL Portal Contact Form - ${subject}`;
    email.htmlContent =
        '<html><body>Hi,<br/><br/>' +
        `${name} (${upi}) has submitted a message through the HASEL Portal contact form:<br/><br/>` +
        `${message} <br/><br/>` +
        'Best regards,<br/>' +
        'Hasel Portal Team</body></html>';

    return email;
}
