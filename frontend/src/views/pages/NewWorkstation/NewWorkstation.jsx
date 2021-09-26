import { React, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import { authRequest } from '../../../hooks/util/authRequest';
import WorkstationForm from '../../components/forms/WorkstationForm';
import StyledHeader from '../../components/text/StyledHeader';
import BottomButtons from '../../components/buttons/BottomButtons';
import { errorSnackbar, successSnackbar } from '../../../util/SnackbarUtil';

const NewWorkstation = () => {
    const history = useHistory();

    const [error, setError] = useState(true);
    const [workstationState, setWorkstationState] = useState({});

    const updateState = (newState, isError) => {
        setError(isError);
        setWorkstationState(newState);
    };

    const submitHandler = async () => {
        try {
            await authRequest('/api/workstation/', 'POST', workstationState);
            successSnackbar('Workstation created');
            history.goBack();
        } catch (err) {
            errorSnackbar(err.response.data);
        }
    };

    return (
        <TopBarPageTemplate>
            <StyledHeader left>New Workstation</StyledHeader>
            <WorkstationForm updateState={updateState} />
            <BottomButtons
                onDeny={() => history.goBack()}
                denyText='Cancel'
                onAccept={submitHandler}
                acceptDisabled={error}
                acceptText='Submit'
            />
        </TopBarPageTemplate>
    );
};

export default NewWorkstation;
