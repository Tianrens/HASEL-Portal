import React, { useEffect } from 'react';
import { useDoc, accessDoc } from '../state';
import { authRequest } from '../util/authRequest';
import { idTokenDoc } from './idTokenDoc';

// Define the name stored in the state
export const userDoc = 'userDoc';

export async function fetchUser() {
    const [, setUser] = accessDoc(userDoc);
    try {
        const res = await authRequest('/api/user/info', 'GET');
        setUser(res.data);
        console.log(res.data);
    } catch (err) {
        setUser(null);
        console.error(err);
    }
}

export async function signUpUser(firstName, lastName, upi, type) {
    const [, setUser] = accessDoc(userDoc);

    try {
        const res = await authRequest('/api/user', 'POST', { firstName, lastName, upi, type });
        setUser(res.data);
    } catch (err) {
        console.error(err);
    }
}

const UserState = () => {
    const [idToken] = useDoc(idTokenDoc);

    // Run every time the idToken changes
    useEffect(() => {
        fetchUser();
    }, [idToken]);

    return <></>;
};

export default UserState;
