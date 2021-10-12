import { format } from 'date-fns';

export function formattedEndDate(endDate) {
    let endDateFormatted = '';
    if (endDate) {
        endDateFormatted = format(new Date(endDate), 'd/MMM/yyyy');
    } else {
        endDateFormatted = 'Unlimited access';
    }
    return endDateFormatted;
};
