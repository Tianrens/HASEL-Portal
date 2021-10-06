import { addDays, endOfDay, startOfDay } from 'date-fns';
import { User } from '../schemas/userSchema';
import { archiveAllBookingsForUser } from './bookingDao';
import { removeRequestFromUser } from './userDao';

const { SignUpRequest } = require('../schemas/signUpRequestSchema');

async function createSignUpRequest(signUpRequest) {
    const dbSignUpRequest = new SignUpRequest(signUpRequest);
    await dbSignUpRequest.save();

    const dbUser = await User.findById(signUpRequest.userId);
    dbUser.currentRequestId = dbSignUpRequest._id;
    await dbUser.save();

    return dbSignUpRequest;
}

async function updateRequestStatus(requestId, newStatus) {
    await SignUpRequest.updateOne(
        { _id: requestId },
        { status: newStatus },
        { runValidators: true },
    );
}

async function retrieveAllRequests() {
    return SignUpRequest.find({});
}

async function retrieveRequests(status, page, limit) {
    return SignUpRequest.find({ status })
        .sort({ createdAt: -1 }) // Reverse chronological ie latest first
        .skip(page > 0 ? (page - 1) * limit : 0) // Skips start at 0, pages start at 1
        .limit(limit)
        .populate('userId', 'email upi firstName lastName type');
}

async function retrieveRequestsByStatus(status) {
    return SignUpRequest.find({ status })
        .populate('userId', 'upi')
        .populate('allocatedWorkstationId', 'host');
}

async function retrieveExpiringRequests(daysBefore) {
    return SignUpRequest.find({
        status: 'ACTIVE',
        endDate: {
            $gte: startOfDay(new Date()),
            $lte: endOfDay(addDays(new Date(), daysBefore)), // Does not cross to the next day
        },
        notifiedExpiring: { $in: [false, null] },
    }).populate('userId');
}

async function setRequestNotifiedExpiring(requestId, isNotified) {
    const dbRequest = await SignUpRequest.findById(requestId);
    dbRequest.notifiedExpiring = isNotified;
    await dbRequest.save();
}

async function countRequests(status) {
    return SignUpRequest.countDocuments({ status });
}

async function retrieveRequestById(requestId) {
    return SignUpRequest.findById(requestId).populate(
        'userId',
        'email upi firstName lastName type',
    );
}

async function updateRequest(requestId, newRequestInfo) {
    await SignUpRequest.updateOne({ _id: requestId }, newRequestInfo, {
        runValidators: true,
    });
}

async function setRequestEndDate(requestId, endDate) {
    const dbRequest = await SignUpRequest.findById(requestId);
    dbRequest.endDate = endDate;
    await dbRequest.save();
}

async function archiveRequest(requestId) {
    const request = await SignUpRequest.findById(requestId);
    await removeRequestFromUser(request.userId);
    await archiveAllBookingsForUser(request.userId);
    await request.archive();
}

async function retrieveAllUsersOfWorkstation(workstationId) {
    return SignUpRequest.aggregate([
        {
            '$lookup': {
                'from': 'workstations',
                'localField': 'allocatedWorkstationId',
                'foreignField': '_id',
                'as': 'allocatedWorkstationId',
            }
        },
        {
            '$unwind': '$allocatedWorkstationId'
        },
        {
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'userId',
            }
        },
        {
            '$unwind': '$userId'
        },
        {
            '$match': { 'allocatedWorkstationId._id': workstationId, 'status': 'ACTIVE'}
        }
    ]);
}

async function archiveAllRequestsForWorkstation(workstationId) {
    const requests = await SignUpRequest.find({ allocatedWorkstationId: workstationId });
    requests.forEach(async (request) => {
        await archiveRequest(request);
    });
}

export {
    createSignUpRequest,
    updateRequestStatus,
    retrieveAllRequests,
    retrieveRequests,
    retrieveRequestsByStatus,
    retrieveExpiringRequests,
    setRequestNotifiedExpiring,
    countRequests,
    retrieveRequestById,
    updateRequest,
    setRequestEndDate,
    archiveRequest,
    retrieveAllUsersOfWorkstation,
    archiveAllRequestsForWorkstation,
};
