import { React, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import styles from './SignupPage.module.scss';
import { StyledButton } from '../../components/buttons/StyledButton';
import StyledHeader from '../../components/text/StyledHeader';
import HeroPageTemplate from '../../components/templates/HeroPageTemplate/HeroPageTemplate';
import selectMenuProps from '../../../assets/selectMenuProps';
import { auth } from '../../../firebase';
import accountTypes from './accountTypes';
import { signUpUser } from '../../../state/docs/userDoc';

const SignupPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [upi, setUpi] = useState('');
    const [accountType, setAccountType] = useState('');

    const uoaEmail = auth?.currentUser?.email ?? 'Unknown email, please contact Admin';

    const handleSubmit = async (event) => {
        event.preventDefault();
        await signUpUser(firstName, lastName, upi, accountType.toUpperCase());
    };

    return (
        <HeroPageTemplate>
            <div className={styles.content}>
                <h1 className={styles.header}>Finish setting up your HASEL lab account.</h1>
                <div className={styles.accountDetailsContainer}>
                    <StyledHeader bold left>
                        Account Details
                    </StyledHeader>
                    <p className={styles.inputTitle}>UoA Email</p>
                    <p className={styles.uoaEmail}>{uoaEmail}</p>
                </div>

                <div>
                    <StyledHeader left>Personal Information</StyledHeader>
                    <form autoComplete='off' onSubmit={handleSubmit}>
                        <div className={styles.nameContainer}>
                            <div className={styles.nameInput}>
                                <p className={styles.inputTitle}>First Name</p>
                                <TextField
                                    required
                                    variant='outlined'
                                    fullWidth
                                    placeholder='--'
                                    className={styles.inputField}
                                    defaultValue=''
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className={styles.nameInput}>
                                <p className={styles.inputTitle}>Last Name</p>
                                <TextField
                                    required
                                    variant='outlined'
                                    fullWidth
                                    placeholder='--'
                                    className={styles.inputField}
                                    defaultValue=''
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        <p className={styles.inputTitle}>UPI</p>
                        <TextField
                            required
                            variant='outlined'
                            fullWidth
                            placeholder='e.g. abur970'
                            className={styles.inputField}
                            defaultValue=''
                            onChange={(e) => setUpi(e.target.value)}
                        />

                        <p className={styles.inputTitle}>Account Type</p>
                        <Select
                            required
                            fullWidth
                            variant='outlined'
                            defaultValue=''
                            MenuProps={selectMenuProps}
                            className={styles.inputField}
                            onChange={(e) => setAccountType(e.target.value)}
                        >
                            {accountTypes.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                        <div className={styles.buttonContainer}>
                            <StyledButton className={styles.button} type='submit'>
                                Submit
                            </StyledButton>
                        </div>
                    </form>
                </div>
            </div>
        </HeroPageTemplate>
    );
};

export default SignupPage;
