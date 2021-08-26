import React from 'react';
import { Icon, StylesProvider } from '@material-ui/core';
import logo from './logo.svg';
import './App.css';
import { StyledButton } from './views/components/buttons/StyledButton';

function App() {
    return (
        <StylesProvider injectFirst>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                    <StyledButton>asd</StyledButton>
                    <StyledButton color='red'>dsf</StyledButton>
                    <StyledButton color='yellow' icon={<Icon>add_circle</Icon>}>sdff</StyledButton>
                </header>
            </div>
        </StylesProvider>
    );
}

export default App;
