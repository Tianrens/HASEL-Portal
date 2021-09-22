import { React } from 'react';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Delete, Edit } from '@material-ui/icons';
import { IconButton, Paper } from '@material-ui/core';
import styles from './UserHomePage.module.scss';
import TitleAndValue from '../../components/text/TitleAndValue';
import { authRequest } from '../../../hooks/util/authRequest';

function BookingSummary({ bookings, refetchBookings }) {
    const history = useHistory();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const successCallback = (message) => {
        enqueueSnackbar(message, {
            variant: 'success',
            autoHideDuration: 3000,
            onClose: closeSnackbar,
        });
        history.push('/');
    };

    const errorCallback = (message) => {
        enqueueSnackbar(message, {
            variant: 'error',
            autoHideDuration: 3000,
            onClose: closeSnackbar,
        });
    };

    const deleteHandler = async (id) => {
        try {
            await authRequest(`/api/booking/${id}`, 'DELETE');
            successCallback('Booking deleted');
            refetchBookings();
        } catch (err) {
            errorCallback(err.message);
        }
    };

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
                        onClick={() => history.push(`/booking/${booking._id}`)}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        className={styles.bookingInfoIcon}
                        onClick={() => deleteHandler(booking._id)}
                    >
                        <Delete />
                    </IconButton>
                </div>
            </Paper>
        );
    });
}

export default BookingSummary;