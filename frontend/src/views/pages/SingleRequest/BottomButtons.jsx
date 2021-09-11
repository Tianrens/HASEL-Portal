import { React } from 'react';
import Icon from '@material-ui/core/Icon';
import { StyledButton } from '../../components/buttons/StyledButton';
import styles from './SingleRequest.module.scss';

const BottomButtons = ({ onDelete, onDeny, onAccept }) => (
    <div className={styles.buttonContainer}>
        <div>
            <StyledButton
                className={styles.button}
                color='yellow'
                icon={<Icon>delete</Icon>}
                type='submit'
                onClick={onDelete}
            >
                Delete
            </StyledButton>
        </div>
        <div>
            <StyledButton
                className={styles.button}
                color='red'
                icon={<Icon>close</Icon>}
                type='submit'
                onClick={onDeny}
            >
                Deny
            </StyledButton>
            <StyledButton
                className={styles.button}
                color='green'
                icon={<Icon>done</Icon>}
                type='submit'
                onClick={onAccept}
            >
                Accept
            </StyledButton>
        </div>
    </div>
);

export default BottomButtons;
