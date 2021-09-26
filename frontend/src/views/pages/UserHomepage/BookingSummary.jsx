import { React } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Edit } from '@material-ui/icons';
import { IconButton, Paper } from '@material-ui/core';
import styles from './UserHomePage.module.scss';
import TitleAndValue from '../../components/text/TitleAndValue';

function BookingSummary({ bookings }) {
    return bookings.map((booking) => {
        const t1 = dayjs(booking.startTimestamp).format('ddd DD/MM/YYYY h:mm A');
        const t2 = dayjs(booking.endTimestamp).format('ddd DD/MM/YYYY h:mm A');
        const GPUs = booking.gpuIndices.join(', ');

        return (
            <Paper key={booking._id} elevation={1} className={styles.bookingInfo}>
                <div className={styles.bookingInfoContent}>
                    <TitleAndValue title='Start Time' value={t1} />
                    <TitleAndValue title='End Time' value={t2} />
                    <TitleAndValue title='GPUs Booked' value={GPUs} />
                </div>
                <div className={styles.bookingInfoIcons}>
                    <IconButton
                        className={styles.bookingInfoIcon}
                        component={Link}
                        to={`/bookings/${booking._id}`}
                    >
                        <Edit />
                    </IconButton>
                </div>
            </Paper>
        );
    });
}

export default BookingSummary;
