import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import { MemoryRouter } from 'react-router-dom';
import NewRequest from '../NewRequest/NewRequest';

test('New Request Page renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <MemoryRouter>
                <NewRequest />
            </MemoryRouter>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
