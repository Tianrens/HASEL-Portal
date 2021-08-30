import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import axios from 'axios';
import express from 'express';
import router from '../request';
import firebaseAuth from '../../../firebase/auth';
import { User } from '../../../db/schemas/userSchema';

let mongo;
let app;
let server;
let request1;
let request2;
let request3;
let request4;
let user1;

const TOKEN_PASS = 'test';
const TOKEN_FAIL = 'fail';
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_FORBIDDEN = 403;

jest.mock('../../../firebase/index.js');
const requestApiUrl = 'http://localhost:3000/api/request';

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
    app.use('/api/request', firebaseAuth, router);
    server = app.listen(3000);
});

/**
 * Before each test, intialize the database with some data
 */
beforeEach(async () => {
    const usersColl = await mongoose.connection.db.collection('users');
    const signUpRequestsColl = await mongoose.connection.db.collection(
        'signuprequests',
    );

    // Need to use user constructor to obtain _id value
    user1 = new User({
        email: 'user1@gmail.com',
        upi: 'dnut420',
        authUserId: 'test',
        firstName: 'Denise',
        lastName: 'Nuts',
        type: 'STUDENT',
    });

    request1 = {
        userId: mongoose.Types.ObjectId('888888888888888888888888'),
        allocatedResourceId: mongoose.Types.ObjectId(
            '666666666666666666666666',
        ),
        supervisorName: 'Reza Shahamiri',
        comments: 'Need to use the deep learning machines for part 4 project.',
        status: 'PENDING',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 19),
    };

    request2 = {
        userId: mongoose.Types.ObjectId('999999999999999999999999'),
        allocatedResourceId: mongoose.Types.ObjectId(
            '555555555555555555555555',
        ),
        supervisorName: 'Andrew Meads',
        comments: 'Need access to the HASEL Lab machines for PhD research',
        status: 'ACTIVE',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 29),
    };

    request3 = {
        userId: user1._id,
        allocatedResourceId: mongoose.Types.ObjectId(
            '444444444444444444444444',
        ),
        supervisorName: 'Nasser Giacaman',
        status: 'PENDING', // status always pending on creation
    };

    request4 = {
        userId: 'AN INVALID USERID',
        allocatedResourceId: mongoose.Types.ObjectId(
            '444444444444444444444444',
        ),
        supervisorName: 'Nasser Giacaman',
        status: 'PENDING', // status always pending on creation
    };

    await usersColl.insertOne(user1);
    await signUpRequestsColl.insertMany([request1, request2]);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
    await mongoose.connection.db.dropCollection('users');
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

function expectDbRequestMatchWithRequest(responseRequest, requestRequest) {
    expect(responseRequest).toBeTruthy();
    expect(responseRequest.userId.toString()).toEqual(
        requestRequest.userId.toString(),
    );
    expect(responseRequest.allocatedResourceId.toString()).toEqual(
        requestRequest.allocatedResourceId.toString(),
    );
    expect(responseRequest.supervisorName).toEqual(
        requestRequest.supervisorName,
    );
    if (responseRequest.comments) {
        expect(responseRequest.comments).toEqual(requestRequest.comments);
    }
    expect(responseRequest.status).toEqual(requestRequest.status);
}

it('create request success', async () => {
    const response = await axios.post(requestApiUrl, request3, {
        headers: {
            authorization: `Bearer ${TOKEN_PASS}`,
        },
    });

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP_CREATED);
    expectDbRequestMatchWithRequest(response.data, request3);
});

it('create request bad token', async () => {
    try {
        await axios.post(requestApiUrl, request3, {
            headers: {
                authorization: `Bearer ${TOKEN_FAIL}`,
            },
        });
    } catch (err) {
        expect(err.response.status).toEqual(HTTP_FORBIDDEN);
    }
});

it('create request bad request', async () => {
    try {
        await axios.post(requestApiUrl, request4, {
            headers: {
                authorization: `Bearer ${TOKEN_PASS}`,
            },
        });
    } catch (err) {
        expect(err.response.status).toEqual(HTTP_BAD_REQUEST);
    }
});
