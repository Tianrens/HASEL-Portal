import { accessDoc } from '../state/state';
import { userDoc } from '../state/docs/userDoc';

const ACCOUNT_TYPE = {
    UNDERGRAD: 'Undergrad',
    MASTERS: 'Masters',
    POSTGRAD: 'Postgrad',
    PHD: 'PhD',
    STAFF: 'Staff',
    ACADEMIC: 'Academic',
    OTHER: 'Other',
};

export function supervisorNeeded() {
    const [user] = accessDoc(userDoc);
    return user?.type !== ACCOUNT_TYPE.ACADEMIC && user?.type !== ACCOUNT_TYPE.STAFF;
}

export function isAdminType() {
    const [user] = accessDoc(userDoc);
    return user?.type === 'ADMIN' || user?.type === 'SUPERADMIN';
}

export default ACCOUNT_TYPE;
