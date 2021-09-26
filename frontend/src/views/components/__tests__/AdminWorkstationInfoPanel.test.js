import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import AdminWorkstationInfoPanel from '../workstationInfoPanel/AdminWorkstationInfoPanel';

Object.defineProperty(global.self, 'crypto', {
    value: {
        // eslint-disable-next-line no-unused-vars
        getRandomValues: (arr) => null,
    },
});

const workstationData = [
    {
        _id: 0,
        name: 'Zeus Suis',
        cpuDescription: 'Super fast CPU',
        gpuDescription: 'Cool GPU',
        ramDescription: 'Ram ranch',
    },
];

test('BookingForm renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <AdminWorkstationInfoPanel workstationData={workstationData} />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
