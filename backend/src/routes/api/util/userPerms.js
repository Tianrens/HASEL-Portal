import { isAdmin, isSuperAdmin } from './userUtil';
import HTTP from './http_codes';

function workstationIsAllocatedToUser(currentRequest, workstationId) {
    return (
        currentRequest?.status === 'ACTIVE' &&
        currentRequest?.allocatedWorkstationId._id.toString() === workstationId
    );
}

// Checks if the current user is an admin or above
// Should always be called after getUser
async function checkAdmin(req, res, next) {
    if (isAdmin(req)) {
        return next();
    }
    return res.status(HTTP.FORBIDDEN).send('Forbidden: ADMINs only');
}

// Checks if the current user is a superadmin
// Should always be called after getUser
async function checkSuperAdmin(req, res, next) {
    if (isSuperAdmin(req)) {
        return next();
    }
    return res.status(HTTP.FORBIDDEN).send('Forbidden: SUPERADMINs only');
}

function userHasWorkstationViewPerms(req, res, next) {
    const { currentRequestId } = req.user; // Populated current request
    if (
        workstationIsAllocatedToUser(
            currentRequestId,
            req.params.workstationId,
        ) ||
        isAdmin(req)
    ) {
        return next();
    }
    return res
        .status(HTTP.FORBIDDEN)
        .send('No permission to view this workstation');
}

// Should be called after getBooking, if booking exists in db
function userHasBookingPerms(req, res, next) {
    const { currentRequestId } = req.user; // Populated current request
    if (!req.booking) {
        // There is no booking in db currently
        if (
            workstationIsAllocatedToUser(
                currentRequestId,
                req.body.workstationId,
            ) ||
            isAdmin(req)
        ) {
            return next();
        }
    } else if (req.user._id.equals(req.booking.userId) || isAdmin(req)) {
        return next();
    }

    return res
        .status(HTTP.FORBIDDEN)
        .send('No permission to view this workstation');
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
    checkAdmin,
    checkSuperAdmin,
    userHasWorkstationViewPerms,
    userHasBookingPerms,
    userHasRequestViewPerms,
};
