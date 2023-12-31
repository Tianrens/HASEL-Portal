import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
    countUsers,
    createUser,
    retrieveAllUsers,
    retrieveAllUsersCSV,
    retrieveUserByAuthId,
    retrieveUserById,
    retrieveUserByType,
    retrieveUserByUpi,
    retrieveUsers,
    retrieveUsersBySearchQuery,
    updateUser,
} from '../userDao';
import { User } from '../../schemas/userSchema';
import { SignUpRequest } from '../../schemas/signUpRequestSchema';
import { Workstation } from '../../schemas/workstationSchema';

let mongo;
let request1;
let user1;
let user2;
let user3;
let user4;
let workstation1;

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
    const signUpRequestsColl = await mongoose.connection.db.collection(
        'signuprequests',
    );
    const workstationsColl = await mongoose.connection.db.collection(
        'workstations',
    );

    user1 = new User({
        email: 'user1@gmail.com',
        upi: 'dnut420',
        authUserId: '12345',
        firstName: 'Denise',
        lastName: 'Nuts',
        type: 'UNDERGRAD',
    });

    request1 = new SignUpRequest({
        userId: user1._id,
        allocatedWorkstationId: mongoose.Types.ObjectId(
            '666666666666666666666666',
        ),
        supervisorName: 'Reza Shahamiri',
        comments: 'Need to use the deep learning machines for part 4 project.',
        status: 'PENDING',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 19),
    });

    workstation1 = new Workstation({
        name: 'Machine 1',
        host: '192.168.1.100',
        location: 'HASEL Lab',
        numGPUs: 2,
        gpuDescription: 'Nvidia GeForce RTX 2080',
        ramDescription: 'Kingston HyperX Predator 32GB',
        cpuDescription: 'Intel Core i9 10900KF',
        status: false,
    });

    user1.currentRequestId = request1._id;
    request1.allocatedWorkstationId = workstation1._id;

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
        type: 'NON_ACADEMIC_STAFF',
    };

    user4 = {
        email: 'user4@gmail.com',
        upi: 'dgar146',
        authUserId: '513567',
        firstName: 'Denlop',
        lastName: 'Garfield',
        type: 'UNDERGRAD',
    };

    await usersColl.insertMany([user1, user2]);
    await signUpRequestsColl.insertOne(request1);
    await workstationsColl.insertOne(workstation1);
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
    if (dbUser.currentRequestId) {
        // Should only run if the currentRequestId exists, in which case it should be populated
        expect(dbUser.currentRequestId._id).toEqual(user.currentRequestId);
    } else {
        // Otherwise check if they are both empty
        expect(dbUser.currentRequestId).toEqual(user.currentRequestId);
    }
    expect(dbUser.upi).toEqual(user.upi);
    expect(dbUser.authUserId).toEqual(user.authUserId);
    expect(dbUser.firstName).toEqual(user.firstName);
    expect(dbUser.lastName).toEqual(user.lastName);
    expect(dbUser.type).toEqual(user.type);
}

