import { React, useEffect } from 'react';
import { TextField, MenuItem } from '@mui/material';
import styles from './TextField.module.scss';
import selectMenuProps from '../../../assets/selectMenuProps';
import { NON_ADMIN_ACCOUNT_TYPE, ALL_ACCOUNT_TYPE } from '../../../config/accountTypes';

const UserTypeDropdown = ({ adminView, required, initialValue = '', setValue, ...props }) => {
    const types = adminView ? ALL_ACCOUNT_TYPE : NON_ADMIN_ACCOUNT_TYPE;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setValue(initialValue), [initialValue]);

    return (
        <div className={styles.container}>
            <p className={styles.title}>
                Account Type
                {required && <span className={styles.asterisk}> *</span>}
            </p>

            <TextField
                title='Account Type'
                select
                required={required}
                defaultValue={initialValue}
                SelectProps={{ MenuProps: selectMenuProps }}
                onChange={(event) => setValue(event.target.value)}
                {...props}
            >
                {Object.keys(types).map((option) => (
                    <MenuItem key={option} value={option}>
                        {types[option]}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
};
export default UserTypeDropdown;
