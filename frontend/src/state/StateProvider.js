import React from 'react';
import IdTokenState from './docs/idTokenDoc';
import UserState from './docs/userDoc';

const StateProvider = ({ children }) => (
    <>
        {children}
        <IdTokenState />
        <UserState />
    </>
);

export default StateProvider;
