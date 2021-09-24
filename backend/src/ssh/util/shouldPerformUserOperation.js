import { retrieveUserByUpi } from '../../db/dao/userDao';

export async function shouldPerformUserOperation(upi) {
    const user = await retrieveUserByUpi(upi);
    if (!user) {
        throw new Error(`Cannot find user with upi: ${upi}`);
    }

    if (user.type === 'STAFF' ||
        user.type === 'ACADEMIC' ||
        user.type === 'ADMIN' ||
        user.type === 'SUPERADMIN') {
        return false;
    }

    return true;
}
