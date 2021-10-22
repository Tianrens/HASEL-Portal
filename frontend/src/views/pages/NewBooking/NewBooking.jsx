import { React, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import BookingForm from '../../components/forms/BookingForm';
import { postUtil } from '../../../util/apiUtil';
import BottomButtons from '../../components/buttons/BottomButtons';
import { createResourceMessage, discardResourceMessage } from '../../../config/ModalMessages';
import { useGet } from '../../../hooks/useGet';
import LoadingWheelDiv from '../../components/LoadingWheel/LoadingWheelDiv';
import StyledHeader from '../../components/text/StyledHeader';

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
            <StyledHeader left>Create Booking - {userWorkstationName}</StyledHeader>
            {!userWorkstation ? (
                <LoadingWheelDiv />
            ) : (
                <>
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
                </>
            )}
        </TopBarPageTemplate>
    );
};

export default NewBooking;
