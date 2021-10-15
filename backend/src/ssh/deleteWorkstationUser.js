import { SSHError } from 'node-ssh';
import { checkUserActive, execCommand } from '.';
import { shouldPerformUserOperation } from './util/shouldPerformUserOperation';

/**
 * @param {string} host ip address of machine to ssh into
 * @param {string} upi the account to be deleted
 */
export async function deleteWorkstationUser(host, upi) {
    const shouldDelete = await shouldPerformUserOperation(upi);
    const isActive = await checkUserActive(host, upi);
    if (!shouldDelete) {
        return;
    }
    if (isActive) {
        const errorMessage = 'Cannot delete user as user is currently logged in on the workstation.';
        throw errorMessage;
    }

    // Deletes the user, their home directory and mail spool.
    const result = await execCommand(host, `sudo userdel -r ${upi}`);

    // status code is null if process was successful
    if (result.code) {
        const errorMessage = 'Error deleting user account.';
        throw new SSHError(errorMessage);
    }
}
