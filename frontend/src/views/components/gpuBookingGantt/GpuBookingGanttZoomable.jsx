import React, { useState } from 'react';
import Icon from '@material-ui/core/Icon';
import GpuBookingGantt from './GpuBookingGantt';
import styles from './GpuBookingGanttZoomable.module.scss';
import { StyledIconButton } from '../buttons/StyledIconButton';

export default function GpuBookingGanttZoomable({
    bookingData,
    resourceData,
    thisUsersId,
    myBookingColour,
}) {
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
        <div>
            <GpuBookingGantt
                bookingData={bookingData}
                resourceData={resourceData}
                thisUsersId={thisUsersId}
                myBookingColour={myBookingColour}
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
    );
}
