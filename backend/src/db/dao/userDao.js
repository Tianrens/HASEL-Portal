import { User } from '../schemas/userSchema';

async function createUser(user) {
    const dbUser = new User(user);
    await dbUser.save();

    return dbUser;
}

async function retrieveAllUsers() {
    return User.find({});
}

async function retrieveUserById(userId) {
    return User.findById(userId);
}

async function updateUser(userId, newUserInfo) {
    await User.updateOne({ _id: userId }, newUserInfo);
}

async function retrieveUserByAuthId(authId) {
    return User.findOne({ authUserId: authId });
}

async function retrieveUserByType(userType) {
    return User.find({ type: userType });
}

export { createUser, retrieveAllUsers, retrieveUserById, updateUser, retrieveUserByAuthId, retrieveUserByType };
