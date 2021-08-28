import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import GradientBg from '../components/background/GradientBg/GradientBg';

test('Gradient Background renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <GradientBg />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
