import { React } from 'react';
import Icon from '@material-ui/core/Icon';
import { StyledButton } from '../../components/buttons/StyledButton';
import styles from './SingleRequest.module.scss';

const BottomButtons = ({ deleteHandler, submitHandler }) => (
    <div className={styles.buttonContainer}>
        <div>
            <StyledButton
                className={styles.button}
                color='yellow'
                icon={<Icon>delete</Icon>}
                type='submit'
                onClick={(e) => deleteHandler(e)}
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
                onClick={(e) => submitHandler(e)}
            >
                Deny
            </StyledButton>
            <StyledButton
                className={styles.button}
                color='green'
                icon={<Icon>done</Icon>}
                type='submit'
                onClick={(e) => submitHandler(e)}
            >
                Accept
            </StyledButton>
        </div>
    </div>
);

export default BottomButtons;
