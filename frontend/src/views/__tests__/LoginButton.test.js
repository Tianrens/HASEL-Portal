import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import LoginButton from '../components/buttons/LoginButton';

test('Login Button renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <LoginButton />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
