import { React, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import styles from './NewRequest.module.scss';
import { StyledButton } from '../../components/buttons/StyledButton';

const NewRequest = () => {
    const [supervisor, setSupervisor] = useState('');
    const [reason, setReason] = useState('');
    const [workstation, setWorkstation] = useState('');

    const workstationNames = ['Zeus', 'Apollo', 'Athena'];

    const showSupervisor = false;

    const handleSubmit = (event) => {
        event.preventDefault();
        // send email
        // call API
        console.log(supervisor, reason, workstation);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>You&apos;ll need approval to access a workstation.</h1>
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
                    MenuProps={{
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                        },
                        getContentAnchorEl: null,
                    }}
                    onChange={(e) => setWorkstation(e.target.value)}
                >
                    {workstationNames.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
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
    );
};

export default NewRequest;
