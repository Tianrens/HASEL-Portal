import { React, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import WorkstationForm from '../../components/forms/WorkstationForm';
import StyledHeader from '../../components/text/StyledHeader';
import BottomButtons from '../../components/buttons/BottomButtons';
import { onCreate } from '../../../util/editUtil';
import { discardResourceMessage, createWorkstationMessage } from '../../../config/ModalMessages';

const NewWorkstation = () => {
    const history = useHistory();

    const [error, setError] = useState(true);
    const [workstationState, setWorkstationState] = useState({});

    const updateState = (newState, isError) => {
        setError(isError);
        setWorkstationState(newState);
    };

    return (
        <TopBarPageTemplate>
            <StyledHeader left>New Workstation</StyledHeader>
            <WorkstationForm updateState={updateState} />
            <BottomButtons
                onDeny={() => history.goBack()}
                denyText='Cancel'
                onAccept={onCreate('workstation', workstationState, () => history.goBack())}
                acceptDisabled={error}
                acceptText='Submit'
                denyMessage={discardResourceMessage('workstation')}
                acceptMessage={createWorkstationMessage}
            />
        </TopBarPageTemplate>
    );
};

export default NewWorkstation;
