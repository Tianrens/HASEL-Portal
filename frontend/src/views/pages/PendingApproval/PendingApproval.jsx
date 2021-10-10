import React from 'react';
import TextField from '@mui/material/TextField';
import { container, header, title, value, wrapper } from './PendingApproval.module.scss';
import StyledHeader from '../../components/text/StyledHeader';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import { useDoc } from '../../../state/state';
import { userDoc } from '../../../state/docs/userDoc';

const PendingApproval = () => {
    const [user] = useDoc(userDoc);
    const request = user.currentRequestId;

    const supervisorName = request?.supervisorName ?? '--';
    const comments = request?.comments ?? '--';
    const workstationName = request?.allocatedWorkstationId?.name ?? '--';

    return (
        <TopBarPageTemplate>
            <div className={wrapper}>
                <div className={container}>
                    <h1 className={header}>Sit tight, your account is awaiting approval.</h1>
                    <StyledHeader>Your Application</StyledHeader>
                    <h3 className={value}>
                        <span className={title}>Supervisor Name: </span>
                        {supervisorName}
                    </h3>
                    <h3 className={title}>Reasoning/Comments:</h3>
                    <TextField
                        value={comments}
                        multiline
                        rows={5}
                        InputProps={{
                            readOnly: true,
                            style: { fontSize: '1.17rem', lineHeight: '1.8rem' },
                        }}
                        variant='outlined'
                    />
                    <h3 className={value}>
                        <span className={title}>Workstation Requested: </span>
                        {workstationName}
                    </h3>
                </div>
            </div>
        </TopBarPageTemplate>
    );
};

export default PendingApproval;
