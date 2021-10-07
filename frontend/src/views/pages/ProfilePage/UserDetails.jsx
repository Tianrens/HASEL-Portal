import { React } from 'react';
import dayjs from 'dayjs';
import { Icon } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from './Profile.module.scss';
import TitleAndValue from '../../components/text/TitleAndValue';
import StyledHeader from '../../components/text/StyledHeader';
import { getDisplayName, isAdmin, userIsSuperAdmin } from '../../../config/accountTypes';
import UserTypeDropdown from '../../components/TextField/UserTypeDropdown';
import { StyledButton } from '../../components/buttons/StyledButton';

const UserDetails = ({ user, adminView, updateType }) => {
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
                {adminView ? (
                    <UserTypeDropdown adminView initialValue={user.type} setValue={updateType} />
                ) : (
                    <TitleAndValue title='Account Type' value={getDisplayName(user.type)} />
                )}
                <TitleAndValue
                    title='Account Creation Date'
                    value={dayjs(creationDate).format('dddd DD/MM/YYYY')}
                />
                <div className={styles.spacer} />
            </div>
            {!isAdmin(user?.type) && (
                <>
                    <div className={styles.workstationHeader}>
                        <div className={styles.header}>
                            <StyledHeader left sub>
                                Workstation Request
                            </StyledHeader>
                        </div>
                        {/* Only display view request button to super admins */}
                        {user.currentRequestId && userIsSuperAdmin() && (
                            <Link to={`/requests/${user.currentRequestId._id}`}>
                                <StyledButton icon={<Icon>link</Icon>}>View Request</StyledButton>
                            </Link>
                        )}
                    </div>
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
