import { React, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Divider from '@mui/material/Divider';
import styles from './SingleRequest.module.scss';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import TextField from '../../components/TextField/CustomTextField';
import { useCrud } from '../../../hooks/useCrud';
import TitleAndValue from '../../components/text/TitleAndValue';
import { getDisplayName, getValidityPeriod } from '../../../config/accountTypes';
import BottomButtons from '../../components/buttons/BottomButtons';
import { patchUtil, deleteUtil } from '../../../util/apiUtil';
import {
    acceptRequestMessage,
    denyRequestMessage,
    deleteRequestMessage,
} from '../../../config/ModalMessages';
import WorkstationDropdown from '../../components/TextField/WorkstationDropdown';

const SingleRequest = () => {
    const history = useHistory();

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
            {workstation && request && (
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
                            <WorkstationDropdown
                                currentWorkstation={workstation}
                                setValue={setWorkstation}
                            />
                            <TextField
                                title='Validity Period (months)'
                                value={validityPeriod}
                                helperText={validUntil}
                                setValue={handleValidity}
                            />
                        </div>
                    </div>
                    <Divider className={styles.divider} />
                    <BottomButtons
                        onAccept={patchUtil(
                            'request',
                            {
                                status: 'ACTIVE',
                                requestValidity: validityPeriod,
                                allocatedWorkstationId: workstation,
                            },
                            requestId,
                            () => history.goBack(),
                        )}
                        onDeny={patchUtil(
                            'request',
                            {
                                status: 'DECLINED',
                                requestValidity: validityPeriod,
                                allocatedWorkstationId: workstation,
                            },
                            requestId,
                            () => history.goBack(),
                        )}
                        onDelete={deleteUtil('request', requestId, () => history.goBack())}
                        deleteMessage={deleteRequestMessage}
                        denyMessage={denyRequestMessage}
                        acceptMessage={acceptRequestMessage}
                    />
                </>
            )}
        </TopBarPageTemplate>
    );
};

export default SingleRequest;
