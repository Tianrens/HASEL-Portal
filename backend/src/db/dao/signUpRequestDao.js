import { addDays, endOfDay, startOfDay } from 'date-fns';
import { User } from '../schemas/userSchema';

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
    await SignUpRequest.updateOne({ _id: requestId }, { status: newStatus });
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

/**
 * A request is expiring if it ends 7 days from now.
 * @returns
 */
async function retrieveExpiringRequests() {
    return SignUpRequest.find({
        status: 'ACTIVE',
        endDate: {
            $gte: startOfDay(addDays(new Date(), 7)), // 7 days in future
            $lte: endOfDay(addDays(new Date(), 7)), // Does not cross to the next day
        },
    }).populate('userId');
}

async function countRequests(status) {
    return SignUpRequest.countDocuments({ status });
}

async function retrieveRequestById(requestId) {
    return SignUpRequest.findById(requestId);
}

async function updateRequest(requestId, newRequestInfo) {
    await SignUpRequest.updateOne({ _id: requestId }, newRequestInfo);
}

async function setRequestEndDate(requestId, endDate) {
    const dbRequest = await SignUpRequest.findById(requestId);
    dbRequest.endDate = endDate;
    await dbRequest.save();
}

async function deleteRequest(requestId) {
    await SignUpRequest.deleteOne({ _id: requestId });
}

export {
    createSignUpRequest,
    updateRequestStatus,
    retrieveAllRequests,
    retrieveRequests,
    retrieveExpiringRequests,
    countRequests,
    retrieveRequestById,
    updateRequest,
    setRequestEndDate,
    deleteRequest,
};
