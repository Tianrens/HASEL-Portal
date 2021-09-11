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

export function getValidityPeriod(accountType) {
    switch (ACCOUNT_TYPE[accountType]) {
    case ACCOUNT_TYPE.UNDERGRAD:
        return 3;
    case ACCOUNT_TYPE.MASTERS:
        return 6;
    case ACCOUNT_TYPE.POSTGRAD:
        return 6;
    case ACCOUNT_TYPE.PHD:
        return 12;
    case ACCOUNT_TYPE.STAFF:
        return 12;
    case ACCOUNT_TYPE.ACADEMIC:
        return 1000;
    default:
        return 3;
    }
}

export function getDisplayName(accountType) {
    if (ACCOUNT_TYPE[accountType]) {
        return ACCOUNT_TYPE[accountType];
    }
    // Return first letter capitalised
    return accountType.charAt(0).toUpperCase() + accountType.slice(1).toLowerCase();
}

export function supervisorNeeded() {
    const [user] = accessDoc(userDoc);
    return user?.type !== ACCOUNT_TYPE.ACADEMIC && user?.type !== ACCOUNT_TYPE.STAFF;
}

export function isAdminType() {
    const [user] = accessDoc(userDoc);
    return user?.type === 'ADMIN' || user?.type === 'SUPERADMIN';
}

export function isSuperAdminType() {
    const [user] = accessDoc(userDoc);
    return user?.type === 'SUPERADMIN';
}

export default ACCOUNT_TYPE;
