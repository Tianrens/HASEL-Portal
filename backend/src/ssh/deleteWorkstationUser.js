import { execCommand } from '.';

/**
 * @param {string} host ip address of machine to ssh into
 * @param {string} upi the account to be deleted
 */
export async function deleteWorkstationUser(host, upi) {
    // Deletes the user, their home directory and mail spool.
    const result = await execCommand(host, `sudo userdel -r ${upi}`);

    // status code is null if process was successful
    if (result.code) {
        const errorMessage = 'Error deleting user account.';
        throw errorMessage;
    }
}
