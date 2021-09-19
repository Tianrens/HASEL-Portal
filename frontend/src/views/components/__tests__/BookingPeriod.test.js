import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import BookingPeriod from '../text/BookingPeriod';

test('BookingPeriod renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <BookingPeriod startTimestamp='2021-10-06T05:46:00.000+00:00' endTimestamp='2021-10-10T05:46:00.000+00:00' />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
