import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import LandingPage from '../LandingPage/LandingPage';

test('Landing Page renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <SnackbarProvider>
                <LandingPage />
            </SnackbarProvider>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
