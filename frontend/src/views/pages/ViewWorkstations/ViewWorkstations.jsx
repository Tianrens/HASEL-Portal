import { Icon } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StyledButton } from '../../components/buttons/StyledButton';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import styles from './ViewWorkstations.module.scss';
import AdminWorkstationInfoPanel from '../../components/workstationInfoPanel/AdminWorkstationInfoPanel';
import { authRequest } from '../../../hooks/util/authRequest';

export default function ViewWorkstations() {
    const [workstationsData, setWorkstationsData] = useState();

    useEffect(() => {
        const getAndSetValues = async () => {
            const workstationsResponse = await authRequest('/api/workstation');

            setWorkstationsData(workstationsResponse.data);
        };
        getAndSetValues();
    }, []);

    return (
        <TopBarPageTemplate>
            <div className={styles.container}>
                <div className={styles.workstationHeader}>
                    <div className={styles.header}>
                        <StyledHeader left>Workstation Overview</StyledHeader>
                    </div>
                    <StyledButton component={Link} icon={<Icon>add</Icon>} to='/workstations/new'>
                        Add Workstation
                    </StyledButton>
                </div>
                {workstationsData?.map((workstation) => (
                    <div key={workstation._id} className={styles.workstationInfoWrapper}>
                        <AdminWorkstationInfoPanel workstationData={workstation} />
                    </div>
                ))}
            </div>
        </TopBarPageTemplate>
    );
}
