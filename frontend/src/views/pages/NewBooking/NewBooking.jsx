import { React, useState } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import styles from './NewBooking.module.scss';
import { StyledButton } from '../../components/buttons/StyledButton';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import TextField from '../../components/TextField/CustomTextField';

const NewRequest = () => {
    const userWorkstation = 'ZEUS'; // TODO - Get from User Info
    const numGPUs = 3; // TODO - Get from Workstation Info
    const GPUList = Array.from(Array(numGPUs).keys());

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedGPUs, setGPUs] = useState([]);
    const [noGPUSelected, setNoGPUSelected] = useState(true);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (noGPUSelected) {
            return;
        }

        // TODO: Connect to Backend
        console.log(startDate, endDate, startTime, endTime, selectedGPUs);
    };

    const handleSelect = (GPU) => {
        const tempArray = selectedGPUs;
        if (!tempArray.includes(GPU)) {
            tempArray.push(GPU);
        } else {
            tempArray.splice(tempArray.indexOf(GPU), 1);
        }
        setGPUs(tempArray);
        setNoGPUSelected(tempArray.length === 0);
    };

    return (
        <TopBarPageTemplate>
            <h2 className={styles.header}>Create Booking - {userWorkstation}</h2>
            <form
                id='booking-form'
                autoComplete='off'
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <div className={styles.inputContainer}>
                    <TextField title='Start Date' type='date' setValue={setStartDate} />
                    <TextField title='Start Time' type='time' setValue={setStartTime} />
                </div>
                <div className={styles.inputContainer}>
                    <TextField title='End Date' type='date' setValue={setEndDate} />
                    <TextField title='End Time' type='time' setValue={setEndTime} />
                </div>
                <div className={styles.inputContainer}>
                    <FormControl required error={noGPUSelected}>
                        <FormLabel>Select GPUs</FormLabel>
                        <FormGroup row>
                            {GPUList.map((GPU) => (
                                <FormControlLabel
                                    control={<Checkbox onChange={() => handleSelect(GPU)} />}
                                    label={`GPU ${GPU}`}
                                    key={GPU}
                                />
                            ))}
                        </FormGroup>
                        {noGPUSelected && <FormHelperText>Select atleast 1 GPU</FormHelperText>}
                    </FormControl>
                </div>
            </form>
            <Divider className={styles.divider} />
            <div className={styles.chartContainer}>CHART PLACEHOLDER</div>
            <Divider className={styles.divider} />
            <div className={styles.buttonContainer}>
                <StyledButton
                    className={styles.button}
                    color='green'
                    icon={<Icon>done</Icon>}
                    type='submit'
                    form='booking-form'
                >
                    Confirm
                </StyledButton>
            </div>
        </TopBarPageTemplate>
    );
};

export default NewRequest;
