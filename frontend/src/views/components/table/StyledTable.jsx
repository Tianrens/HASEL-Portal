import {
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Paper,
} from '@material-ui/core';
import { React } from 'react';
import { headerCell } from './StyledTable.module.scss';

const HeaderTableCell = ({ children }) => <TableCell className={headerCell}>{children}</TableCell>;

const columnsCreator = (columns) => {
    // First column not aligned right
    const firstColumn = columns[0];
    const restColumns = columns.slice(1);

    return (
        <>
            <HeaderTableCell>{firstColumn}</HeaderTableCell>
            {restColumns.map((column) => (
                <HeaderTableCell key={column}>{column}</HeaderTableCell>
            ))}
        </>
    );
};

const StyledTable = ({ rows, columns, rowFactory }) => (
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>{columnsCreator(columns)}</TableRow>
            </TableHead>
            <TableBody>{rows.map((row) => rowFactory(row))}</TableBody>
        </Table>
    </TableContainer>
);

export default StyledTable;
