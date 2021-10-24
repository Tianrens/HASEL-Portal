import { React, useState } from 'react';
import { Divider } from '@mui/material';
import styles from './HelpPage.module.scss';
import { StyledButton } from '../../components/buttons/StyledButton';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import TextField from '../../components/TextField/CustomTextField';
import { postUtil } from '../../../util/apiUtil';
import { userDoc } from '../../../state/docs/userDoc';
import StyledHeader from '../../components/text/StyledHeader';
import { useDoc } from '../../../state/state';
import { userIsAdmin } from '../../../config/accountTypes';

const HelpPage = () => {
    const [user] = useDoc(userDoc);
    const userIsActive = user?.currentRequestId?.status === 'ACTIVE';

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const isEmpty = !subject || !message;

    const clearForm = () => {
        setSubject('');
        setMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        postUtil(
            'user/contact',
            {
                subject,
                message,
            },
            () => clearForm(),
            'Email sent successfully',
        )();
    };

    return (
        <TopBarPageTemplate>
            <div className={styles.container}>
                {(userIsActive || userIsAdmin()) && (
                    <>
                        <div className={styles.panel}>
                            <StyledHeader>HASEL Workstation Manual</StyledHeader>
                            <StyledButton href='/Manual.pdf' target='_blank'>
                                View PDF
                            </StyledButton>
                            <iframe
                                className={styles.pdf}
                                title='HASEL Workstation Manual'
                                src='/Manual.pdf'
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
                        <TextField title='Subject' value={subject} setValue={setSubject} />
                        <TextField
                            title='Message'
                            value={message}
                            setValue={setMessage}
                            multiline
                            rows={4}
                        />

                        <div className={styles.buttonContainer}>
                            <StyledButton disabled={isEmpty} type='submit'>
                                Submit Message
                            </StyledButton>
                        </div>
                    </form>
                </div>
            </div>
        </TopBarPageTemplate>
    );
};

export default HelpPage;
