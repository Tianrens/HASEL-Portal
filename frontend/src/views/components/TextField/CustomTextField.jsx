import { React } from 'react';
import TextField from '@mui/material/TextField';
import styles from './TextField.module.scss';

const CustomTextField = ({ title, notRequired, setValue, ...props }) => (
    <div className={styles.container}>
        <p className={styles.title}>
            {title}
            <span className={styles.asterisk}>{!notRequired && ' *'}</span>
        </p>
        <TextField
            fullWidth
            required={!notRequired}
            variant='outlined'
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setValue && setValue(e.target.value)}
            {...props}
        />
    </div>
);
export default CustomTextField;
