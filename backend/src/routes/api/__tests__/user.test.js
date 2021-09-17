import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import axios from 'axios';
import express from 'express';
import router from '../user';
import firebaseAuth from '../../../firebase/auth';
import { createSignUpRequest } from '../../../db/dao/signUpRequestDao';
import { Workstation } from '../../../db/schemas/workstationSchema';
import { SignUpRequest } from '../../../db/schemas/signUpRequestSchema';
import { User } from '../../../db/schemas/userSchema';
import HTTP from '../util/http_codes';
import { authRequest } from './util/authRequest';

let mongo;
let app;
let server;
let user1;
let user2;
let workstation1;
let request1;
let request2;

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
    const workstationsColl = await mongoose.connection.db.createCollection(
        'workstations',
    );
    await mongoose.connection.db.createCollection('signuprequests');

    user1 = new User({
        email: 'hungrymilk@auckland.ac.nz',
        upi: 'hmi123',
        authUserId: 'test1', // This should be set in backend but we'll do this for testing purposes
        firstName: 'Hungry',
        lastName: 'Milk',
        type: 'UNDERGRAD',
    });

    user2 = {
        email: 'tofupancake@aucklanduni.ac.nz',
        currentRequestId: mongoose.Types.ObjectId('404040404040'),
        upi: 'tpa987',
        firebaseToken: 'test2', // needs to be 'test' if you want it to pass, 'fail' if you want it to fail for the firebase mock.
        firstName: 'Tofu',
        lastName: 'Pancake',
        type: 'MASTERS',
    };

    workstation1 = new Workstation({
        name: 'Machine 1',
        host: '192.168.1.100',
        location: 'HASEL Lab',
        numGPUs: 2,
        gpuDescription: 'Nvidia GeForce RTX 2080',
        ramDescription: 'Kingston HyperX Predator 32GB',
        cpuDescription: 'Intel Core i9 10900KF',
    });

    request1 = new SignUpRequest({
        userId: user1._id,
        allocatedWorkstationId: workstation1._id,
        supervisorName: 'Reza Shahamiri',
        comments: 'Need to use the deep learning machines for part 4 project.',
        status: 'ACTIVE',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 29),
    });

    request2 = new SignUpRequest({
        userId: user1._id,
        allocatedWorkstationId: workstation1._id,
        supervisorName: 'Reza Shahamiri',
        comments: 'Need to use the deep learning machines for part 4 project.',
        status: 'DECLINED',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 29),
    });

    await usersColl.insertMany([user1]);
    await workstationsColl.insertOne(workstation1);
    await createSignUpRequest(request1);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.db.dropCollection('workstations');
    await mongoose.connection.db.dropCollection('signuprequests');
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

function expectResponseWorkstationSameAsDbWorkstation(
    responseWorkstation,
    dbWorkstation,
) {
    expect(responseWorkstation).toBeTruthy();
    expect(responseWorkstation.name).toEqual(dbWorkstation.name);
    expect(responseWorkstation.location).toEqual(dbWorkstation.location);
    expect(responseWorkstation.numGPUs).toEqual(dbWorkstation.numGPUs);
    expect(responseWorkstation.gpuDescription).toEqual(
        dbWorkstation.gpuDescription,
    );
    expect(responseWorkstation.ramDescription).toEqual(
        dbWorkstation.ramDescription,
    );
    expect(responseWorkstation.cpuDescription).toEqual(
        dbWorkstation.cpuDescription,
    );
}

it('create user', async () => {
    const response = await authRequest(
        userApiUrl,
        'POST',
        user2.firebaseToken,
        user2,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED);
    expectResponseUserSameAsRequestUser(response.data, user2);
});

it("retrieve user's workstation", async () => {
    const response = await axios.get(`${userApiUrl}/workstation`, {
        headers: {
            authorization: `Bearer ${user1.authUserId}`,
        },
    });
    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.OK);
    const userWorkstation = response.data;

    expectResponseWorkstationSameAsDbWorkstation(userWorkstation, workstation1);
});

it("retrieve user's workstation with declined request", async () => {
    await createSignUpRequest(request2);

    const response = await authRequest(
        `${userApiUrl}/workstation`,
        'GET',
        user1.authUserId,
    );

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.BAD_REQUEST);
});
