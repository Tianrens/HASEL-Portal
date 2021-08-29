import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import App from './App';
import { AppContextProvider } from './AppContextProvider';

test('App renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <AppContextProvider>
                <App />
            </AppContextProvider>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
