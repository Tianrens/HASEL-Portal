import { React, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import { authRequest } from '../../../hooks/util/authRequest';
import WorkstationForm from '../../components/forms/WorkstationForm';
import StyledHeader from '../../components/text/StyledHeader';
import BottomButtons from '../../components/buttons/BottomButtons';

const NewWorkstation = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();

    const [error, setError] = useState(true);
    const [workstationState, setWorkstationState] = useState({});

    const updateState = (newState, isError) => {
        setError(isError);
        setWorkstationState(newState);
    };

    const successCallback = (message) => {
        enqueueSnackbar(message, {
            variant: 'success',
            autoHideDuration: 3000,
            onClose: closeSnackbar,
        });
        history.goBack();
    };

    const errorCallback = (message) => {
        enqueueSnackbar(message, {
            variant: 'error',
            autoHideDuration: 3000,
            onClose: closeSnackbar,
        });
    };

    const submitHandler = async () => {
        try {
            await authRequest('/api/workstation/', 'POST', workstationState);
            successCallback('Workstation created');
        } catch (err) {
            errorCallback(err.message);
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
