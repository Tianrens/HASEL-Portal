import { button } from './components/button';
import { withGreetingAndSignatureForAdmin } from './components/withGreetingAndSignatureForAdmin';

export function newRequestEmail(user, superAdmin, signUpRequest, url) {
    const { firstName, lastName, type } = user;
    const email = {};
    const requestLink = `${url}/requests/${signUpRequest._id}`;

    email.emailSubject = `New Sign Up Request - ${firstName} ${lastName}`;
    email.htmlContent = withGreetingAndSignatureForAdmin(
        `A user of type ${type} has submitted a new sign up request.<br/><br/>${button(
            'View Request',
            requestLink,
        )}`,
        superAdmin,
    );

    return email;
}
