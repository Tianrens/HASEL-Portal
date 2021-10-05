import { retrieveUserByUpi } from '../../db/dao/userDao';

export async function shouldPerformUserOperation(upi) {
    const user = await retrieveUserByUpi(upi);
    if (!user) {
        throw new Error(`Cannot find user with upi: ${upi}`);
    }

    if (user.type === 'NON_ACADEMIC_STAFF' ||
        user.type === 'ACADEMIC_STAFF' ||
        user.type === 'ADMIN' ||
        user.type === 'SUPERADMIN') {
        return false;
    }

    return true;
}
