/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import renderer from 'react-test-renderer';
import { TableRow, TableCell } from '@mui/material';
import StylesProvider from '@mui/styles/StylesProvider';
import TableWithPagination from '../table/TableWithPagination';

const columns = ['test'];
const rows = [{ title: 'test' }, { title: 'test2' }];
const rowFactory = (row) => {
    <TableRow key={row.title}>
        <TableCell component='th' scope='row'>
            {row.title}
        </TableCell>
    </TableRow>;
};

test('Styled Table renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <TableWithPagination rows={rows} columns={columns} rowFactory={rowFactory} />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
