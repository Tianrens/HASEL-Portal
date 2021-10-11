import React from 'react';
import styles from './TopBarPageTemplate.module.scss';
import TopBar from '../../TopBar/TopBar';

export default function TopBarPageTemplate({ children }) {
    return (
        <>
            <TopBar />
            <div className={styles.content}>
                <div className={styles.container}>{children}</div>
            </div>
        </>
    );
}
