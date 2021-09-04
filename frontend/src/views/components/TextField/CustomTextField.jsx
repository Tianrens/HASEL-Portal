/* eslint-disable react/jsx-props-no-spreading */
import { React } from 'react';
import TextField from '@material-ui/core/TextField';

const CustomTextField = ({ notRequired, setValue, ...props }) => (
    <TextField
        fullWidth
        required={!notRequired}
        variant='outlined'
        InputLabelProps={{ shrink: true }}
        onChange={(e) => setValue(e.target.value)}
        {...props}
    />
);
export default CustomTextField;
