import React from 'react';
import { StylesProvider } from '@material-ui/core';
import './App.css';
import LandingPage from './views/pages/LandingPage/LandingPage';

function App() {
    return (
        <StylesProvider injectFirst>
            <LandingPage />
        </StylesProvider>
    );
}

export default App;
