import React, { useState } from 'react';
import Icon from '@mui/material/Icon';
import GpuBookingGantt from './GpuBookingGantt';
import styles from './GpuBookingGanttZoomable.module.scss';
import { StyledIconButton } from '../buttons/StyledIconButton';
import { useGet } from '../../../hooks/useGet';
import { useDoc } from '../../../state/state';
import { userDoc } from '../../../state/docs/userDoc';
import GanttLegend from './GanttLegend';

export default function GpuBookingGanttZoomable({
    workstationId,
    currentBookingData,
    conflictHandler,
}) {
    const [user] = useDoc(userDoc);

    const [delayIsFinished, setDelayIsFinished] = useState(false);
    setTimeout(() => setDelayIsFinished(true), 10); // Need a short delay so that the gantt chart renders correctly
    const workstation = useGet(`/api/workstation/${workstationId}`, delayIsFinished).data;
    const bookingsData = useGet(`/api/workstation/${workstationId}/booking`, delayIsFinished).data;

    // Zoom levels are inverse, so smaller numbers means the chart is zoomed further in
    const zoomLevels = [1, 3, 6, 12];
    const [zoomIdx, setZoomIdx] = useState(2);

    const handleIncrementZoom = () => {
        const newIdx = zoomIdx > 0 ? zoomIdx - 1 : 0;
        setZoomIdx(newIdx);
    };

    const handleDecrementZoom = () => {
        const newIdx = zoomIdx < zoomLevels.length - 1 ? zoomIdx + 1 : zoomLevels.length - 1;
        setZoomIdx(newIdx);
    };

    const isZoomInDisabled = zoomIdx === 0;
    const isZoomOutDisabled = zoomIdx === zoomLevels.length - 1;

    return (
        workstation &&
        bookingsData && (
            <div>
                <GpuBookingGantt
                    bookingData={bookingsData}
                    currentBookingData={currentBookingData}
                    numGPUs={workstation.numGPUs}
                    thisUsersId={user._id}
                    zoomLevel={zoomLevels[zoomIdx]}
                    conflictHandler={conflictHandler}
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
                    <GanttLegend hasCurrentBooking={Boolean(currentBookingData)} />
                </div>
            </div>
        )
    );
}
