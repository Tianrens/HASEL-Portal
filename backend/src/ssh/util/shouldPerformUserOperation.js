import { specialUserTypes } from '../../config';
import { retrieveUserByUpi } from '../../db/dao/userDao';

export async function shouldPerformUserOperation(upi) {
    const user = await retrieveUserByUpi(upi);
    if (!user) {
        throw new Error(`Cannot find user with upi: ${upi}`);
    }

    if (specialUserTypes.includes(user.type)) {
        return false;
    }

    return true;
}
