/* eslint-disable react/jsx-props-no-spreading */
import { React } from 'react';
import TextField from '@material-ui/core/TextField';
import styles from './CustomTextField.module.scss';

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
            onChange={(e) => setValue(e.target.value)}
            {...props}
        />
    </div>
);
export default CustomTextField;
