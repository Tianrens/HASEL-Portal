import { React, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Divider from '@mui/material/Divider';
import DatePicker from '@mui/lab/DatePicker';
import styles from './SingleRequest.module.scss';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import TextField from '../../components/TextField/CustomTextField';
import TitleAndValue from '../../components/text/TitleAndValue';
import { getDisplayName, getValidityPeriod } from '../../../config/accountTypes';
import BottomButtons from '../../components/buttons/BottomButtons';
import { deleteUtil, patchUtil } from '../../../util/apiUtil';
import {
    acceptRequestMessage,
    deleteRequestMessage,
    denyRequestMessage,
    editRequestMessage,
} from '../../../config/ModalMessages';
import WorkstationDropdown from '../../components/TextField/WorkstationDropdown';
import { useGet } from '../../../hooks/useGet';
import LoadingWheelDiv from '../../components/LoadingWheel/LoadingWheelDiv';
import StyledHeader from '../../components/text/StyledHeader';

const SingleRequest = () => {
    const history = useHistory();

    const [workstation, setWorkstation] = useState();
    const [endDate, setEndDate] = useState(dayjs());
    const error = endDate.isBefore(dayjs());

    const { requestId } = useParams();
    const requestCallback = (data) => {
        setWorkstation(data.allocatedWorkstationId);
        const newValidTill = dayjs().add(getValidityPeriod(data.userId.type), 'month');
        setEndDate(data.endDate ? dayjs(data.endDate) : newValidTill);
    };
    const request = useGet(`/api/request/${requestId}`, true, requestCallback).data;

    const handleClick = () => {
        if (history.length > 1) {
            history.goBack();
        } else {
            history.push('/requests');
        }
    };

    return (
        <TopBarPageTemplate>
            {!workstation || !request ? (
                <LoadingWheelDiv />
            ) : (
                <>
                    <StyledHeader left back>
                        Workstation Access Request
                    </StyledHeader>
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
                                disabled={request.status === 'DECLINED'}
                            />
                            <DatePicker
                                inputFormat='DD/MM/YYYY'
                                value={endDate}
                                onChange={setEndDate}
                                minDate={dayjs()}
                                renderInput={(params) => (
                                    <TextField title='Request Expiry Date' {...params} />
                                )}
                                disabled={request.status === 'DECLINED'}
                            />
                        </div>
                    </div>
                    <Divider className={styles.divider} />
                    <BottomButtons
                        onAccept={
                            (request.status === 'PENDING' || request.status === 'ACTIVE') &&
                            patchUtil(
                                'request',
                                {
                                    status: 'ACTIVE',
                                    allocatedWorkstationId: workstation,
                                    endDate,
                                },
                                requestId,
                                () => handleClick(),
                            )
                        }
                        onDeny={
                            request.status === 'PENDING' &&
                            patchUtil(
                                'request',
                                {
                                    status: 'DECLINED',
                                    allocatedWorkstationId: workstation,
                                    endDate,
                                },
                                requestId,
                                () => handleClick(),
                            )
                        }
                        onDelete={deleteUtil('request', requestId, () => handleClick())}
                        deleteMessage={deleteRequestMessage}
                        denyMessage={denyRequestMessage}
                        acceptMessage={
                            request.status === 'PENDING' ? acceptRequestMessage : editRequestMessage
                        }
                        acceptText={request.status === 'PENDING' ? 'Accept' : 'Confirm'}
                        acceptDisabled={error}
                    />
                </>
            )}
        </TopBarPageTemplate>
    );
};

export default SingleRequest;
