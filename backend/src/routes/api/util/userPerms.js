import { isAdmin } from './userUtil';

function resourceIsAllocatedToUser(currentRequest, resourceId) {
    return currentRequest?.status === 'ACTIVE' && 
        currentRequest?.allocatedResourceId.toString() === resourceId;
}

function userHasResourceViewPerms(req) {
    const { currentRequestId } = req.user; // Populated current request
    return resourceIsAllocatedToUser(currentRequestId, req.params.resourceId) || isAdmin(req);
}

export { userHasResourceViewPerms };
