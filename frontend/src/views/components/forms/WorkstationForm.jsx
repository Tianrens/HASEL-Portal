import { React, useEffect, useState } from 'react';
import { Divider } from '@material-ui/core';
import StyledHeader from '../text/StyledHeader';
import CustomTextField from '../TextField/CustomTextField';
import styles from './Form.module.scss';

const WorkstationForm = ({ data, updateState }) => {
    // Can grab data from EDIT jsx and pass it into this form
    const [name, setName] = useState(data?.name);
    const [location, setLocation] = useState(data?.description);
    const [host, setHost] = useState(data?.host);
    const [cpuDescription, setCPU] = useState(data?.cpuDescription);
    const [numGPUs, setNumGPUs] = useState(data?.numGPUs);
    const [gpuDescription, setGPU] = useState(data?.gpuDescription);
    const [ramDescription, setRAM] = useState(data?.ramDescription);

    useEffect(() => {
        updateState(
            {
                name,
                location,
                host,
                cpuDescription,
                numGPUs,
                gpuDescription,
                ramDescription,
            },
            !(
                name &&
                location &&
                host &&
                cpuDescription &&
                numGPUs &&
                gpuDescription &&
                ramDescription
            ),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cpuDescription, gpuDescription, ramDescription, location, host, name, numGPUs]);

    const handleNumGPUs = (input) => {
        const temp = input.replace(/\D/g, '');
        setNumGPUs(temp);
    };

    return (
        <form
            id='workstation-form'
            className={styles.form}
            onSubmit={(event) => {
                event.preventDefault();
            }}
        >
            <div className={styles.inputContainer}>
                <StyledHeader sub>General</StyledHeader>
                <CustomTextField
                    title='Workstation Name'
                    placeholder='e.g. Zeus'
                    value={name}
                    setValue={setName}
                />
                <CustomTextField
                    title='Workstation Location'
                    placeholder='e.g. 405.662'
                    value={location}
                    setValue={setLocation}
                />
                <CustomTextField
                    title='Host Address'
                    placeholder='e.g. 10.123.101.38'
                    value={host}
                    setValue={setHost}
                />
            </div>
            <Divider className={styles.verticalDivider} flexItem orientation='vertical' />
            <div className={styles.inputContainer}>
                <StyledHeader sub>Specifications</StyledHeader>
                <CustomTextField
                    title='CPU Description'
                    placeholder='e.g. AMD Threadripper 3990X (64 Cores)'
                    value={cpuDescription}
                    setValue={setCPU}
                />
                <CustomTextField
                    title='GPU Description'
                    placeholder='e.g. RTX 3090'
                    value={gpuDescription}
                    setValue={setGPU}
                />
                <CustomTextField
                    title='Number of GPUs'
                    placeholder='e.g. 4'
                    value={numGPUs}
                    setValue={handleNumGPUs}
                />
                <CustomTextField
                    title='RAM Description'
                    placeholder='e.g. 256GB'
                    value={ramDescription}
                    setValue={setRAM}
                />
            </div>
        </form>
    );
};

export default WorkstationForm;
