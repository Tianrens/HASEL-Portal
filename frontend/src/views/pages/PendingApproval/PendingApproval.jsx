import React from 'react';
import TextField from '@mui/material/TextField';
import { container, header, title, value, paragraphText } from './PendingApproval.module.scss';
import StyledHeader from '../../components/text/StyledHeader';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import { useDoc } from '../../../state/state';
import { userDoc } from '../../../state/docs/userDoc';
import LoadingWheelDiv from '../../components/LoadingWheel/LoadingWheelDiv';

const PendingApproval = () => {
    const [user] = useDoc(userDoc);
    const request = user.currentRequestId;

    const supervisorName = request?.supervisorName;
    const comments = request?.comments ?? '--';
    const workstationName = request?.allocatedWorkstationId?.name ?? '--';

    return (
        <TopBarPageTemplate>
            {!user || !request ? (
                <LoadingWheelDiv />
            ) : (
                <div className={container}>
                    <h1 className={header}>Sit tight, your application is awaiting approval.</h1>
                    <p className={paragraphText}>You will receive an email once your application has been approved or denied.</p>
                    <StyledHeader>Your Application</StyledHeader>
                    {supervisorName && <h3 className={value}>
                        <span className={title}>Supervisor Name: </span>
                        {supervisorName}
                    </h3>}
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
            )}
        </TopBarPageTemplate>
    );
};

export default PendingApproval;
