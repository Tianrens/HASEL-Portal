import { React } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { StyledButton } from '../buttons/StyledButton';

const ConfirmDialog = ({ message, open, handleClose, onSubmit }) => (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
            <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <StyledButton outline color='red' onClick={() => handleClose()}>
                No
            </StyledButton>
            <StyledButton
                onClick={() => {
                    onSubmit();
                    handleClose();
                }}
            >
                Yes
            </StyledButton>
        </DialogActions>
    </Dialog>
);

export default ConfirmDialog;
