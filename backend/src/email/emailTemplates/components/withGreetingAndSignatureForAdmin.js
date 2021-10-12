export function withGreetingAndSignatureForAdmin(emailBody, admin) {
    return `<html><body>Hi ${admin?.firstName ?? ''},<br/><br/>` +
        `${emailBody}<br/><br/>` +
        'Best regards,<br/>' +
        'Hasel Portal Team</body></html>';
};
