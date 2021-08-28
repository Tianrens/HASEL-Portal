import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import App from './App';

test('App renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <App />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
