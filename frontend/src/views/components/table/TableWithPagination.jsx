import { TablePagination } from '@material-ui/core';
import { React } from 'react';
import usePagination from '../../../hooks/usePagination';
import StyledTable from './StyledTable';

const TableWithPagination = ({ endpoint, rowProp, ...props }) => {
    const rowsPerPage = 2;
    const { data, total, isLoading, page, setPage } = usePagination(endpoint, [], rowsPerPage);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <>
            {/* TODO: Update loading div with loading component */}
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <StyledTable {...props} rows={data[rowProp] ?? []} />
            )}
            <TablePagination
                component='div'
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[]}
                rowsPerPage={rowsPerPage}
            />
        </>
    );
};

export default TableWithPagination;
