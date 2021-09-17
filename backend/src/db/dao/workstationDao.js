import { retrieveRequestById } from './signUpRequestDao';
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

async function deleteWorkstation(workstationId) {
    await Workstation.deleteOne({ _id: workstationId });
}

export {
    createWorkstation,
    retrieveAllWorkstations,
    retrieveWorkstationById,
    retrieveWorkstationOfUser,
    deleteWorkstation,
};
