import { useSnackbar } from 'notistack';

let useSnackbarRef;
export const SnackbarUtils = () => {
    useSnackbarRef = useSnackbar();
    return null;
};

export function snackbar(message, variant = 'default') {
    useSnackbarRef.enqueueSnackbar(message, {
        variant,
        autoHideDuration: 3000,
        onClose: useSnackbarRef.closeSnackbar,
    });
}

export function successSnackbar(msg) {
    snackbar(msg, 'success');
}

export function errorSnackbar(msg) {
    snackbar(msg, 'error');
}
