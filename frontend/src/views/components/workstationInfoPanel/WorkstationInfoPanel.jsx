import React from 'react';
import { Paper } from '@mui/material';
import styles from './WorkstationInfoPanel.module.scss';
import GpuBookingGanttZoomable from '../gpuBookingGantt/GpuBookingGanttZoomable';
import IconWithText from '../text/IconWithText';
import WorkstationIcon from '../../../assets/images/workstation.svg';
import CpuIcon from '../../../assets/images/cpu.svg';
import RamIcon from '../../../assets/images/ram.svg';
import GpuIcon from '../../../assets/images/gpu.svg';

export default function WorkstationInfoPanel({ workstationData, children, hideTimeline }) {
    const infoFields = [
        { icon: CpuIcon, title: 'CPU', description: workstationData.cpuDescription },
        { icon: RamIcon, title: 'RAM', description: workstationData.ramDescription },
        {
            icon: GpuIcon,
            title: 'GPU',
            description: `${workstationData.numGPUs}x ${workstationData.gpuDescription} `,
        },
    ];

    return (
        <Paper elevation={1} className={styles.wrapper}>
            <div className={styles.infoContent}>
                <div className={styles.workstationName}>
                    <IconWithText
                        icon={WorkstationIcon}
                        title={workstationData.name}
                        size='large'
                    />
                </div>

                <div className={styles.infoFields}>
                    {infoFields.map((field) => (
                        <IconWithText
                            key={field.title}
                            icon={field.icon}
                            title={field.title}
                            description={field.description}
                            responsive
                        />
                    ))}
                </div>
                {children}
            </div>
            {!hideTimeline && (
                <div className={styles.ganttWrapper}>
                    <GpuBookingGanttZoomable workstationId={workstationData._id} />
                </div>
            )}
        </Paper>
    );
}
