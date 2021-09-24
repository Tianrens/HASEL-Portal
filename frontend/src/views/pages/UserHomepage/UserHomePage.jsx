import { React, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Icon } from '@material-ui/core';
import { useDoc } from '../../../state/state';
import { userDoc } from '../../../state/docs/userDoc';
import { StyledButton } from '../../components/buttons/StyledButton';
import styles from './UserHomePage.module.scss';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import GpuBookingGanttZoomable from '../../components/gpuBookingGantt/GpuBookingGanttZoomable';
import { authRequest } from '../../../hooks/util/authRequest';
import BookingSummary from './BookingSummary';

function UserHomePage() {
    const history = useHistory();
    const [user] = useDoc(userDoc);
    const { firstName, lastName } = user;
    const workstation = user.currentRequestId?.allocatedWorkstationId;

    const [bookingsData, setBookingsData] = useState([]);
    const [userBookings, setUserBookings] = useState([]);

    const getAndSetValues = useCallback(async () => {
        const response = await authRequest(
            `/api/workstation/${workstation._id}/booking/ACTIVE?page=1&limit=1000`,
        );
        const allBookings = response.data.bookings;
        const userBookingData = allBookings.filter((booking) => booking.userId._id === user._id);
        setBookingsData(allBookings);
        setUserBookings(userBookingData);
    }, [user._id, workstation._id]);

    useEffect(() => {
        getAndSetValues();
    }, [getAndSetValues]);

    return (
        <TopBarPageTemplate>
            <div className={styles.container}>
                <h1 className={styles.title}>
                    Welcome, {firstName} {lastName}!
                </h1>
                {bookingsData && (
                    <div className={styles.content}>
                        <div className={styles.workstationHeader}>
                            <div className={styles.header}>
                                <StyledHeader left>Workstation Availability</StyledHeader>
                            </div>
                            <StyledButton
                                type='submit'
                                icon={<Icon>add</Icon>}
                                onClick={() =>
                                    history.push(`/new-booking/workstation/${workstation._id}`)
                                }
                            >
                                Create Booking
                            </StyledButton>
                        </div>
                        <GpuBookingGanttZoomable workstationId={workstation._id} />

                        <div className={styles.header}>
                            <StyledHeader left>Your Bookings Summary</StyledHeader>
                        </div>
                        <BookingSummary bookings={userBookings} refetchBookings={getAndSetValues} />
                    </div>
                )}
            </div>
        </TopBarPageTemplate>
    );
}

export default UserHomePage;
