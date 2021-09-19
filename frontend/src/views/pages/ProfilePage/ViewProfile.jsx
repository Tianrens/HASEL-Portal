import { React } from 'react';
import { Icon } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useCrud } from '../../../hooks/useCrud';
import styles from './Profile.module.scss';
import StyledHeader from '../../components/text/StyledHeader';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import UserDetails from './UserDetails';
import { StyledButton } from '../../components/buttons/StyledButton';

const ViewProfile = () => {
    const { userId } = useParams();

    const user = useCrud(`/api/user/${userId}`).data;

    const editHandler = () => {
        // redirect to /users/:id/edit
    };

    return (
        <TopBarPageTemplate>
            {user && (
                <div className={styles.container}>
                    <StyledHeader left>{`${user?.firstName}'s Account`}</StyledHeader>
                    <UserDetails user={user} adminView />
                    <div className={styles.buttonContainer}>
                        <StyledButton color='yellow' icon={<Icon>edit</Icon>} onClick={editHandler}>
                            Edit User
                        </StyledButton>
                    </div>
                </div>
            )}
        </TopBarPageTemplate>
    );
};

export default ViewProfile;
