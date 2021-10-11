import { TablePagination } from '@mui/material';
import { React } from 'react';
import usePagination from '../../../hooks/usePagination';
import StyledTable from './StyledTable';
import LoadingWheelDiv from '../LoadingWheel/LoadingWheelDiv';

const TableWithPagination = ({ endpoint, rowProp, rowsPerPage = 10, ...props }) => {
    const { data, total, isLoading, page, setPage } = usePagination(endpoint, [], rowsPerPage);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <>
            {isLoading ? (
                <LoadingWheelDiv />
            ) : (
                <>
                    <StyledTable {...props} rows={data[rowProp] ?? []} />
                    <TablePagination
                        component='div'
                        count={total}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[]}
                        rowsPerPage={rowsPerPage}
                    />
                </>
            )}
        </>
    );
};

export default TableWithPagination;
