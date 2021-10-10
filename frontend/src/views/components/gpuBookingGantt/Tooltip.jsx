/* eslint-disable react/button-has-type */
import React from 'react';
import dayjs from 'dayjs';
import EmailIcon from '@mui/icons-material/Email';
import styles from './GpuBookingGanttZoomable.module.scss';

export default function Tooltip({ props }) {
    const otherBooking = !props.taskData.myBooking;
    const UPI = props.taskData.userUPI?.replace('"', '');
    const name = props.taskData.userName?.replace('"', '');

    return (
        <div>
            {otherBooking && (
                <>
                    User: {name}
                    <br />
                    <br />
                </>
            )}
            Start Time: {dayjs(props.startTimestamp).format('ddd DD/MM/YYYY hh:mm A')}
            <br />
            End Time: {dayjs(props.endTimestamp).format('ddd DD/MM/YYYY hh:mm A')}
            <br />
            <br />
            GPUs Booked: {props.gpuIndices.replaceAll(',', ', ')}
            {otherBooking && (
                <>
                    <br />
                    <br />
                    <a className={styles.tooltipEmail} href={`mailto:${UPI}@aucklanduni.ac.nz`}>
                        <EmailIcon fontSize='small' />
                        <span>Email user</span>
                    </a>
                </>
            )}
        </div>
    );
}
