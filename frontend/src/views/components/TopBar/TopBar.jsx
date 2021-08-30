import React from 'react';
import styles from './TopBar.module.scss';
import UoaLogo from '../../../assets/images/uoaLogo.svg';
import { HamburgerDrawer, NavLinks } from './NavLinks/TopBarHelpers';

export default function TopBar() {
    // TODO: Get usertype and determine if they are admin or not
    const userType = 'SUPERADMIN';
    const isAdmin = true;

    return (
        <div className={styles.fillTopbarSpace}>
            <div className={styles.navbar}>
                <div className={styles.patternBgLayer}>
                    <div className={styles.bgLayer}>
                        <img
                            className={styles.uoaLogo}
                            src={UoaLogo}
                            alt='University of Auckland'
                        />
                        <div className={styles.spacer} />
                        <div className={styles.title}>
                            {/* TODO: Wrap with <Link> when router is in place */}
                            HASEL Lab
                            {isAdmin ? <div className={styles.subTitle}>{userType}</div> : null}
                        </div>
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
