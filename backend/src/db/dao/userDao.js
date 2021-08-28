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

export { createUser, retrieveAllUsers, retrieveUserById, updateUser };
