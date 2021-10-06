import { archiveAllRequestsForWorkstation, retrieveRequestById } from './signUpRequestDao';
import { retrieveUserById } from './userDao';

const { Workstation } = require('../schemas/workstationSchema');

async function createWorkstation(workstation) {
    const dbWorkstation = new Workstation(workstation);
    await dbWorkstation.save();

    return dbWorkstation;
}

async function retrieveAllWorkstations() {
    return Workstation.find({});
}

async function retrieveWorkstationById(workstationId) {
    return Workstation.findById(workstationId);
}

async function retrieveWorkstationOfUser(userId) {
    const user = await retrieveUserById(userId);
    const requestId = user.currentRequestId;

    if (requestId) {
        const request = await retrieveRequestById(requestId);
        if (request.status === 'ACTIVE') {
            return Workstation.findById(request.allocatedWorkstationId);
        }
    }

    return null;
}

async function updateWorkstation(workstationId, newWorkstation) {
    await Workstation.findByIdAndUpdate(workstationId, newWorkstation, { new: true, useFindAndModify: false });
}

async function archiveWorkstation(workstationId) {
    const workstation = await Workstation.findById(workstationId);

    // archive all requests and bookings for this workstation
    await archiveAllRequestsForWorkstation(workstationId);

    await workstation.archive();
}

export {
    createWorkstation,
    retrieveAllWorkstations,
    retrieveWorkstationById,
    retrieveWorkstationOfUser,
    updateWorkstation,
    archiveWorkstation,
};
