import React from 'react';
import renderer from 'react-test-renderer';
import { SnackbarProvider } from 'notistack';
import StylesProvider from '@mui/styles/StylesProvider';
import { MemoryRouter } from 'react-router-dom';
import NewWorkstation from '../NewWorkstation/NewWorkstation';

test('New Workstation page renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <MemoryRouter>
                <SnackbarProvider>
                    <NewWorkstation />
                </SnackbarProvider>
            </MemoryRouter>
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
