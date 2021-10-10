import { button } from './components/button';
import { formattedEndDate } from './components/formattedEndDate';
import { withGreetingAndSignature } from './components/withGreetingAndSignature';

export function requestApprovedEmail(user, workstation, request, url) {
    const email = {};

    const username = user.upi;
    const password = process.env.DEFAULT_HASEL_PASSWORD;
    const workstationName = workstation.name;
    const { host } = workstation;
    const { endDate } = request;
    const endDateFormatted = formattedEndDate(endDate);

    email.emailSubject = 'Hasel Portal Request Approved';
    email.htmlContent = withGreetingAndSignature(
        'Your Hasel Portal Request has been approved.<br/>' +
            'Here is your account:<br/><ul>' +
            `<li>Machine: ${host} (${workstationName})</li>` +
            `<li>Username: ${username}</li>` +
            `<li>Default password: ${password}</li>` +
            `<li>Access valid until: ${endDateFormatted}</li></ul></br>` +
            'You will be prompted to change your password on your first login. ' +
            'If you already have an account on the workstation, your password will not be changed.<br/><br/>' +
            'You will not be able to log in to the workstation until you have an active booking through HASEL Portal. ' +
            'This includes your initial log in to reset your password.<br/><br/>' +
            `${button('Visit HASEL Portal', url)}`,
        user,
    );

    return email;
}
