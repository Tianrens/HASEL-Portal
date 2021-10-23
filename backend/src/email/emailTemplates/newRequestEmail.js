import { button } from './components/button';
import { withGreetingAndSignatureForAdmin } from './components/withGreetingAndSignatureForAdmin';

/**
 * Email for new request
 * @param {User} user 
 * @param {User} superAdmin 
 * @param {SignupRequest} signUpRequest 
 * @param {String} url 
 * @returns formatted email
 */
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
