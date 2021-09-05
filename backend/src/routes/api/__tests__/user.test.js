import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import axios from 'axios';
import express from 'express';
import router from '../user';
import firebaseAuth from '../../../firebase/auth';

let mongo;
let app;
let server;
let user1;
let user2;

jest.mock('../../../firebase/index.js');
const userApiUrl = 'http://localhost:3000/api/user';

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

    app = express();
    app.use(express.json());
    app.use('/api/user', firebaseAuth, router);
    server = app.listen(3000);
});

/**
 * Before each test, intialize the database with some data
 */
beforeEach(async () => {
    const usersColl = await mongoose.connection.db.createCollection('users');

    user1 = {
        email: 'hungrymilk@auckland.ac.nz',
        currentRequestId: mongoose.Types.ObjectId('123456789012'),
        upi: 'hmi123',
        authUserId: '12345', // This should be set in backend but we'll do this for testing purposes
        firstName: 'Hungry',
        lastName: 'Milk',
        type: 'ADMIN',
    };

    user2 = {
        email: 'tofupancake@aucklanduni.ac.nz',
        currentRequestId: mongoose.Types.ObjectId('404040404040'),
        upi: 'tpa987',
        firebaseToken: 'test', // needs to be 'test' if you want it to pass, 'fail' if you want it to fail for the firebase mock.
        firstName: 'Tofu',
        lastName: 'Pancake',
        type: 'MASTERS',
    };

    await usersColl.insertOne(user1);
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
    server.close();
});

function expectResponseUserSameAsRequestUser(responseUser, requestUser) {
    expect(responseUser.email).toBeDefined();
    expect(responseUser.upi).toEqual(requestUser.upi);
    expect(responseUser.authUserId).toBeDefined(); // this is defined in the backend
    expect(responseUser.firstName).toEqual(requestUser.firstName);
    expect(responseUser.lastName).toEqual(requestUser.lastName);
    expect(responseUser.type).toEqual(requestUser.type);
}

it('create user', async () => {
    const response = await axios.post(userApiUrl, user2, {
        headers: {
            authorization: `Bearer ${user2.firebaseToken}`,
        },
    });

    expect(response).toBeDefined();
    expectResponseUserSameAsRequestUser(response.data, user2);
});
