import React from 'react';
import styles from './TitleAndValue.module.scss';

const TitleAndValue = ({ title, value }) => (
    <div>
        <p className={styles.title}>{title}</p>
        <p className={styles.value}>{value}</p>
    </div>
);

export default TitleAndValue;
