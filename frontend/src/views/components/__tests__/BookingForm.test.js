import React from 'react';
import renderer from 'react-test-renderer';
import StylesProvider from '@mui/styles/StylesProvider';
import BookingForm from '../forms/BookingForm';

Object.defineProperty(global.self, 'crypto', {
    value: {
        // eslint-disable-next-line no-unused-vars
        getRandomValues: (arr) => null,
    },
});

test('BookingForm renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <BookingForm numGPUs={5} />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
