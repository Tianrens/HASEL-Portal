import { withGreetingAndSignature } from './components/withGreetingAndSignature';

/**
 * Email template for denied SignupRequest
 * @param {User} user 
 * @returns email template
 */
export function requestDeniedEmail(user) {
    const email = {};
    email.emailSubject = 'Hasel Portal Request Denied';
    email.htmlContent = withGreetingAndSignature(
        'Your Hasel Portal request has been denied.',
        user,
    );
    return email;
}
