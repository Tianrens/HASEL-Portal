import React from 'react';
import renderer from 'react-test-renderer';
import { SnackbarProvider } from 'notistack';
import { StylesProvider } from '@material-ui/core';
import { MemoryRouter } from 'react-router-dom';
import NewBooking from '../NewBooking/NewBooking';

test('New Booking page renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <MemoryRouter>
                <SnackbarProvider>
                    <NewBooking />
                </SnackbarProvider>
            </MemoryRouter>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
