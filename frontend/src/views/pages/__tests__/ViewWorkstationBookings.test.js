import React from 'react';
import renderer from 'react-test-renderer';
import StylesProvider from '@mui/styles/StylesProvider';
import { MemoryRouter } from 'react-router-dom';
import ViewWorkstationBookings from '../ViewWorkstationBookings/ViewWorkstationBookings';

test('View Workstation Bookings page renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <MemoryRouter>
                <ViewWorkstationBookings />
            </MemoryRouter>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
