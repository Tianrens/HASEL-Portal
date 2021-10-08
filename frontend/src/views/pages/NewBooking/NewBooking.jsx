import { React, useState } from 'react';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import { header } from './NewBooking.module.scss';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import BookingForm from '../../components/forms/BookingForm';
import { postUtil } from '../../../util/apiUtil';
import BottomButtons from '../../components/buttons/BottomButtons';
import { createResourceMessage, discardResourceMessage } from '../../../config/ModalMessages';
import { useGet } from '../../../hooks/useGet';

const NewBooking = () => {
    const location = useLocation();
    const workstationId = location?.state?.workstationId;

    const history = useHistory();

    const userWorkstation = useGet(`/api/workstation/${workstationId}`).data;

    const userWorkstationName = userWorkstation?.name;
    const numGPUs = userWorkstation?.numGPUs;

    const [bookingState, setBookingState] = useState({});
    const [error, setError] = useState(true);

    const updateState = (newBookingState, isError) => {
        setError(isError);
        setBookingState(newBookingState);
    };

    if (!workstationId) {
        return <Redirect to='/' />;
    }
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
                onAccept={postUtil('booking', { workstationId, ...bookingState }, () =>
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
