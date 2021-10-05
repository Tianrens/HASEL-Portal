import React from 'react';
import { Button } from '@mui/material';
import styles from './StyledButton.module.scss';

export function StyledButton({
    color,
    outline,
    size,
    icon,
    onClick,
    children,
    type,
    form,
    ...props
}) {
    return (
        <Button
            variant='contained'
            onClick={onClick}
            startIcon={icon} // Must be a Material UI component
            className={`${styles.button} ${styles[color]} ${outline ? styles.outline : ' '}`}
            size={size}
            type={type}
            form={form}
            {...props}
        >
            {children}
        </Button>
    );
}
