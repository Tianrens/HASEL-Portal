import React from 'react';
import { StylesProvider } from '@material-ui/core';
import './App.css';
import NewRequest from './views/pages/NewRequest/NewRequest';

function App() {
    return (
        <StylesProvider injectFirst>
            <div>
                <NewRequest />
            </div>
        </StylesProvider>
    );
}

export default App;
