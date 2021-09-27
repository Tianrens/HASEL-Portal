import React from 'react';
import colours from '../../../assets/_colours.module.scss';
import styles from './GanttLegend.module.scss';

export default function GanttLegend({ hasCurrentBooking }) {
    const categories = [
        { description: 'Your Bookings', colour: colours.secondaryBlue },
        { description: 'Other Bookings', colour: colours.gray },
    ];

    if (hasCurrentBooking) {
        categories.push({ description: 'Current Booking', colour: colours.green });
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>Legend</div>
            <div className={styles.categoriesWrapper}>
                {categories.map((category) => (
                    <div key={category.description} className={styles.category}>
                        <div className={styles.dot} style={{ backgroundColor: category.colour }} />
                        {category.description}
                    </div>
                ))}
            </div>
        </div>
    );
}
