import React, { useState } from 'react';
import { Alert } from '@mui/material';
import Icon from '@mui/material/Icon';
import GpuBookingGantt from './GpuBookingGantt';
import styles from './GpuBookingGanttZoomable.module.scss';
import { StyledIconButton } from '../buttons/StyledIconButton';
import { useGet } from '../../../hooks/useGet';
import { useDoc } from '../../../state/state';
import { userDoc } from '../../../state/docs/userDoc';
import GanttLegend from './GanttLegend';
import { customZoomingLevels } from './zoomLevels';
import { userIsAdmin } from '../../../config/accountTypes';

export default function GpuBookingGanttZoomable({
    workstationId,
    currentBookingData,
    conflictHandler,
}) {
    const [user] = useDoc(userDoc);
    const isAdmin = userIsAdmin();

    const [delayIsFinished, setDelayIsFinished] = useState(false);
    setTimeout(() => setDelayIsFinished(true), 10); // Need a short delay so that the gantt chart renders correctly
    const workstation = useGet(`/api/workstation/${workstationId}`, delayIsFinished).data;
    const bookingsData = useGet(
        `/api/workstation/${workstationId}/booking/ACTIVE?page=1&limit=1000`,
        delayIsFinished,
    ).data;
    const [ganttRef, setGanttRef] = useState();

    const isOffline = !workstation?.status; // status=true if online
    const offlineMessage = isAdmin
        ? 'Workstation is currently offline. Booking creation has been disabled for users.'
        : 'Workstation is currently offline. If you would like to make a booking, please try again later.';

    // Zoom levels are inverse, so smaller numbers means the chart is zoomed further in
    const [zoomIdx, setZoomIdx] = useState(2);
    const maxZoomLevel = 5;

    const handleIncrementZoom = () => {
        ganttRef.zoomIn();
        const newIdx = zoomIdx - 1;
        setZoomIdx(newIdx);
    };

    const handleDecrementZoom = () => {
        ganttRef.zoomOut();
        const newIdx = zoomIdx + 1;
        setZoomIdx(newIdx);
    };

    const zoomLevels = () => {
        ganttRef.zoomingLevels = customZoomingLevels;
    };

    const isZoomInDisabled = zoomIdx === 0;
    const isZoomOutDisabled = zoomIdx === maxZoomLevel;

    return (
        workstation &&
        bookingsData && (
            <div>
                {isOffline && <Alert severity='error'>{offlineMessage}</Alert>}
                <GpuBookingGantt
                    bookingData={bookingsData.bookings}
                    currentBookingData={currentBookingData}
                    numGPUs={workstation.numGPUs}
                    thisUsersId={user._id}
                    conflictHandler={conflictHandler}
                    setGanttRef={setGanttRef}
                    zoomLevels={zoomLevels}
                />
                <div className={styles.buttonsContainer}>
                    <div className={styles.buttons}>
                        <StyledIconButton
                            icon={<Icon>zoom_in</Icon>}
                            onClick={handleIncrementZoom}
                            disabled={isZoomInDisabled}
                        />
                        <StyledIconButton
                            icon={<Icon>zoom_out</Icon>}
                            onClick={handleDecrementZoom}
                            disabled={isZoomOutDisabled}
                        />
                    </div>
                </div>
                <div className={styles.legendWrapper}>
                    <p>Tip: Hover over a booking for more information.</p>
                    <GanttLegend hasCurrentBooking={Boolean(currentBookingData)} />
                </div>
            </div>
        )
    );
}
