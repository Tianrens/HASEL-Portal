import { React, useState } from 'react';
import styles from './SignupPage.module.scss';
import { StyledButton } from '../../components/buttons/StyledButton';
import TextField from '../../components/TextField/CustomTextField';
import StyledHeader from '../../components/text/StyledHeader';
import HeroPageTemplate from '../../components/templates/HeroPageTemplate/HeroPageTemplate';
import { auth } from '../../../firebase';
import { signUpUser } from '../../../state/docs/userDoc';
import UserTypeDropdown from '../../components/TextField/UserTypeDropdown';

const SignupPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [upi, setUpi] = useState('');
    const [accountType, setAccountType] = useState('');

    const uoaEmail = auth?.currentUser?.email ?? 'Unknown email, please contact Admin';

    const handleSubmit = async (event) => {
        event.preventDefault();
        await signUpUser(firstName, lastName, upi, accountType);
    };

    return (
        <HeroPageTemplate>
            <div className={styles.content}>
                <h1 className={styles.header}>Finish setting up your HASEL Portal account.</h1>
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

                        <UserTypeDropdown
                            className={styles.inputField}
                            required
                            setValue={setAccountType}
                        />

                        <div className={styles.buttonContainer}>
                            <StyledButton type='submit'>Submit</StyledButton>
                        </div>
                    </form>
                </div>
            </div>
        </HeroPageTemplate>
    );
};

export default SignupPage;
