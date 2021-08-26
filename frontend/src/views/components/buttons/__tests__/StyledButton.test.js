import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { StylesProvider } from '@material-ui/core';
import { StyledButton } from '../StyledButton';

test('StyledButton renders properly', () => {
    const shallowRenderer = new ShallowRenderer();
    const snapshotComponent = shallowRenderer.render(
        <StylesProvider injectFirst>
            <StyledButton />
        </StylesProvider>);
    expect(snapshotComponent).toMatchSnapshot();
});
