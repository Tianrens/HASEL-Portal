import React from 'react';
import renderer from 'react-test-renderer';
import StylesProvider from '@mui/styles/StylesProvider';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MockDate from 'mockdate';
import AdapterDayJs from '@mui/lab/AdapterDayjs';
import BookingForm from '../forms/BookingForm';

Object.defineProperty(global.self, 'crypto', {
    value: {
        // eslint-disable-next-line no-unused-vars
        getRandomValues: (arr) => null,
    },
});

test('BookingForm renders properly', () => {
    const mockedFn = jest.fn();
    MockDate.set('2021-10-03');

    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <LocalizationProvider dateAdapter={AdapterDayJs}>
                <BookingForm numGPUs={5} updateBookingState={mockedFn} />
            </LocalizationProvider>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
