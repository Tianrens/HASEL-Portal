import { SSHError } from 'node-ssh';
import { execCommand } from '.';

/**
 * @param {string} host ip address of machine to ssh into
 * @param {string} upi check if upi is logged in
 */
export async function checkUserActive(host, upi) {
    if (process.env.NODE_ENV !== 'production') {
        return false; // Defaults to false, to allow for easier testing.
    }

    const result = await execCommand(host, `who | grep '${upi}'`);

    if (result.code === 1) {
        return false;
    }
    
    // status code is null if process was successful
    if (result.code) {
        const errorMessage = 'Error checking if user is active.';
        throw new SSHError(errorMessage);
    }

    return true;
}
