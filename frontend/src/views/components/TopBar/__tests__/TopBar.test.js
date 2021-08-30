import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { StylesProvider } from '@material-ui/core';
import TopBar from '../TopBar';

test('TopBar renders properly', () => {
    const shallowRenderer = new ShallowRenderer();
    const snapshotComponent = shallowRenderer.render(
        <StylesProvider injectFirst>
            <TopBar />
        </StylesProvider>,
    );
    expect(snapshotComponent).toMatchSnapshot();
});
