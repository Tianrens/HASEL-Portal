import { Icon } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { StyledButton } from '../../components/buttons/StyledButton';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import styles from './ViewWorkstations.module.scss';
import AdminWorkstationInfoPanel from '../../components/workstationInfoPanel/AdminWorkstationInfoPanel';
import { useGet } from '../../../hooks/useGet';
import LoadingWheelDiv from '../../components/LoadingWheel/LoadingWheelDiv';

export default function ViewWorkstations() {
    const workstations = useGet('/api/workstation').data;

    return (
        <TopBarPageTemplate>
            <div className={styles.workstationHeader}>
                <div className={styles.header}>
                    <StyledHeader left>Workstation Overview</StyledHeader>
                </div>
                <StyledButton component={Link} icon={<Icon>add</Icon>} to='/workstations/new'>
                    Add Workstation
                </StyledButton>
            </div>
            {!workstations ? (
                <LoadingWheelDiv />
            ) : (
                workstations.map((workstation) => (
                    <div key={workstation._id} className={styles.workstationInfoWrapper}>
                        <AdminWorkstationInfoPanel workstationData={workstation} />
                    </div>
                ))
            )}
        </TopBarPageTemplate>
    );
}
