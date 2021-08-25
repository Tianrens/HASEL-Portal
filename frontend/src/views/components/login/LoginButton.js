import React from 'react';
import { Button } from '@material-ui/core';
import { firebase, auth } from '../../../firebase';

async function login(callback) {
    const provider = new firebase.auth.GoogleAuthProvider();

    await auth.signInWithPopup(provider).then(() => {

        const userEmail = auth.currentUser.email;
        if (userEmail.endsWith('@aucklanduni.ac.nz') || userEmail.endsWith('@auckland.ac.nz')) {
            callback();
        } else {
            auth.signOut();
            throw new Error('not using an University of Auckland email');
        }

    });
}

/**
 * Button to log in. Upon successful login, calls the callback and saves the authentication details in the AppProvider.
 * Upon unsuccessful login, throws error.
 * @param {function callback specifies the function that is called after the login is successful}
 */
export function LoginButton( {callback}) {
    return (
        <Button
            variant='contained'
            color='primary'
            onClick={() => {login(callback);}}
        >
            Log In
        </Button>
    );
}

