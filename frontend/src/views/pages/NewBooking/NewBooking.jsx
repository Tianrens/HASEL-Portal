import { React, useState } from 'react';
import Icon from '@material-ui/core/Icon';
import { header } from './NewBooking.module.scss';
import { StyledButton } from '../../components/buttons/StyledButton';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import BookingForm from '../../components/forms/BookingForm';
import { useCrud } from '../../../hooks/useCrud';

const NewBooking = () => {
    const userWorkstation = useCrud('/api/user/workstation').data;
    const userWorkstationName = userWorkstation?.name;
    const numGPUs = userWorkstation?.numGPUs;
    const [bookingState, setBookingState] = useState({});
    const [error, setError] = useState(true);

    const updateState = (newBookingState, isError) => {
        setError(isError);
        setBookingState(newBookingState);
    };

    const submitBooking = () => {
        if (error) {
            return;
        }
        // TODO - Submit booking to server
        console.log(bookingState);
    };

    return (
        <TopBarPageTemplate>
            <h2 className={header}>Create Booking - {userWorkstationName}</h2>
            <BookingForm updateBookingState={updateState} numGPUs={numGPUs} />
            <div>
                <StyledButton
                    color='green'
                    icon={<Icon>done</Icon>}
                    type='submit'
                    onClick={submitBooking}
                >
                    Confirm
                </StyledButton>
            </div>
        </TopBarPageTemplate>
    );
};

export default NewBooking;
