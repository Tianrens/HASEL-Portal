import { React, useState } from 'react';
import { Divider } from '@mui/material';
import styles from './HelpPage.module.scss';
import { StyledButton } from '../../components/buttons/StyledButton';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import TextField from '../../components/TextField/CustomTextField';
import { postUtil } from '../../../util/apiUtil';
import { fetchUser, userDoc } from '../../../state/docs/userDoc';
import StyledHeader from '../../components/text/StyledHeader';
import { useDoc } from '../../../state/state';

const HelpPage = () => {
    const [user] = useDoc(userDoc);
    const userIsActive = user?.currentRequestId?.status === 'ACTIVE';

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        postUtil(
            'user/contact',
            {
                subject,
                message,
            },
            async () => fetchUser(),
            'Email sent successfully',
        )();
    };

    return (
        <TopBarPageTemplate>
            <div className={styles.container}>
                {userIsActive && (
                    <>
                        <div className={styles.panel}>
                            <StyledHeader>HASEL Workstation Manual</StyledHeader>
                            <StyledButton href='/manual.pdf' target='_blank'>
                                View PDF
                            </StyledButton>
                            <iframe
                                className={styles.pdf}
                                title='HASEL Lab Manual'
                                src='/manual.pdf'
                            />
                        </div>
                        <Divider orientation='vertical' flexItem />
                    </>
                )}
                <div className={styles.panel}>
                    <StyledHeader>Contact Us</StyledHeader>
                    <form autoComplete='off' className={styles.form} onSubmit={handleSubmit}>
                        <p className={styles.subtitle}>
                            If you want to send us a message, please fill out this form and we will
                            respond to you as soon as possible.
                        </p>
                        <TextField title='Subject' setValue={setSubject} />
                        <TextField title='Message' setValue={setMessage} multiline rows={4} />

                        <div className={styles.buttonContainer}>
                            <StyledButton type='submit'>Submit Message</StyledButton>
                        </div>
                    </form>
                </div>
            </div>
        </TopBarPageTemplate>
    );
};

export default HelpPage;
