import React, { useState } from 'react';

import { Button, ListItemIcon, ListItemText, Menu, MenuItem, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import WorkstationInfoPanel from './WorkstationInfoPanel';
import styles from './AdminWorkstationInfoPanel.module.scss';

export default function AdminWorkstationInfoPanel({ workstationData }) {
    const menuItems = [
        {
            icon: <Icon>add</Icon>,
            title: 'Create Booking',
            link: `/new-booking/workstation/${workstationData._id}`,
        },
        {
            icon: <Icon>view_list</Icon>,
            title: 'View Bookings',
            link: `/workstation/${workstationData._id}/booking`,
        },
        {
            icon: <Icon>edit</Icon>,
            title: 'Edit Workstation',
            link: `/workstation/${workstationData._id}`,
        },
    ];
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <WorkstationInfoPanel workstationData={workstationData}>
            <div className={styles.adminButtonWrapper}>
                <Button className={styles.menuButton} onClick={handleClick}>
                    <Icon>more_horiz</Icon>
                </Button>
                <Paper>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        {menuItems.map((item) => (
                            <MenuItem key={item.title} component={Link} to={item.link}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText>{item.title}</ListItemText>
                            </MenuItem>
                        ))}
                    </Menu>
                </Paper>
            </div>
        </WorkstationInfoPanel>
    );
}
