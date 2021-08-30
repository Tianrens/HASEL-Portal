import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import SignupPage from '../SignupPage/SignupPage';
import { AppContextProvider } from '../../../AppContextProvider';

test('Signup page renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <AppContextProvider>
                <SignupPage />
            </AppContextProvider>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
