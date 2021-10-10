import { SSHError } from 'node-ssh';
import { execCommand } from '.';

/**
 * @param {string} host ip address of machine to ssh into
 * @param {string} upi account to change expire date
 * @param {string} expireDate new date at which account expires in format YYYY-MM-DD
 */
export async function changeUserExpireDate(host, upi, expireDate) {
    const result = await execCommand(
        host,
        `sudo chage -E ${expireDate} ${upi}`,
    );

    // status code is null if process was successful
    if (result.code) {
        const errorMessage = 'Error changing expire date on workstation.';
        throw new SSHError(errorMessage);
    }
}
