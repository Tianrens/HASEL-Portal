import { React, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import styles from './NewRequest.module.scss';
import { StyledButton } from '../../components/buttons/StyledButton';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import selectMenuProps from '../../../assets/selectMenuProps';
import { authRequest } from '../../../hooks/util/authRequest';
import { useCrud } from '../../../hooks/useCrud';

const NewRequest = () => {
    const history = useHistory();

    const [supervisor, setSupervisor] = useState('');
    const [reason, setReason] = useState('');
    const [workstation, setWorkstation] = useState(null);

    const workstations = useCrud('/api/resource').data;
    const showSupervisor = false;
    
    const handleSubmit = () => {
        authRequest('/api/request', 'POST', {
            allocatedResourceId: workstation,
            supervisorName: supervisor,
            comments: reason
        });
        history.push('/pending');
    };

    return (
        <TopBarPageTemplate>
            <div className={styles.container}>
                <h1 className={styles.header}>
                    You&apos;ll need approval to access a workstation.
                </h1>
                <form autoComplete='off' className={styles.form} onSubmit={handleSubmit}>
                    {showSupervisor && (
                        <>
                            <p className={styles.inputTitles}>Supervisor name</p>
                            <TextField
                                required
                                fullWidth
                                variant='outlined'
                                onChange={(e) => setSupervisor(e.target.value)}
                            />
                        </>
                    )}

                    <p className={styles.inputTitles}>Reasoning/Comments (optional)</p>
                    <TextField
                        variant='outlined'
                        fullWidth
                        multiline
                        rows={4}
                        onChange={(e) => setReason(e.target.value)}
                    />

                    <p className={styles.inputTitles}>Workstation (may be overridden)</p>
                    <Select
                        required
                        defaultValue=''
                        fullWidth
                        variant='outlined'
                        MenuProps={selectMenuProps}
                        onChange={(e) => setWorkstation(e.target.value)}
                    >
                        {workstations && workstations.map((option) => (
                            <MenuItem key={option.name} value={option}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <div className={styles.buttonContainer}>
                        <StyledButton className={styles.button} type='submit'>
                            Request Access
                        </StyledButton>
                    </div>
                </form>
            </div>
        </TopBarPageTemplate>
    );
};

export default NewRequest;
