import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import GanttLegend from '../gpuBookingGantt/GanttLegend';

test('GanttLegend renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <GanttLegend hasCurrentBooking />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
