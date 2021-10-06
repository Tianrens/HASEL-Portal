import { React, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import { useCrud } from '../../../hooks/useCrud';
import { header } from './EditBooking.module.scss';
import BottomButtons from '../../components/buttons/BottomButtons';
import { authRequest } from '../../../hooks/util/authRequest';
import BookingForm from '../../components/forms/BookingForm';
import { putUtil, deleteUtil } from '../../../util/apiUtil';
import {
    editResourceMessage,
    discardResourceMessage,
    deleteMessage,
} from '../../../config/ModalMessages';

const EditBooking = () => {
    const [bookingState, setBookingState] = useState({});
    const [error, setError] = useState(true);
    const [userWorkstation, setUserWorkstation] = useState(null);

    const userWorkstationName = userWorkstation?.name;
    const numGPUs = userWorkstation?.numGPUs;

    const history = useHistory();

    const { bookingId } = useParams();
    const booking = useCrud(`/api/booking/${bookingId}`).data;

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
