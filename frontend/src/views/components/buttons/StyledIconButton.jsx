import React from 'react';
import { IconButton } from '@material-ui/core';
import styles from './StyledIconButton.module.scss';

export function StyledIconButton({ color, icon, onClick, disabled }) {
    return (
        <IconButton
            onClick={onClick}
            className={`${styles.iconButton} ${styles[color]} ${disabled ? styles.disabled : ''}`}
            disabled={disabled}
        >
            {icon}
        </IconButton>
    );
}
