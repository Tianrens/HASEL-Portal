import React, { useState, useEffect } from 'react';
import { Button, ClickAwayListener, Drawer, IconButton } from '@material-ui/core';
import { Close, Dehaze } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import styles from './TopBarHelpers.module.scss';
import IdIcon from '../../../../assets/images/id.svg';
import ApprovalsIcon from '../../../../assets/images/approvals.svg';
import WorkstationIcon from '../../../../assets/images/workstation.svg';
import ViewUsersIcon from '../../../../assets/images/viewUsers.svg';
import { authRequest } from '../../../../hooks/util/authRequest';

// Link button
function NavBarLink({ title, icon, link, alertBadgeNumber }) {
    return (
        <Button className={styles.wrapper}>
            <Link to={link}>
                {icon}
                <div className={styles.spacer} />
                <div className={styles.title}>{title}</div>
                {alertBadgeNumber ? (
                    <div className={styles.alertBadge}>{alertBadgeNumber}</div>
                ) : null}
            </Link>
        </Button>
    );
}

// Links just for Super Admins
function SuperAdminLinks() {
    const [numNewApprovals, setNumNewApprovals] = useState();

    useEffect(() => {
        const getAndSetValues = async () => {
            const response = await authRequest('/api/request/count/status/PENDING', 'GET');
            setNumNewApprovals(response.data.count);
        };
        getAndSetValues();
    }, []);

    const links = [
        {
            title: 'Requests',
            link: '/requests',
            src: ApprovalsIcon,
            badge: numNewApprovals,
        },
    ];

    return links.map((item) => (
        <NavBarLink
            key={item.title}
            title={item.title}
            link={item.link}
            icon={<img className={styles.navIcon} src={item.src} alt={item.title} />}
            alertBadgeNumber={item.badge}
        />
    ));
}

// Links just for admins
function AdminLinks() {
    const links = [
        { title: 'Workstations', link: '/workstations', src: WorkstationIcon },
        { title: 'View Users', link: '/users', src: ViewUsersIcon },
    ];

    return links.map((item) => (
        <NavBarLink
            key={item.title}
            title={item.title}
            link={item.link}
            icon={<img className={styles.navIcon} src={item.src} alt={item.title} />}
            alertBadgeNumber={item.badge}
        />
    ));
}

// All available links in the top bar
export function NavLinks({ isAdmin, isSuperAdmin }) {
    return (
        <div className={styles.linksWrapper}>
            {isSuperAdmin && <SuperAdminLinks />}
            {isAdmin && <AdminLinks />}

            <NavBarLink
                title='My Account'
                link='/user'
                icon={<img className={styles.navIcon} src={IdIcon} alt='My Account' />}
            />
        </div>
    );
}

// Side drawer that becomes visible on small screens
export function HamburgerDrawer({ isAdmin, isSuperAdmin }) {
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleDrawerClose}>
            <div className={styles.drawerWrapper}>
                <IconButton className={styles.drawerButton} onClick={handleDrawerOpen}>
                    <Dehaze />
                </IconButton>

                <Drawer
                    className={styles.drawer}
                    variant='persistent'
                    anchor='right'
                    open={open}
                    onClose={handleDrawerClose}
                >
                    <div className={styles.drawerPatternBg}>
                        <div className={styles.drawer}>
                            <div>
                                <IconButton
                                    className={styles.drawerButton}
                                    onClick={handleDrawerClose}
                                >
                                    <Close />
                                </IconButton>
                            </div>
                            <NavLinks isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} />
                        </div>
                    </div>
                </Drawer>
            </div>
        </ClickAwayListener>
    );
}
