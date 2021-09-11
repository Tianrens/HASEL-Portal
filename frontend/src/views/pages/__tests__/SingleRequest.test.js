import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import SingleRequest from '../SingleRequest/SingleRequest';

test('Single Request page renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <SnackbarProvider>
                <MemoryRouter>
                    <SingleRequest />
                </MemoryRouter>
            </SnackbarProvider>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
