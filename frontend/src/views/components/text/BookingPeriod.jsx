import dayjs from 'dayjs';
import { React } from 'react';

const BookingPeriod = ({ startTimestamp, endTimestamp }) => {
    const startDateFormatted = dayjs(startTimestamp).format('ddd DD/MM/YY hh:mm A');
    const endDateFormatted = dayjs(endTimestamp).format('ddd DD/MM/YY hh:mm A');
    return (
        <span>
            {`${startDateFormatted}  -  ${endDateFormatted}`}
        </span>
    );
};

export default BookingPeriod;
