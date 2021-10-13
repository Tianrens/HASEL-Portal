import { React, useState } from 'react';
import jsonexport from 'jsonexport';
import dayjs from 'dayjs';
import { Icon, TableCell, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import StyledHeader from '../../components/text/StyledHeader';
import SearchBar from '../../components/TextField/SearchBar';
import TableWithPagination from '../../components/table/TableWithPagination';
import { getDisplayName } from '../../../config/accountTypes';
import styles from './ViewUsers.module.scss';
import { authRequest } from '../../../hooks/util/authRequest';
import { csvOptions } from './CSVConfig';
import { StyledButton } from '../../components/buttons/StyledButton';

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

const exportUsers = async () => {
    let users;

    await authRequest('/api/user/download', 'GET')
        .then((response) => {
            users = response.data.users;

            // eslint-disable-next-line consistent-return
            jsonexport(users, csvOptions, (err, csv) => {
                const data = new Blob([csv], { type: 'text/csv' });

                // invoke browser download action
                const csvURL = window.URL.createObjectURL(data);
                const tempLink = document.createElement('a');
                tempLink.href = csvURL;
                tempLink.setAttribute(
                    'download',
                    `HASEL Portal Users - ${dayjs().format('DD/MMM/YY')}.csv`,
                );
                tempLink.click();
            });
        })
        .catch((err) => {
            console.log(`GET ERROR: ${err.message}`);
        });
};

const ViewUsers = () => {
    // Maintain state value of search bar
    const [search, setSearch] = useState('');
    // Use to search backend
    const [activeSearch, setActiveSearch] = useState('');

    return (
        <TopBarPageTemplate>
            <div className={styles.header}>
                <StyledHeader left>Users</StyledHeader>
                <StyledButton onClick={() => exportUsers()} icon={<Icon>download</Icon>}>
                    Download Data
                </StyledButton>

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
        </TopBarPageTemplate>
    );
};

export default ViewUsers;
