import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import BlurredImageBg from '../components/background/BlurredImageBg/BlurredImageBg';

test('Blurred Image Background renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <BlurredImageBg />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
