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
import styles from './Form.module.scss';
import TextField from '../TextField/CustomTextField';
import GpuBookingGanttZoomable from '../gpuBookingGantt/GpuBookingGanttZoomable';

const getTimestamp = (date, time) => dayjs(`${date}T${time}:00`).valueOf();

const BookingForm = ({ updateBookingState, numGPUs, data, workstationId }) => {
    const GPUList = Array.from(Array(numGPUs).keys());

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedGPUs, setGPUs] = useState(data?.gpuIndices ?? []);
    const [isActive, setActive] = useState(false);
    const noGPUSelected = selectedGPUs.length === 0;
    const startBeforeEnd = getTimestamp(startDate, startTime) > getTimestamp(endDate, endTime);
    const startBeforeNow = !data && getTimestamp(startDate, startTime) < dayjs().valueOf();
    const timingInvalid = startBeforeEnd || startBeforeNow;
    // eslint-disable-next-line no-nested-ternary
    const errorMessage = startBeforeEnd
        ? 'Start time must be before end time'
        : startBeforeNow
        ? 'Start time must be after current time'
        : ' ';

    const handleSelect = (event, GPU) => {
        if (event.target.checked) {
            setGPUs([...selectedGPUs, GPU]);
        } else {
            setGPUs(selectedGPUs.filter((gpu) => gpu !== GPU));
        }
    };
    useEffect(() => {
        // Set start times to current time
        setStartDate(dayjs().format('YYYY-MM-DD'));
        setStartTime(dayjs().add(1, 'm').format('HH:mm'));
        if (data) {
            setStartDate(dayjs(data.startTimestamp).format('YYYY-MM-DD'));
            setStartTime(dayjs(data.startTimestamp).format('HH:mm'));
            setEndDate(dayjs(data.endTimestamp).format('YYYY-MM-DD'));
            setEndTime(dayjs(data.endTimestamp).format('HH:mm'));
            setGPUs(data.gpuIndices);
            setActive(dayjs(data.startTimestamp).valueOf() < dayjs().valueOf());
        }
    }, [data]);

    useEffect(() => {
        updateBookingState(
            {
                startTimestamp: getTimestamp(startDate, startTime),
                endTimestamp: getTimestamp(endDate, endTime),
                gpuIndices: selectedGPUs,
            },
            noGPUSelected || timingInvalid,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, startTime, endDate, endTime, selectedGPUs]);

    return (
        <>
            <form
                id='booking-form'
                autoComplete='off'
                className={styles.form}
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <div className={styles.inputContainer}>
                    <TextField
                        title='Start Date'
                        type='date'
                        value={startDate}
                        setValue={setStartDate}
                        error={timingInvalid}
                        helperText={errorMessage}
                        disabled={isActive}
                    />
                    <TextField
                        title='Start Time'
                        type='time'
                        value={startTime}
                        error={timingInvalid}
                        setValue={setStartTime}
                        disabled={isActive}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <TextField
                        title='End Date'
                        error={timingInvalid}
                        type='date'
                        value={endDate}
                        setValue={setEndDate}
                        // For nicer alignment on desktop mode
                        helperText={' '}
                    />
                    <TextField
                        title='End Time'
                        error={timingInvalid}
                        type='time'
                        value={endTime}
                        setValue={setEndTime}
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
                                        />
                                    }
                                    label={`GPU ${GPU}`}
                                    key={GPU}
                                />
                            ))}
                        </FormGroup>
                        {noGPUSelected && <FormHelperText>Select at least 1 GPU</FormHelperText>}
                    </FormControl>
                </div>
            </form>
            <Divider className={styles.divider} />
            <div className={styles.gantt}>
                <GpuBookingGanttZoomable
                    workstationId={workstationId}
                    currentBookingData={{
                        id: data?._id,
                        startTimestamp: new Date(getTimestamp(startDate, startTime)),
                        endTimestamp: new Date(getTimestamp(endDate, endTime)),
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
