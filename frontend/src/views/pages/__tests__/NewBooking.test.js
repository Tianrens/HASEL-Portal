import React from 'react';
import renderer from 'react-test-renderer';
import { SnackbarProvider } from 'notistack';
import StylesProvider from '@mui/styles/StylesProvider';
import { MemoryRouter } from 'react-router-dom';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MockDate from 'mockdate';
import AdapterDayJs from '@mui/lab/AdapterDayjs';
import NewBooking from '../NewBooking/NewBooking';

Object.defineProperty(global.self, 'crypto', {
    value: {
        // eslint-disable-next-line no-unused-vars
        getRandomValues: (arr) => null,
    },
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ state: { workstationId: 1 } }),
}));

test('New Booking page renders properly', () => {
    MockDate.set('2021-10-03');

    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <MemoryRouter>
                <SnackbarProvider>
                    <LocalizationProvider dateAdapter={AdapterDayJs}>
                        <NewBooking />
                    </LocalizationProvider>
                </SnackbarProvider>
            </MemoryRouter>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
