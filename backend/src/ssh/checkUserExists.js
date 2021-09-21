import { SSHError } from 'node-ssh';
import { execCommand } from '.';

/**
 * @param {string} host ip address of machine to ssh into
 * @param {string} upi check if upi exists
 */
export async function checkUserExists(host, upi) {
    const result = await execCommand(host, `id -u ${upi}`);

    if (result.code === 1 && result.stderr.includes('no such user')) {
        return false;
    }
    
    // status code is null if process was successful
    if (result.code) {
        const errorMessage = 'Error checking if user exists.';
        throw new SSHError(errorMessage);
    }

    return true;
}
