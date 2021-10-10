import { withGreetingAndSignature } from './components/withGreetingAndSignature';
import { button } from './components/button';

export function newRequestEmail(user, signUpRequest, url) {
    const { firstName, lastName, type } = user;
    const email = {};
    const requestLink = `${url}/requests/${signUpRequest._id}`;

    email.emailSubject = `New Sign Up Request - ${firstName} ${lastName}`;
    email.htmlContent = withGreetingAndSignature(
        `A user of type ${type} has submitted a new sign up request.<br/><br/>${button(
            'View Request',
            requestLink,
        )}`,
        user,
    );

    return email;
}
