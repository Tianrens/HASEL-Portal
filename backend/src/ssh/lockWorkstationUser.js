import { execCommand } from '.';

/**
 * @param {string} host ip address of machine to ssh into
 * @param {string} upi the account to be locked
 */
export async function lockWorkstationUser(host, upi) {
    const result = await execCommand(host, `sudo usermod -L ${upi}`);

    // status code is null if process was successful
    if (result.code) {
        const errorMessage = 'Error locking user account.';
        throw errorMessage;
    }
}
