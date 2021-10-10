import { authRequest } from '../hooks/util/authRequest';
import { errorSnackbar, successSnackbar } from './SnackbarUtil';

function capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * @param resourceString is a string that describes the object to perform operations on.
 *                 for instance, 'workstation' or 'booking'
 */
function postUtil(resourceString, resourceState, cb) {
    return async () => {
        try {
            await authRequest(`/api/${resourceString}/`, 'POST', resourceState);
            successSnackbar(`${capitalise(resourceString)} created`);
            cb();
        } catch (err) {
            errorSnackbar(err.response.data);
        }
    };
}

/**
 * @param resourceString is a string that describes the object to perform operations on.
 *                 for instance, 'workstation' or 'booking'
 */
function deleteUtil(resourceString, id, cb) {
    return async () => {
        try {
            await authRequest(`/api/${resourceString}/${id}`, 'DELETE');
            successSnackbar(`${capitalise(resourceString)} deleted successfully`);
            cb();
        } catch (err) {
            errorSnackbar(err.response.data);
        }
    };
}

/**
 * @param resourceString is a string that describes the object to perform operations on.
 *  *              for instance, 'workstation' or 'booking'
 */
function putUtil(resourceString, resourceState, id, cb) {
    return async () => {
        try {
            await authRequest(`/api/${resourceString}/${id}`, 'PUT', resourceState);
            successSnackbar(`Updated ${capitalise(resourceString)} successfully`);
            cb();
        } catch (err) {
            errorSnackbar(err.response.data);
        }
    };
}

/**
 * @param resourceString is a string that describes the object to perform operations on.
 *  *              for instance, 'workstation' or 'booking'
 */
function patchUtil(resourceString, resourceState, id, cb) {
    return async () => {
        try {
            await authRequest(`/api/${resourceString}/${id}`, 'PATCH', resourceState);
            successSnackbar(`Updated ${capitalise(resourceString)} successfully`);
            cb();
        } catch (err) {
            errorSnackbar(err.response.data);
        }
    };
}

export { postUtil, deleteUtil, putUtil, patchUtil };