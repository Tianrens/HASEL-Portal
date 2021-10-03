import React from 'react';
import renderer from 'react-test-renderer';
import StylesProvider from '@mui/styles/StylesProvider';
import { SnackbarProvider } from 'notistack';
import App from './App';

test('App renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <SnackbarProvider>
                <App />
            </SnackbarProvider>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
