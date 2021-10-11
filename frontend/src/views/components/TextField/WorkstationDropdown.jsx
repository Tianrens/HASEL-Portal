/* eslint-disable jsx-a11y/click-events-have-key-events */
import { React, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { MenuItem } from '@mui/material';
import selectMenuProps from '../../../assets/selectMenuProps';
import styles from './WorkstationDropdown.module.scss';
import { asterisk, title } from './TextField.module.scss';
import TitleAndValue from '../text/TitleAndValue';
import { useGet } from '../../../hooks/useGet';
import LoadingWheelDiv from '../LoadingWheel/LoadingWheelDiv';

const WorkstationDropdown = ({ currentWorkstation, setValue, children }) => {
    const workstations = useGet('/api/workstation').data;

    const [chosen, setChosen] = useState('');

    useEffect(() => {
        if (currentWorkstation) {
            setChosen(workstations?.find((x) => x._id === currentWorkstation)?.name ?? '');
        }
    }, [currentWorkstation, workstations]);

    return (
        <div className={styles.container}>
            <p className={title}>
                Workstation
                {!currentWorkstation && ' (May be overridden)'}
                <span className={asterisk}> *</span>
            </p>

            <TextField
                select
                defaultValue={chosen}
                value={chosen}
                fullWidth
                required
                variant='outlined'
                SelectProps={{
                    MenuProps: selectMenuProps,
                    renderValue: () => chosen, // without this, the selected text is always whatever is inside MenuItem
                }}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                    setValue(workstations.find((x) => x.name === e.target.value)._id);
                    setChosen(e.target.value);
                }}
            >
                {children}
                {!workstations ? (
                    <LoadingWheelDiv />
                ) : (
                    workstations.map((workstation) => (
                        <MenuItem
                            key={workstation._id}
                            value={workstation.name} // Needs to be set to suppress some warnings
                            className={styles.dropDownItem}
                        >
                            <div className={styles.nameContainer}>
                                <TitleAndValue title='Name' value={workstation.name} />
                            </div>
                            <div className={styles.infoContainer}>
                                <TitleAndValue title='CPU' value={workstation.cpuDescription} />
                                <TitleAndValue title='RAM' value={workstation.ramDescription} />
                                <TitleAndValue
                                    title='GPU'
                                    value={`${workstation.numGPUs}x ${workstation.gpuDescription}`}
                                />
                            </div>
                        </MenuItem>
                    ))
                )}
            </TextField>
        </div>
    );
};
export default WorkstationDropdown;
