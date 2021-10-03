import React from 'react';
import renderer from 'react-test-renderer';
import StylesProvider from '@mui/styles/StylesProvider';
import SignupPage from '../SignupPage/SignupPage';

test('Signup page renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <SignupPage />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
