import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { TableCell, TableRow } from '@mui/material';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import TableWithPagination from '../../components/table/TableWithPagination';
import BookingPeriod from '../../components/text/BookingPeriod';
import { useGet } from '../../../hooks/useGet';

const ViewWorkstationBookings = () => {
    const columnHeaders = ['Name', 'Booking Period', 'GPUs Booked'];
    const rowFactory = (row) => (
        <TableRow key={row._id} component={Link} to={`/bookings/${row._id}`}>
            <TableCell component='th' scope='row'>
                {row.userId.firstName} {row.userId.lastName}
            </TableCell>
            <TableCell align='right'>
                <BookingPeriod
                    startTimestamp={row.startTimestamp}
                    endTimestamp={row.endTimestamp}
                />
            </TableCell>
            <TableCell align='right'>{row.gpuIndices.join(', ')}</TableCell>
        </TableRow>
    );

    const { workstationId } = useParams();
    const workstation = useGet(`/api/workstation/${workstationId}`).data;
    const workstationName = workstation?.name ?? '';

    const sections = [
        { title: 'Current and Upcoming Bookings', endpoint: 'ACTIVE' },
        { title: 'Past Bookings', endpoint: 'PAST' },
    ];

    return (
        <TopBarPageTemplate>
            <StyledHeader left back>
                Bookings Overview - {workstationName}
            </StyledHeader>
            {sections.map((section) => (
                <div key={section.title}>
                    <StyledHeader left sub>{`${section.title}`}</StyledHeader>
                    <TableWithPagination
                        endpoint={`/api/workstation/${workstationId}/booking/${section.endpoint}`}
                        rowProp='bookings'
                        columns={columnHeaders}
                        rowFactory={rowFactory}
                    />
                </div>
            ))}
        </TopBarPageTemplate>
    );
};

export default ViewWorkstationBookings;
