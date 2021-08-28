import React from 'react';
import { content, QnA, loginContainer } from './LandingPage.module.scss';
import LoginButton from '../../components/buttons/LoginButton';
import HeroPageTemplate from '../../components/templates/HeroPageTemplate/HeroPageTemplate';

function loginCallback() {
    console.log('login callback');
}

function loginFailCallback(error) {
    console.log(`login fail callback: ${error}`);
}

function LandingPage() {
    return (
        <HeroPageTemplate>
            <div className={content}>
                <h1>HASEL Lab</h1>
                <div className={QnA}>
                    <h2>What is HASEL?</h2>
                    <p>
                        The Human Aspects in Software Engineering Lab (HASEL)
                        researches projects related to improving software
                        practices and processes, with a focus on the human
                        aspects of software engineering. We have several high
                        performance machine learning computers available for use
                        in the lab. They can be accessed remotely through SSH as
                        well.
                    </p>
                    <h2>How do I gain access?</h2>
                    <p>
                        Login with your university connected Google account
                        below. Then enter your details and apply for a
                        workstation. After access is granted you will receive an
                        email with your workstation details. You can then use
                        this site to book the lab computers.
                    </p>
                </div>
            </div>
            <div className={loginContainer}>
                <LoginButton
                    callback={loginCallback}
                    errorCallback={loginFailCallback}
                />
            </div>
        </HeroPageTemplate>
    );
}

export default LandingPage;
