import { execCommand } from '.';

/**
 * @param {string} host ip address of machine to ssh into
 * @param {string} upi the account to be unlocked
 */
export async function unlockWorkstationUser(host, upi) {
    const result = await execCommand(host, `sudo usermod -U ${upi}`);

    // status code is null if process was successful
    if (result.code) {
        const errorMessage = 'Error unlocking user account.';
        throw errorMessage;
    }
}
