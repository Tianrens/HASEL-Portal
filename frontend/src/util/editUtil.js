import { authRequest } from '../hooks/util/authRequest';
import { errorSnackbar, successSnackbar } from './SnackbarUtil';

function capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * @param resource is a string that describes the object to perform operations on.
 *                 for instance, 'workstation' or 'booking'
 */
function onDelete(resource, id, history) {
    return async () => {
        try {
            await authRequest(`/api/${resource}/${id}`, 'DELETE');
            successSnackbar(`${capitalise(resource)} deleted successfully`);
            history.goBack();
        } catch (err) {
            errorSnackbar(err.response.data);
        }
    };
}

/**
 * @param resource is a string that describes the object to perform operations on.
 *  *              for instance, 'workstation' or 'booking'
 */
function onAcceptChanges(resource, resourceState, id, history) {
    return async () => {
        try {
            await authRequest(`/api/${resource}/${id}`, 'PUT', {
                ...resourceState,
            });
            successSnackbar(`${capitalise(resource)} updated successfully`);
            history.goBack();
        } catch (err) {
            errorSnackbar(err.response.data);
        }
    };
}

export { onDelete, onAcceptChanges };
