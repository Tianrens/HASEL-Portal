import { React } from 'react';
import Icon from '@material-ui/core/Icon';
import { StyledButton } from './StyledButton';
import { buttonContainer } from './BottomButtons.module.scss';

const BottomButtons = ({
    onDelete,
    deleteText,
    onDeny,
    denyText,
    onAccept,
    acceptText,
    acceptDisabled,
}) => (
    <div className={buttonContainer}>
        <div>
            {onDelete && (
                <StyledButton
                    color='yellow'
                    icon={<Icon>delete</Icon>}
                    type='submit'
                    onClick={onDelete}
                >
                    {deleteText ?? 'Delete'}
                </StyledButton>
            )}
        </div>
        <div>
            {onDeny && (
                <StyledButton color='red' icon={<Icon>close</Icon>} type='submit' onClick={onDeny}>
                    {denyText ?? 'Deny'}
                </StyledButton>
            )}
            {onAccept && (
                <StyledButton
                    color='green'
                    icon={<Icon>done</Icon>}
                    type='submit'
                    onClick={onAccept}
                    disabled={acceptDisabled}
                >
                    {acceptText ?? 'Accept'}
                </StyledButton>
            )}
        </div>
    </div>
);

export default BottomButtons;
