import { React, useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import SearchBar from '../../components/TextField/SearchBar';
import TableWithPagination from '../../components/table/TableWithPagination';
import { getDisplayName } from '../../../config/accountTypes';
import styles from './ViewUsers.module.scss';

const columns = ['Name', 'UPI', 'Type', 'Status', 'Expiry Date'];

const rowFactory = (user) => (
    <TableRow key={user._id} component={Link} to={`/users/${user._id}`}>
        <TableCell component='th' scope='row'>
            {user.firstName} {user.lastName}
        </TableCell>
        <TableCell align='right'>{user.upi}</TableCell>
        <TableCell align='right'>{getDisplayName(user.type)}</TableCell>
        <TableCell align='right'>{user?.currentRequestId?.status ?? '-'}</TableCell>
        <TableCell align='right'>
            {user?.currentRequestId?.endDate
                ? new Date(user.currentRequestId.endDate).toLocaleDateString()
                : '-'}
        </TableCell>
    </TableRow>
);

const ViewUsers = () => {
    // Maintain state value of search bar
    const [search, setSearch] = useState('');
    // Use to search backend
    const [activeSearch, setActiveSearch] = useState('');

    return (
        <TopBarPageTemplate>
            <div className={styles.container}>
                <div className={styles.header}>
                    <StyledHeader left>Users</StyledHeader>
                    <SearchBar
                        placeholder='Search by name or UPI'
                        value={search}
                        onChange={(newValue) => setSearch(newValue)}
                        onRequestSearch={() => setActiveSearch(search)}
                        onCancelSearch={() => setActiveSearch('')}
                    />
                </div>
                <h3 className={styles.searchIndicator}>
                    <i className={`${styles.italic} ${!activeSearch ? styles.hidden : ''}`}>
                        Search results for: <b>{activeSearch}</b>
                    </i>
                </h3>
                {activeSearch ? (
                    <>
                        <TableWithPagination
                            endpoint={`/api/user/search/${activeSearch}`}
                            rowProp='matchingUsers'
                            columns={columns}
                            rowFactory={rowFactory}
                        />
                    </>
                ) : (
                    <TableWithPagination
                        endpoint='/api/user'
                        rowProp='users'
                        columns={columns}
                        rowFactory={rowFactory}
                    />
                )}
            </div>
        </TopBarPageTemplate>
    );
};

export default ViewUsers;
