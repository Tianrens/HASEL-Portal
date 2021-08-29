import React from 'react';
import { useSnackbar } from 'notistack';
import { header, subheader, text, content, QnA, loginContainer } from './LandingPage.module.scss';
import LoginButton from '../../components/buttons/LoginButton';
import HeroPageTemplate from '../../components/templates/HeroPageTemplate/HeroPageTemplate';

function LandingPage() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    function loginSuccessCallback() {
        enqueueSnackbar('Login Successful', {
            variant: 'success',
            autoHideDuration: 3000,
            onClose: closeSnackbar,
        });
    }
    function loginFailCallback(error) {
        enqueueSnackbar(error, {
            variant: 'error',
            autoHideDuration: 3000,
            onClose: closeSnackbar,
        });
    }
    return (
        <HeroPageTemplate>
            <div className={content}>
                <h1 className={header}>HASEL Lab</h1>
                <div className={QnA}>
                    <h2 className={subheader}>What is HASEL?</h2>
                    <p className={text}>
                        The Human Aspects in Software Engineering Lab (HASEL) researches projects
                        related to improving software practices and processes, with a focus on the
                        human aspects of software engineering. We have several high performance
                        machine learning computers available for use in the lab. They can be
                        accessed remotely through SSH as well.
                    </p>
                    <h2 className={subheader}>How do I gain access?</h2>
                    <p className={text}>
                        Login with your university connected Google account below. Then enter your
                        details and apply for a workstation. After access is granted you will
                        receive an email with your workstation details. You can then use this site
                        to book the lab computers.
                    </p>
                </div>
            </div>
            <div className={loginContainer}>
                <LoginButton callback={loginSuccessCallback} errorCallback={loginFailCallback} />
            </div>
        </HeroPageTemplate>
    );
}

export default LandingPage;
