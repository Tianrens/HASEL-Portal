import { SSHError } from 'node-ssh';
import { execCommand } from '.';
import { shouldPerformUserOperation } from './util/shouldPerformUserOperation';

/**
 * @param {string} host ip address of machine to ssh into
 * @param {string} upi the account to be unlocked
 */
export async function unlockWorkstationUser(host, upi) {
    const shouldUnlock = await shouldPerformUserOperation(upi);
    if (!shouldUnlock) {
        return;
    }

    const result = await execCommand(host, `sudo usermod -U ${upi}`);

    // status code is null if process was successful
    if (result.code) {
        const errorMessage = 'Error unlocking user account.';
        throw new SSHError(errorMessage);
    }
}
