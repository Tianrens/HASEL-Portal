import React from 'react';
import styles from './IconWithText.module.scss';

export default function IconWithText({ icon, title, description, size, responsive }) {
    return (
        <div
            className={`${styles.wrapper} ${styles[size]} ${
                responsive ? styles.responsiveWrapper : ''
            }`}
        >
            <img
                className={`${styles.icon} ${responsive ? styles.responsiveIcon : ''}`}
                src={icon}
                alt={title}
            />
            <div className={styles.spacer} />
            <div>
                <b>{title}</b> {description ? `: ${description}` : null}
            </div>
        </div>
    );
}
