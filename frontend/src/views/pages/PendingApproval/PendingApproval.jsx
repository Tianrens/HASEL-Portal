import { React, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { container, header, title, value } from './PendingApproval.module.scss';
import StyledHeader from '../../components/text/StyledHeader';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import { getRequest } from './util/getRequest';

const PendingApproval = () => {
    const [supervisor, setSupervisor] = useState('--');
    const [workstation, setWorkstation] = useState('--');
    const [comments, setComments] = useState('');

    useEffect(() => {
        async function getAndSetValues() {
            const request = await getRequest();
    
            setComments(request.comments ?? '');
            setSupervisor(request.supervisorName ?? '--');
            setWorkstation(request.workstation?.name ?? '--');
        };
        getAndSetValues();
    }, []);

    return (
        <TopBarPageTemplate>
            <div className={container}>
                <h1 className={header}>Sit tight, your account is awaiting approval.</h1>
                <StyledHeader>Your Application</StyledHeader>
                <h3 className={value}>
                    <span className={title}>Supervisor Name: </span>
                    {supervisor}
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
                    {workstation}
                </h3>
            </div>
        </TopBarPageTemplate>
    );
};

export default PendingApproval;
