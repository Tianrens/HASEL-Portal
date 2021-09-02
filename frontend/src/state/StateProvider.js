import React from 'react';
import IdTokenState from './docs/idTokenDoc';

const StateProvider = ({ children }) => (
    <>
        {children}
        <IdTokenState />
    </>
);

export default StateProvider;
