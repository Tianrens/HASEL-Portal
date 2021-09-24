import { User } from '../schemas/userSchema';

async function countUsers() {
    return User.countDocuments();
}

async function createUser(user) {
    const dbUser = new User(user);
    await dbUser.save();

    return dbUser;
}

async function retrieveAllUsers() {
    return User.find({});
}

async function retrieveUsers(page, limit) {
    return User.find()
        .sort({ lastName: 1 }) // sort alphabetically by last name
        .skip(page > 0 ? (page - 1) * limit : 0)
        .limit(limit)
        .populate('currentRequestId');
}

async function retrieveUserById(userId) {
    return User.findById(userId).populate({
        path: 'currentRequestId',
        // also populate the workstation
        populate: { path: 'allocatedWorkstationId' },
    });
}

async function updateUser(userId, newUserInfo) {
    await User.updateOne({ _id: userId }, newUserInfo);
}

async function retrieveUserByAuthId(authId) {
    return User.findOne({ authUserId: authId }).populate({
        path: 'currentRequestId',
        // also populate the workstation
        populate: { path: 'allocatedWorkstationId' },
    });
}

async function retrieveUserByUpi(upi) {
    return User.findOne({ upi });
}

async function retrieveUserByType(userType) {
    return User.find({ type: userType });
}

export {
    countUsers,
    createUser,
    retrieveAllUsers,
    retrieveUserById,
    retrieveUsers,
    updateUser,
    retrieveUserByAuthId,
    retrieveUserByType,
    retrieveUserByUpi,
};
