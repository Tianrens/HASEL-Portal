import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import App from './App';
import { AppContextProvider } from './AppContextProvider';

test('App renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <AppContextProvider>
                <SnackbarProvider>
                    <App />
                </SnackbarProvider>
            </AppContextProvider>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
