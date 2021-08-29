import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider } from '@material-ui/core';
import PendingApproval from '../PendingApproval/PendingApproval';

test('Pending Approval Page renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <PendingApproval />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
