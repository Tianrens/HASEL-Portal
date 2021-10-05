import { React, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { header } from './NewBooking.module.scss';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import BookingForm from '../../components/forms/BookingForm';
import { useCrud } from '../../../hooks/useCrud';
import { onCreate } from '../../../util/editUtil';
import BottomButtons from '../../components/buttons/BottomButtons';
import { createResourceMessage, discardResourceMessage } from '../../../config/ModalMessages';

const NewBooking = () => {
    const location = useLocation();
    const workstationId = location?.state?.workstationId;

    const history = useHistory();

    const userWorkstation = useCrud(`/api/workstation/${workstationId}`).data;

    const userWorkstationName = userWorkstation?.name;
    const numGPUs = userWorkstation?.numGPUs;

    const [bookingState, setBookingState] = useState({});
    const [error, setError] = useState(true);

    const updateState = (newBookingState, isError) => {
        setError(isError);
        setBookingState(newBookingState);
    };

    return (
        <TopBarPageTemplate>
            <h2 className={header}>Create Booking - {userWorkstationName}</h2>
            <BookingForm
                updateBookingState={updateState}
                numGPUs={numGPUs}
                workstationId={workstationId}
            />
            <BottomButtons
                onDeny={() => history.goBack()}
                denyText='Cancel'
                onAccept={onCreate('booking', { workstationId, ...bookingState }, () =>
                    history.goBack(),
                )}
                acceptDisabled={error}
                acceptText='Confirm'
                denyMessage={discardResourceMessage('booking')}
                acceptMessage={createResourceMessage('booking')}
            />
        </TopBarPageTemplate>
    );
};

export default NewBooking;
