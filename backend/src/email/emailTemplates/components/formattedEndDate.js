export function formattedEndDate(endDate) {
    let endDateFormatted = '';
    if (endDate) {
        endDateFormatted = `${endDate.getDate()}/${endDate.getMonth()}/${endDate.getFullYear()}`;
    } else {
        endDateFormatted = 'Unlimited access';
    }
    return endDateFormatted;
};
