import { React, useState } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import styles from './NewBooking.module.scss';
import { StyledButton } from '../../components/buttons/StyledButton';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import TextField from '../../components/TextField/CustomTextField';

const NewRequest = () => {
    const userWorkstation = 'ZEUS'; // TODO - Get from User Info
    const numGPUs = 3; // TODO - Get from Resource Info
    const GPUList = Array.from(Array(numGPUs).keys());

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedGPUs, setGPUs] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
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
                    <TextField label='Start Date' type='date' setValue={setStartDate} />
                    <TextField label='Start Time' type='time' setValue={setStartTime} />
                </div>
                <div className={styles.inputContainer}>
                    <TextField label='End Date' type='date' setValue={setEndDate} />
                    <TextField label='End Time' type='time' setValue={setEndTime} />
                </div>
                <div className={styles.inputContainer}>
                    <FormControl>
                        <FormLabel>Select GPUs</FormLabel>
                    </FormControl>
                    <FormGroup row>
                        {GPUList.map((GPU) => (
                            <FormControlLabel
                                control={<Checkbox onChange={() => handleSelect(GPU)} />}
                                label={`GPU ${GPU}`}
                                key={GPU}
                            />
                        ))}
                    </FormGroup>
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
