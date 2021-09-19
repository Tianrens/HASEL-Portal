import { React, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import { useSnackbar } from 'notistack';
import { header, buttonContainer } from './NewBooking.module.scss';
import { StyledButton } from '../../components/buttons/StyledButton';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import BookingForm from '../../components/forms/BookingForm';
import { useDoc } from '../../../state/state';
import { userDoc } from '../../../state/docs/userDoc';
import { authRequest } from '../../../hooks/util/authRequest';

const NewBooking = () => {
    const [user] = useDoc(userDoc);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();

    const userWorkstation = user?.currentRequestId?.allocatedWorkstationId;
    const userWorkstationName = userWorkstation?.name;
    const workstationId = userWorkstation?._id;
    const numGPUs = userWorkstation?.numGPUs;
    const [bookingState, setBookingState] = useState({});
    const [error, setError] = useState(true);

    const updateState = (newBookingState, isError) => {
        setError(isError);
        setBookingState(newBookingState);
    };

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

    const submitBooking = async () => {
        if (error) {
            return;
        }

        try {
            await authRequest('/api/booking/', 'POST', { workstationId, ...bookingState });
            successCallback('Booking created');
        } catch (err) {
            errorCallback(err.message);
        }
    };

    return (
        <TopBarPageTemplate>
            <h2 className={header}>Create Booking - {userWorkstationName}</h2>
            <BookingForm updateBookingState={updateState} numGPUs={numGPUs} />
            <div className={buttonContainer}>
                <StyledButton
                    color='red'
                    icon={<Icon>close</Icon>}
                    onClick={() => history.goBack()}
                >
                    Cancel
                </StyledButton>
                <StyledButton
                    color='green'
                    icon={<Icon>done</Icon>}
                    type='submit'
                    onClick={submitBooking}
                    disabled={error}
                >
                    Confirm
                </StyledButton>
            </div>
        </TopBarPageTemplate>
    );
};

export default NewBooking;
