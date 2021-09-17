import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import { MemoryRouter } from 'react-router-dom';
import ViewWorkstations from '../ViewWorkstations/ViewWorkstations';

test('View workstations page renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <MemoryRouter>
                <ViewWorkstations />
            </MemoryRouter>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
