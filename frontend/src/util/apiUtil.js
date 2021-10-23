import { authRequest } from '../hooks/util/authRequest';
import { errorSnackbar, successSnackbar } from './SnackbarUtil';

function capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function returnError(err) {
    try {
        if (Object.keys(err.response.data).length === 0) {
            errorSnackbar(err.response.statusText);
        } else {
            errorSnackbar(err.response.data);
        }
    } catch {
        errorSnackbar('An error has occured');
    }
}

/**
 * @param resourceString is a string that describes the object to perform operations on.
 *                 for instance, 'workstation' or 'booking'
 */
function postUtil(resourceString, resourceState, cb, altMessage) {
    return async () => {
        try {
            await authRequest(`/api/${resourceString}/`, 'POST', resourceState);
            successSnackbar(altMessage || `${capitalise(resourceString)} created`);
            cb();
        } catch (err) {
            returnError(err);
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
            returnError(err);
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
            returnError(err);
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
            returnError(err);
        }
    };
}

export { postUtil, deleteUtil, putUtil, patchUtil };
