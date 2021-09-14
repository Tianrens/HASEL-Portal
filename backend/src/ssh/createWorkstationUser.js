import { execCommand } from '.';

/**
 * @param {string} host ip address of machine to ssh into
 * @param {string} upi the account to be created
 * @param {*} daysInactive days after expire date till account is permanently disabled.
 * @param {string} expireDate YYYY-MM-DD
 */
export async function createWorkstationUser(host, upi, daysInactive, expireDate) {
    const addUserResult = await execCommand(host, `sudo useradd -m ${upi} -f ${daysInactive} -e ${expireDate}`);

    const changePasswordResult = await execCommand(host, `echo '${upi}:${process.env.DEFAULT_HASEL_PASSWORD}' | sudo chpasswd`);

    const addUserGroupResult = await execCommand(host, `sudo usermod -aG hasel-users ${upi}`);

    const expirePasswordResult = await execCommand(host, `sudo passwd --expire ${upi}`);

    // status code is null if process was successful
    if (addUserResult.code || changePasswordResult.code || addUserGroupResult.code || expirePasswordResult.code) {
        const errorMessage = 'Error with creating workstation user account.';
        throw errorMessage;
    }
}
