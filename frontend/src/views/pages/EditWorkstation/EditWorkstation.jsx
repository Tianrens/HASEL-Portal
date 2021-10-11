import { React, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import BottomButtons from '../../components/buttons/BottomButtons';
import WorkstationForm from '../../components/forms/WorkstationForm';
import { deleteUtil, putUtil } from '../../../util/apiUtil';
import {
    deleteMessage,
    discardResourceMessage,
    editResourceMessage,
} from '../../../config/ModalMessages';
import { useGet } from '../../../hooks/useGet';
import LoadingWheelDiv from '../../components/LoadingWheel/LoadingWheelDiv';
import styles from './EditWorkstation.module.scss';

const EditWorkstation = () => {
    const history = useHistory();
    const { workstationId } = useParams();

    const [error, setError] = useState(true);
    const workstation = useGet(`/api/workstation/${workstationId}`).data;
    const [workstationState, setWorkstationState] = useState({});

    const updateState = (newState, isError) => {
        setError(isError);
        setWorkstationState(newState);
    };

    return (
        <TopBarPageTemplate>
            <StyledHeader left>Edit Workstation</StyledHeader>

            {!workstation ? (
                <LoadingWheelDiv />
            ) : (
                <div className={styles.fadeInAnimation}>
                    <WorkstationForm data={workstation} updateState={updateState} />
                    <BottomButtons
                        onDelete={deleteUtil('workstation', workstationId, () => history.goBack())}
                        onDeny={() => history.goBack()}
                        denyText='Cancel'
                        onAccept={putUtil('workstation', workstationState, workstationId, () =>
                            history.goBack(),
                        )}
                        acceptDisabled={error}
                        acceptText='Confirm Changes'
                        deleteMessage={deleteMessage('workstation')}
                        denyMessage={discardResourceMessage('workstation')}
                        acceptMessage={editResourceMessage('workstation')}
                    />
                </div>
            )}
        </TopBarPageTemplate>
    );
};

export default EditWorkstation;
