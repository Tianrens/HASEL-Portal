import { React } from 'react';
import { TableRow, TableCell } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { container } from './ViewRequests.module.scss';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import TableWithPagination from '../../components/table/TableWithPagination';
import { getDisplayName } from '../../../config/accountTypes';

const columns = ['Name', 'Account Type', 'Application Received'];

const rowFactory = (row) => (
    <TableRow key={row._id} component={Link} to={`/requests/${row._id}`}>
        <TableCell component='th' scope='row'>
            {row.userId.firstName} {row.userId.lastName}
        </TableCell>
        <TableCell align='right'>{getDisplayName(row.userId.type)}</TableCell>
        <TableCell align='right'>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
    </TableRow>
);

const sections = [
    { title: 'Pending Requests', endpoint: 'PENDING' },
    { title: 'Approved Requests', endpoint: 'ACTIVE' },
    { title: 'Denied Requests', endpoint: 'DECLINED' },
];

const ViewRequests = () => (
    <TopBarPageTemplate>
        <div className={container}>
            {sections.map((section) => (
                <div key={section.title}>
                    <StyledHeader left>{section.title}</StyledHeader>
                    <TableWithPagination
                        endpoint={`/api/request/status/${section.endpoint}`}
                        rowProp='requests'
                        columns={columns}
                        rowFactory={rowFactory}
                    />
                </div>
            ))}
        </div>
    </TopBarPageTemplate>
);

export default ViewRequests;
