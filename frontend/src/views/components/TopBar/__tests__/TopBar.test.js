import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { StylesProvider } from '@material-ui/core';
import { MemoryRouter } from 'react-router-dom';
import TopBar from '../TopBar';

test('TopBar renders properly', () => {
    const shallowRenderer = new ShallowRenderer();
    const snapshotComponent = shallowRenderer.render(
        <StylesProvider injectFirst>
            <MemoryRouter>
                <TopBar />
            </MemoryRouter>
        </StylesProvider>,
    );
    expect(snapshotComponent).toMatchSnapshot();
});
