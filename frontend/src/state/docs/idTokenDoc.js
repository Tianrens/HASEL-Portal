import React, { useEffect } from 'react';
import { auth } from '../../firebase';
import { useDoc } from '../state';

export const idTokenDoc = 'firebaseIdToken';

const IdTokenState = () => {
    const [, setToken] = useDoc(idTokenDoc);

    // Update the token whenever the firebase user changes
    useEffect(() => {
        auth.onIdTokenChanged(async (update) => {
            const newToken = await update?.getIdToken();
            setToken(newToken);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <></>;
};

export default IdTokenState;
