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
let user2;

const TOKEN_PASS = 'test';
const TOKEN_FAIL = 'fail';

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_FORBIDDEN = 403;

jest.mock('../../../firebase/index.js');
const REQUEST_API_URL = 'http://localhost:3000/api/request';

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
        authUserId: 'test1',
        firstName: 'Denise',
        lastName: 'Nuts',
        type: 'STUDENT',
    });

    user2 = new User({
        email: 'rezabuff@gmail.com',
        upi: 'reza420',
        authUserId: 'test2',
        firstName: 'Reza',
        lastName: 'Buff',
        type: 'SUPERADMIN',
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
        userId: mongoose.Types.ObjectId('111111111111111111111111'),
        allocatedResourceId: mongoose.Types.ObjectId(
            '555555555555555555555555',
        ),
        supervisorName: 'Meads Andrew',
        comments: 'Need access to the LESAH Lab machines for PhD research',
        status: 'ACTIVE',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 29),
    };

    request4 = {
        userId: user1._id,
        allocatedResourceId: mongoose.Types.ObjectId(
            '444444444444444444444444',
        ),
        supervisorName: 'Nasser Giacaman',
        status: 'PENDING', // status always pending on creation
    };

    await usersColl.insertMany([user1, user2]);
    await signUpRequestsColl.insertMany([request1, request2, request3]);
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

function validateStatus(status) {
    return status < 500; // Resolve only if the status code is less than 500
}

it('create request success', async () => {
    const response = await axios.post(REQUEST_API_URL, request4, {
        headers: {
            authorization: `Bearer ${TOKEN_PASS}1`,
        },
    });

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP_CREATED);
    expectDbRequestMatchWithRequest(response.data, request4);
});

it('create request bad token', async () => {
    const response = await axios.post(REQUEST_API_URL, request4, {
        validateStatus,
        headers: {
            authorization: `Bearer ${TOKEN_FAIL}`,
        },
    });
    expect(response.status).toEqual(HTTP_FORBIDDEN);
});

it('get requests page 1 limit 2', async () => {
    const STATUS = 'ACTIVE';
    const PAGE = 1;
    const LIMIT = 2;

    const response = await axios.get(
        `${REQUEST_API_URL}/${STATUS}/?page=${PAGE}&limit=${LIMIT}`,
        {
            headers: {
                authorization: `Bearer ${TOKEN_PASS}2`,
            },
        },
    );

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP_OK);

    expect(response.data.pageCount).toEqual(1);
    expect(response.data.requests).toHaveLength(2);
    expectDbRequestMatchWithRequest(response.data.requests[0], request2);
    expectDbRequestMatchWithRequest(response.data.requests[1], request3);
});

it('get requests page 2 limit 1', async () => {
    const STATUS = 'ACTIVE';
    const PAGE = 2;
    const LIMIT = 1;

    const response = await axios.get(
        `${REQUEST_API_URL}/${STATUS}/?page=${PAGE}&limit=${LIMIT}`,
        {
            headers: {
                authorization: `Bearer ${TOKEN_PASS}2`,
            },
        },
    );

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP_OK);
    expect(response.data.pageCount).toEqual(2);
    expect(response.data.requests).toHaveLength(1);
    expectDbRequestMatchWithRequest(response.data.requests[0], request3);
});

it('get requests bad request', async () => {
    const STATUS = 'PENDING';
    const PAGE = 0;
    const LIMIT = 1;

    const response = await axios.get(
        `${REQUEST_API_URL}/${STATUS}/?page=${PAGE}&limit=${LIMIT}`,
        {
            validateStatus,
            headers: {
                authorization: `Bearer ${TOKEN_PASS}2`,
            },
        },
    );
    expect(response.status).toEqual(HTTP_BAD_REQUEST);
});

it('get requests invalid permissions', async () => {
    const STATUS = 'ACTIVE';
    const PAGE = 2;
    const LIMIT = 1;

    const response = await axios.get(
        `${REQUEST_API_URL}/${STATUS}/?page=${PAGE}&limit=${LIMIT}`,
        {
            validateStatus,
            headers: {
                // Token associated with Denise, who is not SUPERADMIN
                authorization: `Bearer ${TOKEN_PASS}1`,
            },
        },
    );
    expect(response.status).toEqual(HTTP_FORBIDDEN);
});
