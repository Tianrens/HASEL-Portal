import dayjs from 'dayjs';

export const csvOptions = {
    // Order of headers
    headers: [
        'firstName',
        'lastName',
        'upi',
        'email',
        'type',
        'currentRequestId.allocatedWorkstationId.name',
        'currentRequestId.status',
        'currentRequestId.startDate',
        'currentRequestId.endDate',
    ],
    // Rename headers to something more readible
    rename: [
        'First Name',
        'Last Name',
        'UPI',
        'Email',
        'Account Type',
        'Allocated Workstation',
        'Request Status',
        'Request Start Date',
        'Request Expiry Date',
        ' ', // Remove headers for id fields, cannot delete so have to rename to blank
        ' ',
        ' ',
        ' ',
    ],
    // This lets us modify values
    typeHandlers: {
        String: (value, index) => {
            // Output date to a readible format
            if (dayjs(value).isValid()) {
                return dayjs(value).format('ddd DD/MMM/YYYY');
            }
            // Remove any id fields
            if (index === 'authUserId' || index === '_id') {
                return '';
            }
            return value;
        },
    },
};
