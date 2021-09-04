import React from 'react';
import { Button } from '@material-ui/core';
import styles from './StyledButton.module.scss';

export function StyledButton({ color, size, icon, onClick, children, type, form }) {
    return (
        <Button
            variant='contained'
            onClick={onClick}
            startIcon={icon} // Must be a Material UI component
            className={`${styles.button} ${styles[color]}`}
            size={size}
            type={type}
            form={form}
        >
            {children}
        </Button>
    );
}
