import React from 'react';
import {
    content,
    expandingSpacer,
    header,
    loginContainer,
    QnA,
    subheader,
    text,
} from './LandingPage.module.scss';
import LoginButton from '../../components/buttons/LoginButton';
import HeroPageTemplate from '../../components/templates/HeroPageTemplate/HeroPageTemplate';
import { successSnackbar, errorSnackbar } from '../../../util/SnackbarUtil';

function LandingPage() {
    return (
        <HeroPageTemplate>
            <div className={content}>
                <h1 className={header}>HASEL Portal</h1>
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
            <div className={expandingSpacer} />
            <div className={loginContainer}>
                <LoginButton
                    callback={() => successSnackbar('Login Successful')}
                    errorCallback={(error) => errorSnackbar(error)}
                />
            </div>
        </HeroPageTemplate>
    );
}

export default LandingPage;
