import { React, useState } from 'react';
import Icon from '@mui/material/Icon';
import { StyledButton } from './StyledButton';
import { buttonContainer } from './BottomButtons.module.scss';
import ConfirmDialog from '../Modal/ConfirmDialog';

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
                            color="lighter"
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
