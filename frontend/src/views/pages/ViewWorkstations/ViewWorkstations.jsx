import { Icon } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { StyledButton } from '../../components/buttons/StyledButton';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import styles from './ViewWorkstations.module.scss';

const ViewWorkstations = () => (
    <TopBarPageTemplate>
        <div className={styles.container}>
            <div className={styles.workstationHeader}>
                <div className={styles.header}>
                    <StyledHeader left>Workstation Overview</StyledHeader>
                </div>
                <StyledButton component={Link} icon={<Icon>add</Icon>} to='/new-workstation'>
                    Add Workstation
                </StyledButton>
            </div>
            <div className={styles.workstationPlaceholder}>WORKSTATION PLACEHOLDER</div>
            <div className={styles.workstationPlaceholder}>WORKSTATION PLACEHOLDER</div>
        </div>
    </TopBarPageTemplate>
);
export default ViewWorkstations;
