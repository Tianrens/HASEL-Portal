import { React, useState } from 'react';
import styles from './NewRequest.module.scss';
import { StyledButton } from '../../components/buttons/StyledButton';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import TextField from '../../components/TextField/CustomTextField';
import { supervisorNeeded } from '../../../config/accountTypes';
import { postUtil } from '../../../util/apiUtil';
import { fetchUser } from '../../../state/docs/userDoc';
import WorkstationDropdown from '../../components/TextField/WorkstationDropdown';

const NewRequest = () => {
    const [supervisor, setSupervisor] = useState('');
    const [comments, setComments] = useState('');
    const [workstation, setWorkstation] = useState(null);

    const showSupervisor = supervisorNeeded();
    const headerText = "You'll need approval to access a workstation.";

    const handleSubmit = async (event) => {
        event.preventDefault();
        postUtil(
            'request',
            {
                allocatedWorkstationId: workstation,
                supervisorName: supervisor,
                comments,
            },
            async () => fetchUser(),
        )();
    };

    return (
        <TopBarPageTemplate>
            <h1 className={styles.header}>{headerText}</h1>
            <div className={styles.container}>
                <form autoComplete='off' className={styles.form} onSubmit={handleSubmit}>
                    {showSupervisor && (
                        <>
                            <TextField title='Supervisor Name' setValue={setSupervisor} />
                        </>
                    )}

                    <TextField
                        title='Reasoning/Comments'
                        notRequired
                        setValue={setComments}
                        multiline
                        rows={4}
                    />

                    <WorkstationDropdown setValue={setWorkstation} />

                    <div className={styles.buttonContainer}>
                        <StyledButton type='submit'>Request Access</StyledButton>
                    </div>
                </form>
            </div>
        </TopBarPageTemplate>
    );
};

export default NewRequest;
