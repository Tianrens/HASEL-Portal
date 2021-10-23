import { formattedEndDate } from './components/formattedEndDate';
import { withGreetingAndSignature } from './components/withGreetingAndSignature';

/**
 * Email template for signup request
 * @param {SignupRequest} signUpRequest 
 * @returns email
 */
export function expiringAccountEmail(signUpRequest) {
    const email = {};
    const user = signUpRequest.userId;
    const { upi } = user;
    const { endDate } = signUpRequest;
    const endDateFormatted = formattedEndDate(endDate);

    email.emailSubject = `Hasel Lab Workstation Account Expiring - ${upi}`;
    email.htmlContent = withGreetingAndSignature(
        `Your Hasel Lab workstation account (username: ${upi}) is about to expire! ` +
            'Please back up your files before your account expires, or request an extension if necessary. ' + 
            'Once your account expires, you will not be able to login to the workstation and you will need to ' + 
            'submit a new HASEL Portal request to use a workstation.<br/><br/>' +
            `Your account is valid until: ${endDateFormatted}`,
        user,
    );

    return email;
}
