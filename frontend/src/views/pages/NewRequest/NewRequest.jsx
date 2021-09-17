import { React, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import styles from './NewRequest.module.scss';
import { StyledButton } from '../../components/buttons/StyledButton';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import TextField from '../../components/TextField/CustomTextField';
import selectMenuProps from '../../../assets/selectMenuProps';
import { useCrud } from '../../../hooks/useCrud';
import { supervisorNeeded } from '../../../config/accountTypes';
import { saveRequest } from './util/saveRequest';

const NewRequest = () => {
    const workstations = useCrud('/api/workstation').data ?? [];
    const [supervisor, setSupervisor] = useState('');
    const [comments, setComments] = useState('');
    const [workstation, setWorkstation] = useState(null);

    const showSupervisor = supervisorNeeded();

    const handleSubmit = async (event) => {
        event.preventDefault();
        saveRequest(supervisor, workstation, comments);
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

                    <TextField
                        title='Workstation (may be overridden)'
                        select
                        defaultValue=''
                        SelectProps={{ MenuProps: selectMenuProps }}
                        onChange={(e) => setWorkstation(e.target.value)}
                    >
                        {workstations.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <div className={styles.buttonContainer}>
                        <StyledButton type='submit'>Request Access</StyledButton>
                    </div>
                </form>
            </div>
        </TopBarPageTemplate>
    );
};

export default NewRequest;
