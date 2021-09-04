import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
    createUser,
    retrieveUserByType,
    retrieveAllUsers,
    retrieveUserByAuthId,
    retrieveUserById,
    updateUser,
} from '../userDao';
import { User } from '../../schemas/userSchema';

let mongo;
let user1;
let user2;
let user3;

/**
 * Before all tests, create an in-memory MongoDB instance so we don't have to test on a real database,
 * then establish a mongoose connection to it.
 *
 * Also, start an express server running on port 3000, hosting the routes we wish to test.
 */
beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const connectionString = mongo.getUri();
    await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

/**
 * Before each test, intialize the database with some data
 */
beforeEach(async () => {
    const usersColl = await mongoose.connection.db.collection('users');

    user1 = {
        email: 'user1@gmail.com',
        currentRequestId: mongoose.Types.ObjectId('888888888888888888888888'),
        upi: 'dnut420',
        authUserId: '12345',
        firstName: 'Denise',
        lastName: 'Nuts',
        type: 'STUDENT',
    };

    user2 = {
        email: 'user2@gmail.com',
        upi: 'pbip069',
        authUserId: '088888',
        firstName: 'Pen',
        lastName: 'Biper',
        type: 'ADMIN',
    };

    user3 = {
        email: 'user3@gmail.com',
        upi: 'abel345',
        authUserId: '23423',
        firstName: 'Ale',
        lastName: 'Bell',
        type: 'STAFF',
    };

    await usersColl.insertMany([user1, user2]);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
    await mongoose.connection.db.dropCollection('users');
});

/**
 * After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

function expectDbUserMatchWithUser(dbUser, user) {
    expect(dbUser).toBeTruthy();
    expect(dbUser.email).toEqual(user.email);
    expect(dbUser.currentRequestId).toEqual(user.currentRequestId);
    expect(dbUser.upi).toEqual(user.upi);
    expect(dbUser.authUserId).toEqual(user.authUserId);
    expect(dbUser.firstName).toEqual(user.firstName);
    expect(dbUser.lastName).toEqual(user.lastName);
    expect(dbUser.type).toEqual(user.type);
}

it('get all users', async () => {
    const users = await retrieveAllUsers();

    expect(users).toBeTruthy();
    expect(users).toHaveLength(2);

    expectDbUserMatchWithUser(users[0], user1);
    expectDbUserMatchWithUser(users[1], user2);
});

it('create new user', async () => {
    const user = await createUser(user3);
    const dbUser = await User.findById(user._id);

    expectDbUserMatchWithUser(dbUser, user3);
});

it('retrieve a single user', async () => {
    const dbUser = await retrieveUserById(user1._id);

    expectDbUserMatchWithUser(dbUser, user1);
});

it('update user info', async () => {
    const updatedUser2Info = {
        type: 'ACADEMIC',
        currentRequestId: mongoose.Types.ObjectId('111111111111111111111111'),
    };

    await updateUser(user2._id, updatedUser2Info);

    const dbUser = await User.findById(user2._id);

    expect(dbUser).toBeTruthy();
    expect(dbUser.email).toEqual(user2.email);
    expect(dbUser.upi).toEqual(user2.upi);
    expect(dbUser.authUserId).toEqual(user2.authUserId);
    expect(dbUser.firstName).toEqual(user2.firstName);
    expect(dbUser.lastName).toEqual(user2.lastName);
    expect(dbUser.type).toEqual(updatedUser2Info.type);
    expect(dbUser.currentRequestId).toEqual(updatedUser2Info.currentRequestId);
});

it('retrieve user with auth id', async () => {
    const dbUser = await retrieveUserByAuthId(user1.authUserId);

    expectDbUserMatchWithUser(dbUser, user1);
});

it('try to retrieve user with invalid auth id', async () => {
    const dbUser = await retrieveUserByAuthId('invalidAuthId');

    expect(dbUser).toBeNull();
});

it('try to retrieve user with type', async () => {
    const studentUsers = await retrieveUserByType('STUDENT');

    expect(studentUsers).toBeTruthy();
    expect(studentUsers).toHaveLength(1);
    expectDbUserMatchWithUser(studentUsers[0], user1);
});
