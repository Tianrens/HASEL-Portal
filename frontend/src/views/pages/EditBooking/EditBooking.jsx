import { React, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import { header } from './EditBooking.module.scss';
import BottomButtons from '../../components/buttons/BottomButtons';
import BookingForm from '../../components/forms/BookingForm';
import { putUtil, deleteUtil } from '../../../util/apiUtil';
import {
    editResourceMessage,
    discardResourceMessage,
    deleteMessage,
} from '../../../config/ModalMessages';
import { useGet } from '../../../hooks/useGet';

const EditBooking = () => {
    const [bookingState, setBookingState] = useState({});
    const [error, setError] = useState(true);

    const history = useHistory();

    const { bookingId } = useParams();
    const booking = useGet(`/api/booking/${bookingId}`).data;
    const userWorkstation = useGet(
        `/api/workstation/${booking?.workstationId}`,
        booking,
    ).data;

    const userWorkstationName = userWorkstation?.name;
    const numGPUs = userWorkstation?.numGPUs;

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
                onDelete={deleteUtil('booking', bookingId, () => history.goBack())}
                onAccept={putUtil(
                    'booking',
                    {
                        workstationId: userWorkstation?._id,
                        ...bookingState,
                    },
                    bookingId,
                    () => history.goBack(),
                )}
                onDeny={() => history.goBack()}
                acceptText='Confirm Changes'
                denyText='Cancel'
                deleteMessage={deleteMessage('booking')}
                denyMessage={discardResourceMessage('booking')}
                acceptMessage={editResourceMessage('booking')}
                acceptDisabled={error}
            />
        </TopBarPageTemplate>
    );
};

export default EditBooking;
