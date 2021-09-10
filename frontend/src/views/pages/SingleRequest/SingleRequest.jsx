import { React, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import styles from './SingleRequest.module.scss';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import TextField from '../../components/TextField/CustomTextField';
import BottomButtons from './BottomButtons';
import { useCrud } from '../../../hooks/useCrud';
import selectMenuProps from '../../../assets/selectMenuProps';
import TitleAndValue from '../../components/text/TitleAndValue';

const SingleRequest = () => {
    // TO DO: Get details from request
    const userName = 'Aiden Burgess';
    const accountType = 'Staff';
    const receivedDate = '16/08/21';
    const supervisorName = 'Emmanuel Baguia';
    const reason =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    const [workstation, setWorkstation] = useState({
        name: 'Athena',
    });
    const [validityPeriod, setValidityPeriod] = useState(6);

    const workstations = useCrud('/api/resource').data;

    const [validUntil, setValidUntil] = useState(null);

    const handleSubmit = () => {
        // TODO: Connect to Backend
        console.log(workstation);
    };

    const handleDelete = () => {
        // TODO: Connect to Backend
        console.log(workstation);
    };

    const handleValidity = (input) => {
        const temp = input.replace(/\D/g, '');
        setValidityPeriod(temp);
    };

    useEffect(() => {
        const newDate = dayjs().add(validityPeriod, 'month').format('DD/MM/YYYY');
        setValidUntil(`Account will be valid until ${newDate}`);
    }, [validityPeriod]);

    return (
        <TopBarPageTemplate>
            {workstations && workstation && (
                <>
                    <h2 className={styles.header}>Workstation Access Request</h2>
                    <div className={styles.userInfoContainer}>
                        <TitleAndValue title='Name' value={userName} />
                        <TitleAndValue title='Account Type' value={accountType} />
                        <TitleAndValue title='Application Received' value={receivedDate} />
                    </div>
                    <Divider className={styles.divider} />
                    <div className={styles.requestDetailsContainer}>
                        <div className={styles.details}>
                            <TitleAndValue title='Supervisor Name' value={supervisorName} />
                            <TitleAndValue title='Comments' value={reason} />
                        </div>
                        <div className={styles.details}>
                            <TextField
                                title='Workstation'
                                select
                                defaultValue={
                                    workstations[
                                        workstations.findIndex((e) => e.name === workstation.name)
                                    ]
                                }
                                SelectProps={{ MenuProps: selectMenuProps }}
                                setValue={setWorkstation}
                            >
                                {workstations.map((option) => (
                                    <MenuItem key={option.name} value={option}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                title='Validity Period (months)'
                                value={validityPeriod}
                                helperText={validUntil}
                                setValue={handleValidity}
                            />
                        </div>
                    </div>
                    <Divider className={styles.divider} />
                    <BottomButtons deleteHandler={handleDelete} submitHandler={handleSubmit} />
                </>
            )}
        </TopBarPageTemplate>
    );
};

export default SingleRequest;
