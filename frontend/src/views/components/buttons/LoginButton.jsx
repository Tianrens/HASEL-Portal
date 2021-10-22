import { Icon } from '@mui/material';
import React from 'react';
import { firebase, auth } from '../../../firebase';
import { StyledButton } from './StyledButton';

async function login(callback, errorCallback) {
    const provider = new firebase.auth.GoogleAuthProvider();

    await auth.signInWithPopup(provider).then(() => {
        const userEmail = auth.currentUser.email;
        if (userEmail.endsWith('@aucklanduni.ac.nz') || userEmail.endsWith('@auckland.ac.nz')) {
            callback();
        } else {
            auth.signOut();
            errorCallback('Not using a University of Auckland email.');
        }
    });
}

/**
 * Button to log in. Upon successful login, calls the callback and saves the authentication details in the AppProvider.
 * Upon unsuccessful login, throws error.
 * @param {function callback specifies the function that is called after the login is successful}
 */
function LoginButton({ callback, errorCallback }) {
    return (
        <StyledButton
            icon={<Icon>login</Icon>}
            onClick={() => {
                login(callback, errorCallback);
            }}
        >
            Login
        </StyledButton>
    );
}

export default LoginButton;
