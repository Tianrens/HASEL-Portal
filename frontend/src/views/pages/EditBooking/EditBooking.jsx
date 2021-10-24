import { React, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import BottomButtons from '../../components/buttons/BottomButtons';
import BookingForm from '../../components/forms/BookingForm';
import { deleteUtil, putUtil } from '../../../util/apiUtil';
import {
    deleteMessage,
    discardResourceMessage,
    editResourceMessage,
} from '../../../config/ModalMessages';
import { useGet } from '../../../hooks/useGet';
import LoadingWheelDiv from '../../components/LoadingWheel/LoadingWheelDiv';
import StyledHeader from '../../components/text/StyledHeader';

const EditBooking = () => {
    const [bookingState, setBookingState] = useState({});
    const [error, setError] = useState(true);

    const history = useHistory();

    const { bookingId } = useParams();
    const booking = useGet(`/api/booking/${bookingId}`).data;
    const userWorkstation = useGet(`/api/workstation/${booking?.workstationId}`, booking).data;

    const userWorkstationName = userWorkstation?.name;
    const numGPUs = userWorkstation?.numGPUs;

    const hasEnded = dayjs(booking?.endTimestamp).valueOf() < dayjs().valueOf();

    return (
        <TopBarPageTemplate>
            <StyledHeader left back={hasEnded}>
                Edit Booking - {userWorkstationName}
            </StyledHeader>
            {!userWorkstation ? (
                <LoadingWheelDiv />
            ) : (
                <>
                    <BookingForm
                        updateBookingState={(newBookingState, isError) => {
                            setError(isError);
                            setBookingState(newBookingState);
                        }}
                        numGPUs={numGPUs}
                        data={booking}
                        workstationId={userWorkstation._id}
                    />

                    <BottomButtons
                        onDelete={deleteUtil('booking', bookingId, () => history.goBack())}
                        onAccept={
                            !hasEnded &&
                            putUtil(
                                'booking',
                                {
                                    workstationId: userWorkstation?._id,
                                    ...bookingState,
                                },
                                bookingId,
                                () => history.goBack(),
                            )
                        }
                        onDeny={
                            !hasEnded &&
                            function goBack() {
                                history.goBack();
                            }
                        }
                        acceptText='Confirm Changes'
                        denyText='Cancel'
                        deleteMessage={deleteMessage('booking')}
                        denyMessage={discardResourceMessage('booking')}
                        acceptMessage={editResourceMessage('booking')}
                        acceptDisabled={error}
                    />
                </>
            )}
        </TopBarPageTemplate>
    );
};

export default EditBooking;
