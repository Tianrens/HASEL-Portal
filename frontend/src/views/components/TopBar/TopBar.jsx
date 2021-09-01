import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TopBar.module.scss';
import UoaLogo from '../../../assets/images/uoaLogo.svg';
import { HamburgerDrawer, NavLinks } from './NavLinks/TopBarHelpers';

export default function TopBar() {
    // TODO: Get userType and determine if they are admin or not
    const userType = 'SUPERADMIN';
    const isAdmin = true;

    return (
        <div className={styles.fillTopbarSpace}>
            <div className={styles.navbar}>
                <div className={styles.patternBgLayer}>
                    <div className={styles.bgLayer}>
                        <Link to='/'>
                            <img
                                className={styles.uoaLogo}
                                src={UoaLogo}
                                alt='University of Auckland'
                            />
                            <div className={styles.spacer} />
                            <div className={styles.title}>
                                HASEL Lab
                                {isAdmin ? <div className={styles.subTitle}>{userType}</div> : null}
                            </div>
                        </Link>

                        <div className={styles.pushSpacer} />

                        <div className={styles.horizontalNavLinks}>
                            <NavLinks isAdmin={isAdmin} />
                        </div>

                        <HamburgerDrawer isAdmin={isAdmin} />
                    </div>
                </div>
            </div>
        </div>
    );
}
