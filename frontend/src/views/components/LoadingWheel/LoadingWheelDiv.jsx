import { React } from 'react';
import styles from './LoadingWheelDiv.module.scss';

export default function LoadingWheelDiv() {
    return (
        <div className={styles.container}>
            <div className={styles.chase}>
                <div className={styles.chaseDot} />
                <div className={styles.chaseDot} />
                <div className={styles.chaseDot} />
                <div className={styles.chaseDot} />
                <div className={styles.chaseDot} />
                <div className={styles.chaseDot} />
            </div>
        </div>
    );
}
