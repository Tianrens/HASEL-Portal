import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import { MemoryRouter } from 'react-router-dom';
import UserHomePage from '../ViewRequests/ViewRequests';

Object.defineProperty(global.self, 'crypto', {
    value: {
        // eslint-disable-next-line no-unused-vars
        getRandomValues: (arr) => null,
    },
});

test('User Home page renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <MemoryRouter>
                <UserHomePage />
            </MemoryRouter>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
