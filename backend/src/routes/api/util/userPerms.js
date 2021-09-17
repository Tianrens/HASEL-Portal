import { isAdmin, isSuperAdmin } from './userUtil';
import HTTP from './http_codes';

function workstationIsAllocatedToUser(currentRequest, workstationId) {
    return (
        currentRequest?.status === 'ACTIVE' &&
        currentRequest?.allocatedWorkstationId.toString() === workstationId
    );
}

function userHasWorkstationViewPerms(req) {
    const { currentRequestId } = req.user; // Populated current request
    return (
        workstationIsAllocatedToUser(
            currentRequestId,
            req.params.workstationId,
        ) || isAdmin(req)
    );
}

function userHasBookingPerms(req) {
    const { currentRequestId } = req.user; // Populated current request
    return (
        workstationIsAllocatedToUser(
            currentRequestId,
            req.body.workstationId,
        ) || isAdmin(req)
    );
}

async function userHasRequestViewPerms(req, res, next) {
    const { currentRequestId } = req.user; // Populated current request
    if (
        currentRequestId?._id?.toString() === req.params.requestId ||
        isSuperAdmin(req)
    ) {
        return next();
    }
    return res
        .status(HTTP.FORBIDDEN)
        .send('Forbidden: user does not own request and is not SUPERADMIN');
}

export {
    userHasWorkstationViewPerms,
    userHasBookingPerms,
    userHasRequestViewPerms,
};
