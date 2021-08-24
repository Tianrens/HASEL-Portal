import { execCommand } from '.';

/**
 * @param {*} host 
 * @param {*} upi 
 * @param {*} daysInactive days after expire date till account is permanently disabled.
 * @param {*} expireDate YYYY-MM-DD
 */
export async function createWorkstationUser(host, upi, daysInactive, expireDate) {
    const addUserResult = await execCommand(host, `sudo useradd -m ${upi} -f ${daysInactive} -e ${expireDate}`);

    const changePasswordResult = await execCommand(host, `echo '${upi}:${process.env.DEFAULT_HASEL_PASSWORD}' | sudo chpasswd`);

    const addUserGroupResult = await execCommand(host, `sudo usermod -aG hasel-users ${upi}`);

    if (addUserResult.stderr || changePasswordResult.stderr || addUserGroupResult.stderr) {
        const errorMessage = 'Error with creating workstation user account.';
        throw errorMessage;
    }
}