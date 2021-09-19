import { React } from 'react';
import dayjs from 'dayjs';
import styles from './Profile.module.scss';
import TitleAndValue from '../../components/text/TitleAndValue';
import StyledHeader from '../../components/text/StyledHeader';
import { isAdminType } from '../../../config/accountTypes';

const UserDetails = ({ user, adminView }) => {
    const name = `${user.firstName} ${user.lastName}`;
    const workstation = user.currentRequestId?.allocatedWorkstationId?.name;
    const creationDate = user.createdAt;
    const accountStatus = user.currentRequestId?.status || 'No Current Request';
    const expiryDate = dayjs(user.currentRequestId?.endDate).format('dddd DD/MM/YYYY');

    return (
        <div className={styles.detailsContainer}>
            <StyledHeader left sub>
                User Details
            </StyledHeader>
            <div className={styles.userInfoContainer}>
                <TitleAndValue title='Name' value={name} />
                <TitleAndValue title='UPI' value={user.upi} />
                <TitleAndValue title='Email' value={user.email} />
            </div>
            <StyledHeader left sub>
                Account Details
            </StyledHeader>
            <div className={styles.userInfoContainer}>
                <TitleAndValue title='Account Type' value={user.type} />
                <TitleAndValue
                    title='Account Creation Date'
                    value={dayjs(creationDate).format('dddd DD/MM/YYYY')}
                />
                <div className={styles.spacer} />
            </div>
            {(!isAdminType(user?.type) || adminView) && (
                <>
                    <StyledHeader left sub>
                        Workstation Request
                    </StyledHeader>
                    <div className={styles.userInfoContainer}>
                        <TitleAndValue title='Account Status' value={accountStatus} />
                        {accountStatus === 'ACTIVE' && (
                            <>
                                <TitleAndValue title='Allocated Workstation' value={workstation} />
                                <TitleAndValue
                                    title='Workstation Account Expiry Date'
                                    value={expiryDate}
                                />
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default UserDetails;
