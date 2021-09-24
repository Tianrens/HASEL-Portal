import React, { useEffect, useState } from 'react';
import Icon from '@material-ui/core/Icon';
import GpuBookingGantt from './GpuBookingGantt';
import styles from './GpuBookingGanttZoomable.module.scss';
import { StyledIconButton } from '../buttons/StyledIconButton';
import { authRequest } from '../../../hooks/util/authRequest';
import { useDoc } from '../../../state/state';
import { userDoc } from '../../../state/docs/userDoc';

export default function GpuBookingGanttZoomable({ workstationId, currentBookingData }) {
    const [user] = useDoc(userDoc);
    const [workstation, setWorkstation] = useState(null);
    const [bookingsData, setBookingsData] = useState(null);

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

    useEffect(() => {
        const getAndSetValues = async () => {
            const workstationResponse = await authRequest(
                `/api/workstation/${workstationId || ''}`,
            );
            const bookingResponse = await authRequest(`/api/workstation/${workstationId}/booking`);
            const allBookings = bookingResponse.data;
            // Need a short delay so that the gantt chart renders correctly
            setTimeout(() => {
                setBookingsData(allBookings);
                setWorkstation(workstationResponse.data);
            }, 10);
        };
        getAndSetValues();
    }, [workstationId]);

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
                />
                <div className={styles.buttonsContainer}>
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
        )
    );
}
