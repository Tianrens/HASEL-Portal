import React from 'react';
import renderer from 'react-test-renderer';
import StylesProvider from '@mui/styles/StylesProvider';
import UserTypeDropdown from '../TextField/UserTypeDropdown';

test('UserTypeDropdown renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <UserTypeDropdown setValue={() => {}} />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
