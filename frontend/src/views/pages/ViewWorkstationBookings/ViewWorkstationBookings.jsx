import { React, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TableCell, TableRow } from '@mui/material';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import { container } from './ViewWorkstationBookings.module.scss';
import TableWithPagination from '../../components/table/TableWithPagination';
import BookingPeriod from '../../components/text/BookingPeriod';
import { authRequest } from '../../../hooks/util/authRequest';

const ViewWorkstationBookings = () => {
    const columnHeaders = ['Name', 'Booking Period', 'GPUs Booked'];
    const rowFactory = (row) => (
        <TableRow key={row._id} component={Link} to={`/bookings/${row._id}`}>
            <TableCell component='th' scope='row'>
                {row.userId.firstName} {row.userId.lastName}
            </TableCell>
            <TableCell align='right'>
                <BookingPeriod startTimestamp={row.startTimestamp} endTimestamp={row.endTimestamp} />
            </TableCell>
            <TableCell align='right'>{row.gpuIndices.join(', ')}</TableCell>
        </TableRow>
    );

    const [workstationTitle, setWorkstationTitle] = useState('');

    const { workstationId } = useParams();
    useEffect(() => {
        async function getAndSetValues() {
            const response = await authRequest(`/api/workstation/${workstationId}`);
            setWorkstationTitle(response.data.name ? `- ${response.data.name}` : '');
        }
        getAndSetValues();
    }, [workstationId]);

    const sections = [
        { title: 'Active Bookings', endpoint: 'ACTIVE' },
        { title: 'Past Bookings', endpoint: 'PAST' },
    ];

    return (
        <TopBarPageTemplate>
            <div className={container}>
                {sections.map((section) => (
                    <div key={section.title}>
                        <StyledHeader left>{`${section.title} ${workstationTitle}`}</StyledHeader>
                        <TableWithPagination
                            endpoint={`/api/workstation/${workstationId}/booking/${section.endpoint}`}
                            rowProp='bookings'
                            columns={columnHeaders}
                            rowFactory={rowFactory}
                        />
                    </div>
                ))}
            </div>
        </TopBarPageTemplate>
    );
};

export default ViewWorkstationBookings;
