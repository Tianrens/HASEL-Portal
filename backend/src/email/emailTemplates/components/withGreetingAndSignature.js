export function withGreetingAndSignature(emailBody, user) {
    return `<html><body>Hi ${user?.firstName ?? ''},<br/><br/>` +
        `${emailBody}<br/><br/>` +
        'Let us know by replying to this email if you have any questions.<br/><br/>' +
        'Best regards,<br/>' +
        'Hasel Portal Team</body></html>';
};
