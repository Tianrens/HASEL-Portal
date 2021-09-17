import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import BottomButtons from '../buttons/BottomButtons';

test('BottomButtons renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <BottomButtons onAccept={() => {}} onDeny={() => {}} onDelete={() => {}} />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
