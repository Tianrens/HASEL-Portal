import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import BookingForm from '../forms/BookingForm';

test('BookingForm renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <BookingForm numGPUs={5} />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
