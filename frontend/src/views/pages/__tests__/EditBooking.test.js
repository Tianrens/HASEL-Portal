import React from 'react';
import renderer from 'react-test-renderer';
import StylesProvider from '@mui/styles/StylesProvider';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import EditBooking from '../EditBooking/EditBooking';

Object.defineProperty(global.self, 'crypto', {
    value: {
        // eslint-disable-next-line no-unused-vars
        getRandomValues: (arr) => null,
    },
});

test('Edit Booking page renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <SnackbarProvider>
                <MemoryRouter>
                    <EditBooking />
                </MemoryRouter>
            </SnackbarProvider>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
