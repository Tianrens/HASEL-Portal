import { React } from 'react';
import { Delete, Edit } from '@material-ui/icons';
import { Icon, IconButton, Paper } from '@material-ui/core';
import { useDoc } from '../../../state/state';
import { userDoc } from '../../../state/docs/userDoc';
import { StyledButton } from '../../components/buttons/StyledButton';
import styles from './UserHomePage.module.scss';
import colours from '../../../assets/_colours.module.scss';

import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import TitleAndValue from '../../components/text/TitleAndValue';
import GpuBookingGanttZoomable from '../../components/gpuBookingGantt/GpuBookingGanttZoomable';

function UserHomePage() {
    const [user] = useDoc(userDoc);
    const { firstName, lastName } = user;
    const bookings = [
        {
            id: 0,
            startTimestamp: new Date().toDateString(),
            endTimestamp: new Date().toDateString(),
            numGPUs: 2,
        },
        {
            id: 1,
            startTimestamp: new Date().toDateString(),
            endTimestamp: new Date().toDateString(),
            numGPUs: 4,
        },
    ];
    // TODO: use this once booking api is ready:
    // const bookings = useCrud('/api/booking').data ?? [];
    // note that date may need to be reformatted.

    return (
        <TopBarPageTemplate>
            <div className={styles.container}>
                <h1 className={styles.title}>
                    Welcome, {firstName} {lastName} !
                </h1>
                <div className={styles.content}>
                    <div className={styles.workstationHeader}>
                        <div className={styles.header}>
                            <StyledHeader left>Workstation Availability</StyledHeader>
                        </div>
                        <StyledButton type='submit' icon={<Icon>add</Icon>}>
                            Create Booking
                        </StyledButton>
                    </div>
                    <GpuBookingGanttZoomable myBookingColour={colours.secondaryBlue} />

                    <div className={styles.header}>
                        <StyledHeader left>Your Bookings Summary</StyledHeader>
                    </div>
                    {bookings.map((booking) => (
                        <Paper key={booking.id} elevation={1} className={styles.bookingInfo}>
                            <div className={styles.bookingInfoContent}>
                                <TitleAndValue title='Start Time' value={booking.startTimestamp} />
                                <TitleAndValue title='End Time' value={booking.endTimestamp} />
                                <TitleAndValue title='GPUs Booked' value={booking.numGPUs} />
                            </div>
                            <div className={styles.bookingInfoIcons}>
                                <IconButton className={styles.bookingInfoIcon}>
                                    <Edit />
                                </IconButton>
                                <IconButton className={styles.bookingInfoIcon}>
                                    <Delete />
                                </IconButton>
                            </div>
                        </Paper>
                    ))}
                </div>
            </div>
        </TopBarPageTemplate>
    );
}

export default UserHomePage;
