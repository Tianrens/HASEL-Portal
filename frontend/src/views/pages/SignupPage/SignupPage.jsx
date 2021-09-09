import { React, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import styles from './SignupPage.module.scss';
import { StyledButton } from '../../components/buttons/StyledButton';
import TextField from '../../components/TextField/CustomTextField';
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
                    <StyledHeader left>Account Details</StyledHeader>
                    <p className={styles.inputTitle}>UoA Email</p>
                    <p className={styles.uoaEmail}>{uoaEmail}</p>
                </div>

                <div>
                    <StyledHeader left>Personal Information</StyledHeader>
                    <form className={styles.form} autoComplete='off' onSubmit={handleSubmit}>
                        <div className={styles.nameContainer}>
                            <TextField
                                title='First Name'
                                placeholder='--'
                                className={styles.inputField}
                                defaultValue=''
                                setValue={setFirstName}
                            />
                            <TextField
                                title='Last Name'
                                placeholder='--'
                                className={styles.inputField}
                                defaultValue=''
                                setValue={setLastName}
                            />
                        </div>

                        <TextField
                            title='UPI'
                            placeholder='e.g. abur970'
                            className={styles.inputField}
                            defaultValue=''
                            setValue={setUpi}
                        />

                        <TextField
                            title='Account Type'
                            select
                            defaultValue=''
                            SelectProps={{ MenuProps: selectMenuProps }}
                            className={styles.inputField}
                            setValue={setAccountType}
                        >
                            {accountTypes.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>

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
