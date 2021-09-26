import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { StylesProvider } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import theme from './assets/MaterialTheme';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './state/state';
import StateProvider from './state/StateProvider';
import { SnackbarUtils } from './util/SnackbarUtil';

ReactDOM.render(
    <React.StrictMode>
        <StylesProvider injectFirst>
            <StateProvider>
                <SnackbarProvider>
                    <ThemeProvider theme={theme}>
                        <App />
                    </ThemeProvider>
                    <SnackbarUtils />
                </SnackbarProvider>
            </StateProvider>
        </StylesProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
