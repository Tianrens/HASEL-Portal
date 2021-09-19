import { React, useEffect, useState } from 'react';
import {
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
} from '@material-ui/core';
import dayjs from 'dayjs';
import styles from './BookingForm.module.scss';
import TextField from '../TextField/CustomTextField';
import GpuBookingGanttZoomable from '../gpuBookingGantt/GpuBookingGanttZoomable';

const getTimestamp = (date, time) => dayjs(`${date}T${time}:00`).valueOf();

const BookingForm = ({ updateBookingState, numGPUs, data }) => {
    const GPUList = Array.from(Array(numGPUs).keys());

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedGPUs, setGPUs] = useState(data?.gpuIndices ?? []);
    const noGPUSelected = selectedGPUs.length === 0;
    const timingInvalid = getTimestamp(startDate, startTime) > getTimestamp(endDate, endTime);

    const handleSelect = (event, GPU) => {
        if (event.target.checked) {
            setGPUs([...selectedGPUs, GPU]);
        } else {
            setGPUs(selectedGPUs.filter((gpu) => gpu !== GPU));
        }
    };
    useEffect(() => {
        if (data) {
            setStartDate(dayjs(data.startTimestamp).format('YYYY-MM-DD'));
            setStartTime(dayjs(data.startTimestamp).format('HH:mm'));
            setEndDate(dayjs(data.endTimestamp).format('YYYY-MM-DD'));
            setEndTime(dayjs(data.endTimestamp).format('HH:mm'));
            setGPUs(data.gpuIndices);
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
                        helperText={timingInvalid ? 'Start time must be before end time' : ''}
                    />
                    <TextField
                        title='Start Time'
                        type='time'
                        value={startTime}
                        error={timingInvalid}
                        setValue={setStartTime}
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
                        helperText={timingInvalid ? ' ' : ''}
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
                <GpuBookingGanttZoomable />
            </div>
            <Divider className={styles.divider} />
        </>
    );
};

export default BookingForm;
