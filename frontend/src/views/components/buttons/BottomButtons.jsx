import { React, useState } from 'react';
import Icon from '@mui/material/Icon';
import { StyledButton } from './StyledButton';
import { buttonContainer } from './BottomButtons.module.scss';
import ConfirmDialog from '../Modal/ConfirmDialog';

/**
 * Configurable buttons for the bottom of a page.
 * onDelete, onAccept, and onDeny control whether that button is displayed.
 * Delete button is displayed on the left, and the deny and accept buttons are displayed on the right.
 * For each action, if the button is clicked, a modal is shown to confirm that action.
 */
const BottomButtons = ({
    onDelete,
    deleteText,
    onDeny,
    denyText,
    onAccept,
    acceptText,
    acceptDisabled,
    deleteMessage,
    denyMessage,
    acceptMessage,
}) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [onSubmit, setOnSubmit] = useState();

    const openModal = (msg, fn) => {
        setMessage(msg);
        setOnSubmit(() => fn);
        setOpen(true);
    };

    return (
        <>
            <div className={buttonContainer}>
                <div>
                    {onDelete && (
                        <StyledButton
                            color='red'
                            icon={<Icon>delete</Icon>}
                            type='submit'
                            onClick={() => openModal(deleteMessage, onDelete)}
                        >
                            {deleteText ?? 'Delete'}
                        </StyledButton>
                    )}
                </div>
                <div>
                    {onDeny && (
                        <StyledButton
                            color='lighter'
                            outline
                            icon={<Icon>close</Icon>}
                            type='submit'
                            onClick={() => openModal(denyMessage, onDeny)}
                        >
                            {denyText ?? 'Deny'}
                        </StyledButton>
                    )}
                    {onAccept && (
                        <StyledButton
                            icon={<Icon>done</Icon>}
                            type='submit'
                            onClick={() => openModal(acceptMessage, onAccept)}
                            disabled={acceptDisabled}
                        >
                            {acceptText ?? 'Accept'}
                        </StyledButton>
                    )}
                </div>
            </div>
            <ConfirmDialog
                message={message}
                open={open}
                onSubmit={onSubmit}
                handleClose={() => setOpen(false)}
            />
        </>
    );
};

export default BottomButtons;
