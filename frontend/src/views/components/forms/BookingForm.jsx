/* eslint-disable indent */
import { React, useEffect, useState } from 'react';
import {
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
} from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import styles from './Form.module.scss';
import CustomDateAndTime from '../TextField/CustomDateAndTime';
import GpuBookingGanttZoomable from '../gpuBookingGantt/GpuBookingGanttZoomable';
import { MAX_BOOKING_TIME } from '../../../config/consts';

dayjs.extend(duration);

const roundedUp = (date) => date.minute(Math.ceil(date.minute() / 15) * 15).second(0);

const BookingForm = ({ updateBookingState, numGPUs, data, workstationId }) => {
    const GPUList = Array.from(Array(numGPUs).keys());

    const [startTime, setStartTime] = useState(roundedUp(dayjs()));
    const [endTime, setEndTime] = useState(roundedUp(dayjs(startTime).add(3, 'hour')));
    const [selectedGPUs, setGPUs] = useState(data?.gpuIndices ?? []);
    const [hasStarted, setStarted] = useState(false);
    const [hasEnded, setEnded] = useState(false);

    const noGPUSelected = selectedGPUs.length === 0;
    const maxTime = dayjs.duration({ hours: MAX_BOOKING_TIME }).$ms;
    const currentTime = dayjs.duration(endTime.diff(startTime)).$ms;
    const tooLong = currentTime > maxTime;
    const endBeforeStart = endTime < startTime;
    const timingInvalid = tooLong || endBeforeStart;
    // eslint-disable-next-line no-nested-ternary
    const errorMessage = endBeforeStart
        ? 'End Time must be after Start Time!'
        : tooLong
        ? `Booking Time cannot exceed ${MAX_BOOKING_TIME} hours!`
        : ' ';

    const handleSelect = (event, GPU) => {
        if (event.target.checked) {
            setGPUs([...selectedGPUs, GPU]);
        } else {
            setGPUs(selectedGPUs.filter((gpu) => gpu !== GPU));
        }
    };

    const handleSetStart = (value) => {
        setStartTime(value);
        if (startTime >= endTime) {
            setEndTime(roundedUp(dayjs(value).add(3, 'hour')));
        }
    };

    useEffect(() => {
        // Set start times to current time
        if (data) {
            setStartTime(dayjs(data.startTimestamp));
            setEndTime(dayjs(data.endTimestamp));
            setGPUs(data.gpuIndices);
            setStarted(dayjs(data.startTimestamp).valueOf() < dayjs().valueOf());
            setEnded(dayjs(data.endTimestamp).valueOf() < dayjs().valueOf());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        updateBookingState(
            {
                startTimestamp: startTime,
                endTimestamp: endTime,
                gpuIndices: selectedGPUs,
            },
            noGPUSelected || timingInvalid,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startTime, endTime, selectedGPUs]);

    return (
        <>
            <form
                id='booking-form'
                autoComplete='off'
                className={styles.bookingForm}
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <div className={styles.inputContainer}>
                    <CustomDateAndTime
                        title='Start Time'
                        value={startTime}
                        handler={handleSetStart}
                        minDateTime={dayjs(roundedUp(dayjs())).subtract(1, 'minute')}
                        maxDateTime={dayjs().add(1, 'month')}
                        disabled={hasStarted}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <CustomDateAndTime
                        title='End Time'
                        value={endTime}
                        handler={setEndTime}
                        errorMessage={errorMessage}
                        minDateTime={dayjs(startTime).add(1, 'hour')}
                        maxDateTime={dayjs(startTime).add(MAX_BOOKING_TIME, 'hours')}
                        disabled={hasEnded}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <FormControl required error={noGPUSelected}>
                        <FormLabel>Select GPUs</FormLabel>
                        <FormGroup row>
                            {GPUList.map((GPU) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onClick={(event) => handleSelect(event, GPU)}
                                            checked={selectedGPUs.includes(GPU)}
                                            disabled={hasEnded}
                                        />
                                    }
                                    label={`GPU ${GPU}`}
                                    key={GPU}
                                />
                            ))}
                        </FormGroup>
                        <FormHelperText>
                            {noGPUSelected ? 'Select at least 1 GPU' : ' '}
                        </FormHelperText>
                    </FormControl>
                </div>
            </form>
            <Divider className={styles.divider} />
            <div className={styles.gantt}>
                <GpuBookingGanttZoomable
                    workstationId={workstationId}
                    currentBookingData={{
                        id: data?._id,
                        startTimestamp: new Date(startTime),
                        endTimestamp: new Date(endTime),
                        gpuIndices: selectedGPUs,
                        noGPUSelected,
                        timingInvalid,
                    }}
                />
            </div>
            <Divider className={styles.divider} />
        </>
    );
};

export default BookingForm;
