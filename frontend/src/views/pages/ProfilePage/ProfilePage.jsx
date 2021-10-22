import { React } from 'react';
import { useHistory } from 'react-router-dom';
import { Icon } from '@mui/material';
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
                    <StyledHeader
                        left
                        actions={
                            <StyledButton
                                size='small'
                                icon={<Icon>logout</Icon>}
                                onClick={logoutHandler}
                            >
                                Log Out
                            </StyledButton>
                        }
                    >
                        My Account
                    </StyledHeader>
                    <UserDetails user={user} />
                </>
            )}
        </TopBarPageTemplate>
    );
};

export default ProfilePage;
