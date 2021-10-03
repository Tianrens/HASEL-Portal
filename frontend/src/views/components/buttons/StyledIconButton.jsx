import React from 'react';
import { IconButton } from '@mui/material';
import styles from './StyledIconButton.module.scss';

export function StyledIconButton({ color, icon, onClick, disabled }) {
    return (
        <IconButton
            onClick={onClick}
            className={`${styles.iconButton} ${styles[color]} ${disabled ? styles.disabled : ''}`}
            disabled={disabled}
            size="large">
            {icon}
        </IconButton>
    );
}
