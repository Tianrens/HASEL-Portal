import { React } from 'react';
import TextField from '@material-ui/core/TextField';
import { container, header, reasonField, title, value } from './PendingApproval.module.scss';
import StyledHeader from '../../components/text/StyledHeader';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';

const PendingApproval = () => {
    const supervisor = 'Emmanuel Baguia';
    const reason =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    const workstation = 'ZEUS';

    return (
        <TopBarPageTemplate>
            <div className={container}>
                <h1 className={header}>Sit tight, your account is awaiting approval.</h1>
                <StyledHeader>Your Application</StyledHeader>
                <h3 className={value}>
                    <span className={title}>Supervisor Name: </span>
                    {supervisor}
                </h3>
                <h3 className={title}>Reason:</h3>
                <TextField
                    defaultValue={reason}
                    multiline
                    rows={5}
                    InputProps={{
                        readOnly: true,
                        style: { fontSize: '1.17rem', lineHeight: '1.8rem' },
                    }}
                    variant='outlined'
                    className={reasonField}
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
