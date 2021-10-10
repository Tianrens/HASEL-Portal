import React from 'react';
import renderer from 'react-test-renderer';
import StylesProvider from '@mui/styles/StylesProvider';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ViewUsers from '../ViewUsers/ViewUsers';

const theme = createTheme({});
test('View Users page renders properly', () => {
    const snapshotComponent = renderer.create(
        <ThemeProvider theme={theme}>
            <StylesProvider injectFirst>
                <MemoryRouter>
                    <ViewUsers />
                </MemoryRouter>
            </StylesProvider>
        </ThemeProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
