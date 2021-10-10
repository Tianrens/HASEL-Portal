import { accessDoc } from '../state/state';
import { userDoc } from '../state/docs/userDoc';

export const NON_ADMIN_ACCOUNT_TYPE = {
    UNDERGRAD: 'Undergrad',
    MASTERS: 'Masters',
    POSTGRAD: 'Postgrad',
    PHD: 'PhD',
    NON_ACADEMIC_STAFF: 'Non-Academic Staff',
    ACADEMIC_STAFF: 'Academic Staff',
    OTHER: 'Other',
};

export const ALL_ACCOUNT_TYPE = {
    SUPERADMIN: 'Super Admin',
    ADMIN: 'Admin',
    ...NON_ADMIN_ACCOUNT_TYPE,
};

export function getValidityPeriod(accountType) {
    switch (NON_ADMIN_ACCOUNT_TYPE[accountType]) {
    case NON_ADMIN_ACCOUNT_TYPE.UNDERGRAD:
        return 3;
    case NON_ADMIN_ACCOUNT_TYPE.MASTERS:
        return 6;
    case NON_ADMIN_ACCOUNT_TYPE.POSTGRAD:
        return 6;
    case NON_ADMIN_ACCOUNT_TYPE.PHD:
        return 12;
    case NON_ADMIN_ACCOUNT_TYPE.NON_ACADEMIC_STAFF:
        return 500;
    case NON_ADMIN_ACCOUNT_TYPE.ACADEMIC_STAFF:
        return 500;
    default:
        return 3;
    }
}

export function getDisplayName(accountType) {
    if (ALL_ACCOUNT_TYPE[accountType]) {
        return ALL_ACCOUNT_TYPE[accountType];
    }
    // Return first letter capitalised
    return accountType.charAt(0).toUpperCase() + accountType.slice(1).toLowerCase();
}

export function supervisorNeeded() {
    const [user] = accessDoc(userDoc);
    return user?.type !== 'ACADEMIC_STAFF' && user?.type !== 'NON_ACADEMIC_STAFF';
}

export function isAdmin(accountType) {
    return accountType === 'ADMIN' || accountType === 'SUPERADMIN';
}

export function userIsAdmin() {
    const [user] = accessDoc(userDoc);
    return isAdmin(user?.type);
}

export function isSuperAdmin(accountType) {
    return accountType === 'SUPERADMIN';
}

export function userIsSuperAdmin() {
    const [user] = accessDoc(userDoc);
    return isSuperAdmin(user?.type);
}

export default NON_ADMIN_ACCOUNT_TYPE;