function checkSuccessfulUserTypeChange(newUser, oldUser, newType) {
    expect(newUser.email).toEqual(oldUser.email);
    expect(newUser.upi).toEqual(oldUser.upi);
    expect(newUser.authUserId).toEqual(oldUser.authUserId);
    expect(newUser.firstName).toEqual(oldUser.firstName);
    expect(newUser.lastName).toEqual(oldUser.lastName);
    expect(newUser.currentBooking).toEqual(oldUser.currentRequestId);
    expect(newUser.type).toEqual(newType);
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

it('create new user', async () => {
    user3.type = 'INVALID';
    try {
        await createUser(user3);
    } catch (error) {
        expect(error.name).toEqual('ValidationError');
    }
});

it('retrieve a single user', async () => {
    const dbUser = await retrieveUserById(user1._id);

    expectDbUserMatchWithUser(dbUser, user1);
});

it('update user type', async () => {
    const updatedUser2Info = {
        type: 'ACADEMIC_STAFF',
    };

    await updateUser(user2._id, updatedUser2Info);

    const dbUser = await User.findById(user2._id);

    expect(dbUser).toBeTruthy();
    checkSuccessfulUserTypeChange(dbUser, user2, updatedUser2Info.type);
});

it('update user type - invalid type', async () => {
    const updatedUser2Info = {
        type: 'INVALID',
    };

    try {
        await updateUser(user2._id, updatedUser2Info);
    } catch (error) {
        expect(error.name).toEqual('ValidationError');
    }
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
    const studentUsers = await retrieveUserByType('UNDERGRAD');

    expect(studentUsers).toBeTruthy();
    expect(studentUsers).toHaveLength(1);
    expectDbUserMatchWithUser(studentUsers[0], user1);
});

it('count all users', async () => {
    const count = await countUsers();

    expect(count).toBeTruthy();
    expect(count).toEqual(2);
});

it('count all users when there are no users', async () => {
    const usersColl = mongoose.connection.db.collection('users');
    usersColl.deleteMany();

    const count = await countUsers();

    expect(count).toEqual(0);
});

it('retrieve all users', async () => {
    const page = 1;
    const limit = 3;

    const users = await retrieveUsers(page, limit);

    expect(users).toBeTruthy();
    expect(users).toHaveLength(2);

    expectDbUserMatchWithUser(users[0], user2);
    expectDbUserMatchWithUser(users[1], user1);
});

it('retrieve users with pagination', async () => {
    let page = 1;
    const limit = 1;

    const firstPageUsers = await retrieveUsers(page, limit);

    expect(firstPageUsers).toBeTruthy();
    expect(firstPageUsers).toHaveLength(1);
    expectDbUserMatchWithUser(firstPageUsers[0], user2);

    page = 2;
    const secondPageUsers = await retrieveUsers(page, limit);

    expect(secondPageUsers).toBeTruthy();
    expect(secondPageUsers).toHaveLength(1);
    expectDbUserMatchWithUser(secondPageUsers[0], user1);
});

it('retrieve users with page more than the maximum number of pages', async () => {
    const page = 3;
    const limit = 2;

    const users = await retrieveUsers(page, limit);

    expect(users).toHaveLength(0);
});

it('retrieve users with a larger limit than the amount of users', async () => {
    const page = 1;
    const limit = 5;

    const users = await retrieveUsers(page, limit);

    expect(users).toBeTruthy();
    expect(users).toHaveLength(2);

    expectDbUserMatchWithUser(users[0], user2);
    expectDbUserMatchWithUser(users[1], user1);
});

it('retrieve user by upi', async () => {
    const user = await retrieveUserByUpi('pbip069');

    expect(user).toBeTruthy();
    expectDbUserMatchWithUser(user, user2);
});

it('retrieve users by partial firstname', async () => {
    const page = 1;
    const limit = 3;
    const searchParam = 'pe';

    const result = await retrieveUsersBySearchQuery(searchParam, page, limit);

    const { matchingUsers } = result;
    const totalMatchesCount = result.count;

    expect(matchingUsers).toBeTruthy();
    expect(matchingUsers).toHaveLength(1);
    expect(totalMatchesCount).toBe(1);

    expectDbUserMatchWithUser(matchingUsers[0], user2);
});

it('retrieve users by partial lastname', async () => {
    const page = 1;
    const limit = 3;
    const searchParam = 'nut';

    const result = await retrieveUsersBySearchQuery(searchParam, page, limit);

    const { matchingUsers } = result;
    const totalMatchesCount = result.count;

    expect(matchingUsers).toBeTruthy();
    expect(matchingUsers).toHaveLength(1);
    expect(totalMatchesCount).toBe(1);

    expectDbUserMatchWithUser(matchingUsers[0], user1);
});

it('retrieve users by partial fullname', async () => {
    const page = 1;
    const limit = 3;
    const searchParam = 'denise nu';

    const result = await retrieveUsersBySearchQuery(searchParam, page, limit);

    const { matchingUsers } = result;
    const totalMatchesCount = result.count;

    expect(matchingUsers).toBeTruthy();
    expect(matchingUsers).toHaveLength(1);
    expect(totalMatchesCount).toBe(1);

    expectDbUserMatchWithUser(matchingUsers[0], user1);
});

it('retrieve users by partial upi', async () => {
    const page = 1;
    const limit = 3;
    const searchParam = 'pbi';

    const result = await retrieveUsersBySearchQuery(searchParam, page, limit);

    const { matchingUsers } = result;
    const totalMatchesCount = result.count;

    expect(matchingUsers).toBeTruthy();
    expect(matchingUsers).toHaveLength(1);
    expect(totalMatchesCount).toBe(1);
    expectDbUserMatchWithUser(matchingUsers[0], user2);
});

it('retrieve users by search query with pagination', async () => {
    await createUser(user4);

    let page = 1;
    const limit = 1;
    const searchParam = 'Den';

    const firstPageResult = await retrieveUsersBySearchQuery(
        searchParam,
        page,
        limit,
    );

    const firstPageUsers = firstPageResult.matchingUsers;
    const totalMatchesCount1 = firstPageResult.count;

    expect(firstPageUsers).toBeTruthy();
    expect(firstPageUsers).toHaveLength(1);
    expect(totalMatchesCount1).toBe(2);
    expectDbUserMatchWithUser(firstPageUsers[0], user4);

    page = 2;
    const secondPageResult = await retrieveUsersBySearchQuery(
        searchParam,
        page,
        limit,
    );

    const secondPageUsers = secondPageResult.matchingUsers;
    const totalMatchesCount2 = secondPageResult.count;

    expect(secondPageUsers).toBeTruthy();
    expect(secondPageUsers).toHaveLength(1);
    expect(totalMatchesCount2).toBe(2);
    expectDbUserMatchWithUser(secondPageUsers[0], user1);
});

it('retrieve users by search query with page more than the maximum number of pages', async () => {
    const page = 3;
    const limit = 2;
    const searchParam = 'Den';

    const result = await retrieveUsersBySearchQuery(searchParam, page, limit);
    const users = result.matchingUsers;
    const totalMatchesCount = result.count;

    expect(users).toHaveLength(0);
    expect(totalMatchesCount).toBe(1);
});

it('retrieve users by search query with a larger limit than the amount of users', async () => {
    await createUser(user4);

    const page = 1;
    const limit = 5;
    const searchParam = 'de';

    const result = await retrieveUsersBySearchQuery(searchParam, page, limit);
    const users = result.matchingUsers;
    const totalMatchesCount = result.count;

    expect(users).toBeTruthy();
    expect(users).toHaveLength(2);
    expect(totalMatchesCount).toBe(2);

    expectDbUserMatchWithUser(users[0], user4);
    expectDbUserMatchWithUser(users[1], user1);
});

it('retrieve users by search query with no matching results', async () => {
    const page = 1;
    const limit = 2;
    const searchParam = 'giga';

    const result = await retrieveUsersBySearchQuery(searchParam, page, limit);
    const users = result.matchingUsers;
    const totalMatchesCount = result.count;

    expect(users).toBeTruthy();
    expect(users).toHaveLength(0);
    expect(totalMatchesCount).toBe(0);
});

it('retrieve all users for CSV download', async () => {
    const users = await retrieveAllUsersCSV();

    expect(users).toBeTruthy();
    expect(users).toHaveLength(2);

    expectDbUserMatchWithUser(users[0], user1);
    expectDbUserMatchWithUser(users[1], user2);
});
