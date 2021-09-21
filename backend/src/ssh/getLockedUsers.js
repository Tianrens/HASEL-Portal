import { SSHError } from 'node-ssh';
import { execCommand } from '.';

/**
 * @param {string} host ip address of machine to ssh into
 */
export async function getLockedUsers(host) {
    const result = await execCommand(host, 'sudo passwd -S -a | grep L | cut -d " " -f1');
    
    // status code is null if process was successful
    if (result.code) {
        const errorMessage = 'Error retrieving locked accounts.';
        throw new SSHError(errorMessage);
    }

    const lockedUsers = result.stdout.split(/\r?\n/);
    
    return lockedUsers;
}
