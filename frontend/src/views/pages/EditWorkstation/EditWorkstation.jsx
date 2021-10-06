import { React, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import BottomButtons from '../../components/buttons/BottomButtons';
import { authRequest } from '../../../hooks/util/authRequest';
import WorkstationForm from '../../components/forms/WorkstationForm';
import { putUtil, deleteUtil } from '../../../util/apiUtil';
import {
    editResourceMessage,
    discardResourceMessage,
    deleteMessage,
} from '../../../config/ModalMessages';

const EditWorkstation = () => {
    const history = useHistory();
    const { workstationId } = useParams();

    const [error, setError] = useState(true);
    const [workstation, setWorkstation] = useState(null);
    const [workstationState, setWorkstationState] = useState({});

    const updateState = (newState, isError) => {
        setError(isError);
        setWorkstationState(newState);
    };

    useEffect(() => {
        const getAndSetValues = async () => {
            const workstationResponse = await authRequest(
                `/api/workstation/${workstationId}`,
                'GET',
            );
            setWorkstation(workstationResponse.data);
        };
        getAndSetValues();
    }, [workstationId]);

    return (
        <TopBarPageTemplate>
            <StyledHeader left>Edit Workstation</StyledHeader>
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
        </TopBarPageTemplate>
    );
};

export default EditWorkstation;
