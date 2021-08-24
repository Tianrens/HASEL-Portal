import React, { useState, useEffect } from 'react';
import { auth } from './firebase';

const AppContext = React.createContext();

function AppContextProvider({ children }) {
    const [firebaseUserIdToken, setFirebaseUserIdToken] = useState(null);

    useEffect(() => {
        // eslint-disable-next-line no-shadow
        auth.onIdTokenChanged(async (auth) => {
            if (auth) {
                const token = await auth.getIdToken();
                setFirebaseUserIdToken(token);
            } else {
                setFirebaseUserIdToken(null);
            }
        });
    }, []);

    const context = {
        firebaseUserIdToken,
    }

    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    );
}

export {
    AppContext,
    AppContextProvider,
}
