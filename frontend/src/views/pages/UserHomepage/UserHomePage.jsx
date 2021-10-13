import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Icon } from '@mui/material';
import { useDoc } from '../../../state/state';
import { fetchUser, userDoc } from '../../../state/docs/userDoc';
import { StyledButton } from '../../components/buttons/StyledButton';
import styles from './UserHomePage.module.scss';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import BookingSummary from './BookingSummary';
import WorkstationInfoPanel from '../../components/workstationInfoPanel/WorkstationInfoPanel';
import { useGet } from '../../../hooks/useGet';
import { supervisorNeeded } from '../../../config/accountTypes';
import { MAX_BOOKINGS } from '../../../config/consts';

function UserHomePage() {
    const [user] = useDoc(userDoc);
    const { firstName, lastName } = user;
    const isNormalUser = supervisorNeeded();
    const workstation = user.currentRequestId?.allocatedWorkstationId;
    const isOffline = !workstation?.status; // status=true if online

    const bookingsData = useGet(
        `/api/workstation/${workstation._id}/booking/ACTIVE?page=1&limit=1000`,
    ).data;
    const allBookings = bookingsData?.bookings;
    const userBookings =
        allBookings && allBookings.filter((booking) => booking.userId._id === user._id);

    const maxBookingsReached = userBookings?.length >= MAX_BOOKINGS && isNormalUser;
    const disableBooking = maxBookingsReached || isOffline;
    const warning =
        maxBookingsReached &&
        `You can only have up to ${MAX_BOOKINGS} simultaneous bookings. Booking creation will be enabled once a booking has been completed or is deleted.`;

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <TopBarPageTemplate>
            <h1 className={styles.title}>
                Welcome, {firstName} {lastName}!
            </h1>
            {allBookings && (
                <div className={styles.content}>
                    <div className={styles.workstationHeader}>
                        <div className={styles.header}>
                            <StyledHeader left>Workstation Availability</StyledHeader>
                        </div>
                        <StyledButton
                            type='submit'
                            icon={<Icon>add</Icon>}
                            component={Link}
                            disabled={disableBooking}
                            to={{
                                pathname: '/bookings/new',
                                state: { workstationId: workstation._id },
                            }}
                        >
                            Create Booking
                        </StyledButton>
                    </div>
                    {warning && <Alert severity='warning'>{warning}</Alert>}
                    <WorkstationInfoPanel workstationData={workstation} />

                    <div className={styles.header}>
                        <StyledHeader left>Your Bookings Summary</StyledHeader>
                    </div>
                    {userBookings.length ? (
                        <BookingSummary bookings={userBookings} isOffline={isOffline} />
                    ) : (
                        <Alert severity='info'>
                            You have no upcoming bookings. Create a booking to log in to your
                            workstation!
                        </Alert>
                    )}
                </div>
            )}
        </TopBarPageTemplate>
    );
}

export default UserHomePage;
