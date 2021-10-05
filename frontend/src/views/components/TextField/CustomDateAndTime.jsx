import { React, useState } from 'react';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DesktopDateTimePicker';
import styles from './CustomTextField.module.scss';

const CustomDateAndTime = ({
    title,
    notRequired,
    value,
    handler,
    minVal,
    errorMessage,
    disabled,
    ...props
}) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={styles.container}>
            <p className={styles.title}>
                {title}
                <span className={styles.asterisk}>{!notRequired && ' *'}</span>
            </p>
            <DateTimePicker
                renderInput={(others) => (
                    <TextField
                        {...others}
                        helperText={errorMessage}
                        onClick={() => !disabled && setOpen(true)}
                        inputProps={{
                            className: styles.dateTimePicker,
                            disabled: true,
                            value: dayjs(value).format('ddd DD/MM/YYYY hh:mm A'),
                        }}
                    />
                )}
                value={value}
                onChange={(newValue) => {
                    handler(newValue);
                }}
                inputFormat='DD/MM/YYYY hh:mm A'
                minutesStep={15}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                disabled={disabled}
                shouldDisableTime={(timeValue, clockType) => {
                    if (clockType === 'minutes' && timeValue % 15) {
                        return true;
                    }

                    return false;
                }}
                {...props}
            />
        </div>
    );
};
export default CustomDateAndTime;
