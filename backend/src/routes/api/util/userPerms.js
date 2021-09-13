import { isAdmin, isSuperAdmin } from './userUtil';
import HTTP from './http_codes';

function resourceIsAllocatedToUser(currentRequest, resourceId) {
    return (
        currentRequest?.status === 'ACTIVE' &&
        currentRequest?.allocatedResourceId.toString() === resourceId
    );
}

function userHasResourceViewPerms(req) {
    const { currentRequestId } = req.user; // Populated current request
    return (
        resourceIsAllocatedToUser(currentRequestId, req.params.resourceId) ||
        isAdmin(req)
    );
}

function userHasBookingPerms(req) {
    const { currentRequestId } = req.user; // Populated current request
    return (
        resourceIsAllocatedToUser(currentRequestId, req.body.resourceId) ||
        isAdmin(req)
    );
}

async function userHasRequestViewPerms(req, res, next) {
    const { currentRequestId } = req.user; // Populated current request
    if (currentRequestId?._id?.toString() === req.params.requestId || isSuperAdmin(req)) {
        return next();
    }
    return res.status(HTTP.FORBIDDEN).send('Forbidden: user does not own request and is not SUPERADMIN');
}

export { userHasResourceViewPerms, userHasBookingPerms, userHasRequestViewPerms };
