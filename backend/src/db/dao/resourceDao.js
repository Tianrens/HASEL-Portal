import { retrieveUserById } from './userDao';
import { retrieveRequestById } from './signUpRequestDao';

const { Resource } = require('../schemas/resourceSchema');

async function createResource(resource) {
    const dbResource = new Resource(resource);
    await dbResource.save();

    return dbResource;
}

async function retrieveAllResources() {
    return Resource.find({});
}

async function retrieveResourceOfUser(userId) {
    const user = await retrieveUserById(userId);
    const requestId = user.currentRequestId;

    if (requestId) {
        const request = await retrieveRequestById(requestId);
        if (request.status === 'ACTIVE') {
            return Resource.findById(request.allocatedResourceId);
        }
    }

    return null;
}

async function deleteResource(resourceId) {
    await Resource.deleteOne({ _id: resourceId });
}

export {
    createResource,
    retrieveAllResources,
    retrieveResourceOfUser,
    deleteResource,
};