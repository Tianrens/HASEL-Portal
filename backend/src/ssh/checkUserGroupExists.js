import { SSHError } from 'node-ssh';
import { execCommand } from '.';

/**
 * @param {string} host ip address of machine to ssh into
 */
export async function checkUserGroupExists(host) {
    if (process.env.NODE_ENV !== 'production') {
        return true; // Default value to allow for easier testing.
    }
    const result = await execCommand(host, 'grep -q -E \'hasel-users\' /etc/group');

    if (result.code === 1) {
        return false;
    }
    
    // status code is null if process was successful
    if (result.code) {
        const errorMessage = 'Error checking if user group exists.';
        throw new SSHError(errorMessage);
    }

    return true;
}
