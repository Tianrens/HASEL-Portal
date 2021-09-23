import { React } from 'react';
import { TableRow, TableCell } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { container } from './ViewUsers.module.scss';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import TableWithPagination from '../../components/table/TableWithPagination';
import { getDisplayName } from '../../../config/accountTypes';

const columns = ['Name', 'UPI', 'Type', 'Status', 'Date Approved'];

const rowFactory = (user) => (
    <TableRow key={user._id} component={Link} to={`/users/${user._id}`}>
        <TableCell component='th' scope='row'>
            {user.firstName} {user.lastName}
        </TableCell>
        <TableCell align='right'>{user.upi}</TableCell>
        <TableCell align='right'>{getDisplayName(user.type)}</TableCell>
        <TableCell align='right'>{user?.currentRequestId?.status ?? '-'}</TableCell>
        <TableCell align='right'>
            {user?.currentRequestId?.startDate
                ? new Date(user.currentRequestId.startDate).toLocaleDateString()
                : '-'}
        </TableCell>
    </TableRow>
);

const ViewUsers = () => (
    <TopBarPageTemplate>
        <div className={container}>
            <StyledHeader left>Users</StyledHeader>
            <TableWithPagination
                endpoint='/api/user'
                rowProp='users'
                columns={columns}
                rowFactory={rowFactory}
            />
        </div>
    </TopBarPageTemplate>
);

export default ViewUsers;