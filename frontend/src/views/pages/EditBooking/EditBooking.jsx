import { React, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import { useCrud } from '../../../hooks/useCrud';
import { header } from './EditBooking.module.scss';
import BottomButtons from '../../components/buttons/BottomButtons';
import { authRequest } from '../../../hooks/util/authRequest';
import BookingForm from '../../components/forms/BookingForm';
import { successSnackbar, errorSnackbar } from '../../../util/SnackbarUtil';

const EditBooking = () => {
    const [bookingState, setBookingState] = useState({});
    const [error, setError] = useState(true);
    const [userWorkstation, setUserWorkstation] = useState(null);

    const userWorkstationName = userWorkstation?.name;
    const numGPUs = userWorkstation?.numGPUs;

    const history = useHistory();
    const successCallback = (message) => {
        successSnackbar(message);
        history.goBack();
    };

    const { bookingId } = useParams();
    const booking = useCrud(`/api/booking/${bookingId}`).data;

    const onDelete = async () => {
        try {
            await authRequest(`/api/booking/${bookingId}`, 'DELETE');
            successCallback('Booking deleted successfully');
        } catch (err) {
            errorSnackbar(err.response.data);
        }
    };

    const onCancel = () => {
        history.goBack();
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
            errorSnackbar(err.response.data);
        }
    };

    useEffect(() => {
        const getAndSetValues = async () => {
            const workstationResponse = await authRequest(
                `/api/workstation/${booking ? booking?.workstationId : ''}`,
            );
            setUserWorkstation(workstationResponse.data);
        };
        getAndSetValues();
    }, [booking]);

    return (
        <TopBarPageTemplate>
            <h2 className={header}>Edit Booking - {userWorkstationName}</h2>
            {userWorkstation && (
                <BookingForm
                    updateBookingState={(newBookingState, isError) => {
                        setError(isError);
                        setBookingState(newBookingState);
                    }}
                    numGPUs={numGPUs}
                    data={booking}
                    workstationId={userWorkstation._id}
                />
            )}
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
