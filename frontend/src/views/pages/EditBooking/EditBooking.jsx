import { React, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import { useCrud } from '../../../hooks/useCrud';
import { header } from './EditBooking.module.scss';
import BottomButtons from '../../components/buttons/BottomButtons';
import { authRequest } from '../../../hooks/util/authRequest';
import BookingForm from '../../components/forms/BookingForm';

const EditBooking = () => {
    const [bookingState, setBookingState] = useState({});
    const [error, setError] = useState(true);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();
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

    const { bookingId } = useParams();
    const booking = useCrud(`/api/booking/${bookingId}`).data;

    const userWorkstation = useCrud(`/api/workstation/${booking ? booking?.workstationId : ''}`).data; // avoids sending null to backend
    const userWorkstationName = userWorkstation?.name;
    const numGPUs = userWorkstation?.numGPUs;

    const onDelete = async () => {
        try {
            await authRequest(`/api/booking/${bookingId}`, 'DELETE');
            successCallback('Booking deleted successfully');
        } catch (err) {
            errorCallback(err.message);
        }
    };

    const onCancel = () => {
        history.push('/');
    };

    const onAcceptChanges = async () => {
        if (error) {
            return;
        }
        try {
            await authRequest(`/api/booking/${bookingId}`, 'PUT', {
                workstationId: userWorkstation?._id,
                ...bookingState,
            });
            successCallback('Booking updated successfully');
        } catch (err) {
            errorCallback(err.message);
        }
    };

    return (
        <TopBarPageTemplate>
            <h2 className={header}>Edit Booking - {userWorkstationName}</h2>
            <BookingForm
                updateBookingState={(newBookingState, isError) => {
                    setError(isError);
                    setBookingState(newBookingState);
                }}
                numGPUs={numGPUs}
                data={booking}
            />
            <BottomButtons
                onDelete={onDelete}
                onAccept={onAcceptChanges}
                onDeny={onCancel}
                acceptText='Confirm Changes'
                denyText='Cancel'
                acceptDisabled={error}
            />
        </TopBarPageTemplate>
    );
};

export default EditBooking;
