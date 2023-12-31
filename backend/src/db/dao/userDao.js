import { User } from '../schemas/userSchema';
import { SignUpRequest } from '../schemas/signUpRequestSchema';

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

async function retrieveAllUsersCSV() {
    return User.find(
        {},
        'authUserId email upi firstName lastName type currentRequestId',
    ).populate({
        path: 'currentRequestId',
        select: ['status', 'startDate', 'endDate'],
        // also populate the workstation
        populate: {
            path: 'allocatedWorkstationId',
            select: ['name'],
        },
    });
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
    await User.updateOne({ _id: userId }, newUserInfo, {
        runValidators: true,
    });
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

async function removeRequestFromUser(userId) {
    await User.updateOne(
        { _id: userId },
        { $unset: { currentRequestId: null } },
    );
}

async function retrieveUsersBySearchQuery(searchParam, page, limit) {
    // Remove leading and trailing spaces, and make the search case insensitive
    const searchRegex = new RegExp(`^${searchParam.trim()}`, 'i');
    const results = await User.aggregate([
        {
            $addFields: {
                fullName: {
                    $concat: ['$firstName', ' ', '$lastName'],
                },
            },
        },
        {
            // check if the search query matches the firstname, lastname, upi or fullname of the user
            $match: {
                $or: [
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                    { upi: searchRegex },
                    { fullName: searchRegex },
                ],
            },
        },
        {
            // sort the results by the lastname
            $sort: { lastName: 1 },
        },
        {
            $facet: {
                users: [
                    { $skip: page > 0 ? (page - 1) * limit : 0 },
                    { $limit: limit },
                ],
                count: [
                    {
                        $count: 'count',
                    },
                ],
            },
        },
    ]);

    const matchingUsers = [];
    // if matching users are found, extract the total number of matching documents
    const count = results[0].count.length > 0 ? results[0].count[0].count : 0;

    results[0].users.forEach((user) => {
        matchingUsers.push(user);
    });

    await SignUpRequest.populate(matchingUsers, {
        path: 'currentRequestId',
    });

    return { matchingUsers, count };
}

export {
    countUsers,
    createUser,
    removeRequestFromUser,
    retrieveAllUsers,
    retrieveAllUsersCSV,
    retrieveUserById,
    retrieveUsers,
    updateUser,
    retrieveUserByAuthId,
    retrieveUserByType,
    retrieveUserByUpi,
    retrieveUsersBySearchQuery,
};
