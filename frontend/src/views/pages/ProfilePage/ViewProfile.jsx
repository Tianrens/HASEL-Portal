import { React, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styles from './Profile.module.scss';
import StyledHeader from '../../components/text/StyledHeader';
import TopBarPageTemplate from '../../components/templates/TopBarPageTemplate/TopBarPageTemplate';
import UserDetails from './UserDetails';
import BottomButtons from '../../components/buttons/BottomButtons';
import { discardResourceMessage, editResourceMessage } from '../../../config/ModalMessages';
import { patchUtil } from '../../../util/apiUtil';
import { useGet } from '../../../hooks/useGet';
import LoadingWheelDiv from '../../components/LoadingWheel/LoadingWheelDiv';

const ViewProfile = () => {
    const { userId } = useParams();
    const history = useHistory();

    const user = useGet(`/api/user/${userId}`).data;
    const [type, setType] = useState(user?.type);
    const typeChanged = type !== user?.type;
    const invalidChange = type === 'SUPERADMIN' && user?.type === 'ADMIN';

    return (
        <TopBarPageTemplate>
            {!user ? (
                <LoadingWheelDiv />
            ) : (
                <div className={styles.fadeInAnimation}>
                    <StyledHeader left>{`${user?.firstName}'s Account`}</StyledHeader>
                    <UserDetails user={user} adminView updateType={(newType) => setType(newType)} />
                    <BottomButtons
                        onAccept={patchUtil('user', { type }, userId, () => history.goBack())}
                        onDeny={() => history.goBack()}
                        acceptText='Confirm Changes'
                        denyText='Cancel'
                        denyMessage={discardResourceMessage('user')}
                        acceptMessage={editResourceMessage('user')}
                        acceptDisabled={!typeChanged || invalidChange}
                    />
                </div>
            )}
        </TopBarPageTemplate>
    );
};

export default ViewProfile;
