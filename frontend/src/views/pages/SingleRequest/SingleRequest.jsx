import { React, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import styles from './SingleRequest.module.scss';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import TextField from '../../components/TextField/CustomTextField';
import { useCrud } from '../../../hooks/useCrud';
import selectMenuProps from '../../../assets/selectMenuProps';
import TitleAndValue from '../../components/text/TitleAndValue';
import { getDisplayName, getValidityPeriod } from '../../../config/accountTypes';
import { authRequestLogError } from '../../../hooks/util/authRequest';
import BottomButtons from '../../components/buttons/BottomButtons';
import { successSnackbar } from '../../../util/SnackbarUtil';

const SingleRequest = () => {
    const history = useHistory();
    const actionCallback = (message) => {
        successSnackbar(message);
        history.goBack();
    };

    const [workstation, setWorkstation] = useState();
    const [validityPeriod, setValidityPeriod] = useState(0);
    const [validUntil, setValidUntil] = useState(null);

    const { requestId } = useParams();
    const requestCallback = (data) => {
        setWorkstation(data.allocatedWorkstationId);
        setValidityPeriod(getValidityPeriod(data.userId.type));
    };
    const request = useCrud(
        `/api/request/${requestId}`,
        undefined,
        undefined,
        requestCallback,
    ).data;
    const workstations = useCrud('/api/workstation').data;

    const onAccept = async () => {
        await authRequestLogError(`/api/request/${requestId}`, 'PATCH', {
            status: 'ACTIVE',
            requestValidity: validityPeriod,
            allocatedWorkstationId: workstation,
        });
        actionCallback('Accepted Request');
    };

    const onDeny = async () => {
        await authRequestLogError(`/api/request/${requestId}`, 'PATCH', {
            status: 'DECLINED',
            requestValidity: validityPeriod,
            allocatedWorkstationId: workstation,
        });
        actionCallback('Denied Request');
    };

    const onDelete = async () => {
        await authRequestLogError(`/api/request/${requestId}`, 'DELETE');
        actionCallback('Deleted Request');
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
            {workstations && workstation && request && (
                <>
                    <h2 className={styles.header}>Workstation Access Request</h2>
                    <div className={styles.userInfoContainer}>
                        <TitleAndValue
                            title='Name'
                            value={`${request?.userId.firstName} ${request?.userId.lastName}`}
                        />
                        <TitleAndValue
                            title='Account Type'
                            value={getDisplayName(request?.userId.type)}
                        />
                        <TitleAndValue
                            title='Application Received'
                            value={dayjs(request?.createdAt).format('DD/MM/YYYY')}
                        />
                    </div>
                    <Divider className={styles.divider} />
                    <div className={styles.requestDetailsContainer}>
                        <div className={styles.details}>
                            <TitleAndValue
                                title='Supervisor Name'
                                value={request?.supervisorName}
                            />
                            <TitleAndValue title='Comments' value={request?.comments} />
                        </div>
                        <div className={styles.details}>
                            <TextField
                                title='Workstation'
                                select
                                defaultValue={workstation}
                                SelectProps={{ MenuProps: selectMenuProps }}
                                setValue={setWorkstation}
                            >
                                {workstations.map((option) => (
                                    <MenuItem key={option._id} value={option._id}>
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
                    <BottomButtons onAccept={onAccept} onDeny={onDeny} onDelete={onDelete} />
                </>
            )}
        </TopBarPageTemplate>
    );
};

export default SingleRequest;
