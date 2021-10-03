import React from 'react';
import renderer from 'react-test-renderer';
import StylesProvider from '@mui/styles/StylesProvider';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import ViewProfile from '../ProfilePage/ViewProfile';

test('Edit Booking page renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <SnackbarProvider>
                <MemoryRouter>
                    <ViewProfile />
                </MemoryRouter>
            </SnackbarProvider>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
