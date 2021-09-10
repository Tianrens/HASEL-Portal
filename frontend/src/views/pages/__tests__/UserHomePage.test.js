import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import { MemoryRouter } from 'react-router-dom';
import UserHomePage from '../ViewRequests/ViewRequests';

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
