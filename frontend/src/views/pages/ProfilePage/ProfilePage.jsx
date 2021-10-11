import { React } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Profile.module.scss';
import StyledHeader from '../../components/text/StyledHeader';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import { useDoc } from '../../../state/state';
import { userDoc } from '../../../state/docs/userDoc';
import { StyledButton } from '../../components/buttons/StyledButton';
import { auth } from '../../../firebase';
import UserDetails from './UserDetails';

const ProfilePage = () => {
    const history = useHistory();
    const [user] = useDoc(userDoc);

    const logoutHandler = () => {
        history.push('/');
        auth.signOut();
    };

    return (
        <TopBarPageTemplate>
            {user && (
                <>
                    <div className={styles.workstationHeader}>
                        <div className={styles.header}>
                            <StyledHeader left>My Account</StyledHeader>
                        </div>
                        <StyledButton onClick={logoutHandler}>Log Out</StyledButton>
                    </div>
                    <UserDetails user={user} />
                </>
            )}
        </TopBarPageTemplate>
    );
};

export default ProfilePage;
