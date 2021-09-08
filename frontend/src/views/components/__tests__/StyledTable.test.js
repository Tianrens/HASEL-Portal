import React from 'react';
import renderer from 'react-test-renderer';
import { StylesProvider, TableRow, TableCell } from '@material-ui/core';
import StyledTable from '../table/StyledTable';

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
            <StyledTable columns={columns} rows={rows} rowFactory={rowFactory} />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
