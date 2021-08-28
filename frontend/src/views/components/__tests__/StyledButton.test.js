import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import { StyledButton } from '../buttons/StyledButton';

test('StyledButton renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <StyledButton />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
