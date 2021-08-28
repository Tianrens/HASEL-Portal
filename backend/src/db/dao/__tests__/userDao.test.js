import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
    createUser,
    retrieveAllUsers,
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
    const usersColl = await mongoose.connection.db.createCollection('users');

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

it('get all users', async () => {
    const users = await retrieveAllUsers();

    expect(users).toBeTruthy();
    expect(users).toHaveLength(2);

    expect(users[0].email).toBe(user1.email);
    expect(users[0].currentRequestId).toEqual(user1.currentRequestId);
    expect(users[0].upi).toBe(user1.upi);
    expect(users[0].authUserId).toBe(user1.authUserId);
    expect(users[0].firstName).toBe(user1.firstName);
    expect(users[0].lastName).toBe(user1.lastName);
    expect(users[0].type).toBe(user1.type);

    expect(users[1].email).toBe(user2.email);
    expect(users[1].currentRequestId).toBeUndefined();
    expect(users[1].upi).toBe(user2.upi);
    expect(users[1].authUserId).toBe(user2.authUserId);
    expect(users[1].firstName).toBe(user2.firstName);
    expect(users[1].lastName).toBe(user2.lastName);
    expect(users[1].type).toBe(user2.type);
});

it('create new user', async () => {
    const user = await createUser(user3);
    const dbUser = await User.findById(user._id);

    expect(dbUser).toBeTruthy();
    expect(dbUser.email).toEqual(user3.email);
    expect(dbUser.upi).toEqual(user3.upi);
    expect(dbUser.authUserId).toEqual(user3.authUserId);
    expect(dbUser.firstName).toEqual(user3.firstName);
    expect(dbUser.lastName).toEqual(user3.lastName);
    expect(dbUser.type).toEqual(user3.type);
});

it('retrieve a single user', async () => {
    const dbUser = await retrieveUserById(user1._id);

    expect(dbUser.email).toEqual(user1.email);
    expect(dbUser.currentRequestId).toEqual(user1.currentRequestId);
    expect(dbUser.upi).toEqual(user1.upi);
    expect(dbUser.authUserId).toEqual(user1.authUserId);
    expect(dbUser.firstName).toEqual(user1.firstName);
    expect(dbUser.lastName).toEqual(user1.lastName);
    expect(dbUser.type).toEqual(user1.type);
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
