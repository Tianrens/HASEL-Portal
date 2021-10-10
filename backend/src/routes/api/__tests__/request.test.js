import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import axios from 'axios';
import express from 'express';
import router from '../request';
import firebaseAuth from '../../../firebase/auth';
import { User } from '../../../db/schemas/userSchema';
import HTTP from '../util/http_codes';
import { SignUpRequest } from '../../../db/schemas/signUpRequestSchema';
import { retrieveRequestById } from '../../../db/dao/signUpRequestDao';
import { Workstation } from '../../../db/schemas/workstationSchema';

let mongo;
let app;
let server;
let dummyRequestWithAllFieldsSet1;
let dummyRequestWithAllFieldsSet2;
let dummyRequestWithAllFieldsSet3;
let dummyRequestWithAllFieldsSet4;
let studentUserRequest1;
let studentUserRequest2;
let academicUserRequest;
let staffUserRequest;
let requestApproval;
let requestDeclined;
let studentUser;
let superAdminUser;
let academicUser;
let staffUser;
let workstation1;
let workstation2;
let workstation3;
let updatedWorkstation;

let originalDateFunction;
const DATE_NOW_TIME = '2021-08-17T09:00:00';

const TOKEN_PASS = 'test';
const TOKEN_FAIL = 'fail';

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

    originalDateFunction = Date.now;
});

/**
 * Before each test, intialize the database with some data
 */
beforeEach(async () => {
    Date.now = jest.fn(() => new Date(DATE_NOW_TIME)); // Mock current time
    const usersColl = await mongoose.connection.db.collection('users');
    const signUpRequestsColl = await mongoose.connection.db.collection(
        'signuprequests',
    );
    const workstationColl = await mongoose.connection.db.collection(
        'workstations',
    );

    // Need to use user constructor to obtain _id value
    studentUser = new User({
        email: 'studentUser@gmail.com',
        upi: 'dnut420',
        authUserId: 'test1',
        firstName: 'Denise',
        lastName: 'Nuts',
        type: 'PHD',
        currentRequestId: null,
    });

    superAdminUser = new User({
        email: 'rezabuff@gmail.com',
        upi: 'reza420',
        authUserId: 'test2',
        firstName: 'Reza',
        lastName: 'Buff',
        type: 'SUPERADMIN',
    });

    academicUser = new User({
        email: 'academicUser@gmail.com',
        upi: 'lbor789',
        authUserId: 'test1',
        firstName: 'Lemon',
        lastName: 'Borat',
        type: 'ACADEMIC_STAFF',
    });

    staffUser = new User({
        email: 'staffUser@gmail.com',
        upi: 'pbul356',
        authUserId: 'test1',
        firstName: 'Pit',
        lastName: 'Bull',
        type: 'NON_ACADEMIC_STAFF',
    });

    workstation1 = new Workstation({
        name: 'Machine 1',
        host: '192.168.1.101',
        location: 'HASEL Lab',
        numGPUs: 2,
        gpuDescription: 'Nvidia GeForce RTX 2080',
        ramDescription: 'Kingston HyperX Predator 32GB',
        cpuDescription: 'Intel Core i9 10900KF',
    });
    workstation2 = new Workstation({
        name: 'Deep Learning Machine 3',
        host: '192.168.1.100',
        location: 'Level 9 Building 405',
        numGPUs: 4,
        gpuDescription: 'Nvidia GeForce RTX 3080',
        ramDescription: 'Corsair Dominator Platinum RGB 32GB',
        cpuDescription: 'Intel Xeon Silver 4210R',
    });
    workstation3 = new Workstation({
        name: 'Deep Learning Machine 2',
        host: '192.168.1.102',
        location: 'HASEL Lab',
        numGPUs: 3,
        gpuDescription: 'Nvidia GeForce RTX 3060 Ti',
        ramDescription: 'Kingston HyperX Predator 16GB',
        cpuDescription: 'Intel Core i7-11700K 8 Core / 16 Thread',
    });
    updatedWorkstation = new Workstation({
        name: 'Deep Learning Machine 3',
        host: '192.168.1.104',
        location: 'HASEL Lab',
        numGPUs: 3,
        gpuDescription: 'Nvidia GeForce RTX 3060 Ti',
        ramDescription: 'Kingston HyperX Predator 16GB',
        cpuDescription: 'Intel Core i7-11700K 8 Core / 16 Thread',
    });

    dummyRequestWithAllFieldsSet1 = {
        userId: studentUser._id,
        allocatedWorkstationId: workstation1._id,
        supervisorName: 'Reza Shahamiri',
        comments: 'Need to use the deep learning machines for part 4 project.',
        status: 'PENDING',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 19),
    };

    dummyRequestWithAllFieldsSet2 = {
        userId: studentUser._id,
        allocatedWorkstationId: workstation2._id,
        supervisorName: 'Andrew Meads',
        comments: 'Need access to the HASEL Lab machines for PhD research',
        status: 'ACTIVE',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 29),
    };

    dummyRequestWithAllFieldsSet3 = {
        userId: studentUser._id,
        allocatedWorkstationId: workstation3._id,
        supervisorName: 'Meads Andrew',
        comments: 'Need access to the LESAH Lab machines for PhD research',
        status: 'ACTIVE',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 29),
    };

    dummyRequestWithAllFieldsSet4 = {
        userId: studentUser._id,
        allocatedWorkstationId: workstation1._id,
        supervisorName: 'Joey Car',
        comments: 'Reasons',
        status: 'ACTIVE',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 29),
    };

    studentUserRequest1 = new SignUpRequest({
        userId: studentUser._id,
        allocatedWorkstationId: workstation2._id,
        supervisorName: 'Nasser Giacaman',
        status: 'PENDING', // status always pending on creation
    });

    studentUserRequest2 = new SignUpRequest({
        userId: studentUser._id,
        allocatedWorkstationId: workstation3._id,
        supervisorName: 'Kelly Blincoe',
        status: 'PENDING', // status always pending on creation
    });

    academicUserRequest = new SignUpRequest({
        userId: academicUser._id,
        allocatedWorkstationId: workstation1._id,
        status: 'PENDING', // status always pending on creation
    });

    staffUserRequest = new SignUpRequest({
        userId: staffUser._id,
        allocatedWorkstationId: workstation2._id,
        status: 'PENDING', // status always pending on creation
    });

    requestApproval = {
        status: 'ACTIVE',
        endDate: new Date(2021, 9, 29),
        allocatedWorkstationId: updatedWorkstation._id,
    };

    requestDeclined = {
        status: 'DECLINED',
    };

    studentUser.currentRequestId = studentUserRequest1._id;

    await workstationColl.insertMany([
        workstation1,
        workstation2,
        workstation3,
        updatedWorkstation,
    ]);

    await usersColl.insertMany([
        studentUser,
        superAdminUser,
        academicUser,
        staffUser,
    ]);
    await signUpRequestsColl.insertMany([
        dummyRequestWithAllFieldsSet1,
        dummyRequestWithAllFieldsSet2,
        dummyRequestWithAllFieldsSet3,
        dummyRequestWithAllFieldsSet4,
        studentUserRequest1,
        studentUserRequest2,
        academicUserRequest,
        staffUserRequest,
    ]);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.db.dropCollection('signuprequests');
    Date.now = originalDateFunction;
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
    if (responseRequest.userId._id) {
        // Populated
        expect(responseRequest.userId._id.toString()).toEqual(
            requestRequest.userId._id.toString(),
        );
    } else {
        // Not populated
        expect(responseRequest.userId.toString()).toEqual(
            requestRequest.userId.toString(),
        );
    }
    expect(responseRequest.allocatedWorkstationId.toString()).toEqual(
        requestRequest.allocatedWorkstationId.toString(),
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

function datesAreTheSame(first, second) {
    const firstDate = new Date(first);
    const secondDate = new Date(second);

    expect(firstDate.getFullYear()).toEqual(secondDate.getFullYear());
    expect(firstDate.getMonth()).toEqual(secondDate.getMonth());
    expect(firstDate.getDate()).toEqual(secondDate.getDate());
    expect(firstDate.getHours()).toEqual(secondDate.getHours());
    expect(firstDate.getMinutes()).toEqual(secondDate.getMinutes());
}

it('create request success', async () => {
    const response = await axios.post(REQUEST_API_URL, studentUserRequest1, {
        headers: {
            authorization: `Bearer ${TOKEN_PASS}1`,
        },
    });

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.CREATED);
    expectDbRequestMatchWithRequest(response.data, studentUserRequest1);
});

it('create request bad token', async () => {
    const response = await axios.post(REQUEST_API_URL, studentUserRequest1, {
        validateStatus,
        headers: {
            authorization: `Bearer ${TOKEN_FAIL}`,
        },
    });
    expect(response.status).toEqual(HTTP.FORBIDDEN);
});

it('get requests page 1 limit 2', async () => {
    const STATUS = 'ACTIVE';
    const PAGE = 1;
    const LIMIT = 2;

    const response = await axios.get(
        `${REQUEST_API_URL}/status/${STATUS}/?page=${PAGE}&limit=${LIMIT}`,
        {
            headers: {
                authorization: `Bearer ${TOKEN_PASS}2`,
            },
        },
    );

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.OK);

    expect(response.data.pageCount).toEqual(2);
    expect(response.data.requests).toHaveLength(2);
    expectDbRequestMatchWithRequest(
        response.data.requests[0],
        dummyRequestWithAllFieldsSet2,
    );
    expectDbRequestMatchWithRequest(
        response.data.requests[1],
        dummyRequestWithAllFieldsSet3,
    );
});

it('get requests page 2 limit 1', async () => {
    const STATUS = 'ACTIVE';
    const PAGE = 2;
    const LIMIT = 1;

    const response = await axios.get(
        `${REQUEST_API_URL}/status/${STATUS}/?page=${PAGE}&limit=${LIMIT}`,
        {
            headers: {
                authorization: `Bearer ${TOKEN_PASS}2`,
            },
        },
    );

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.OK);
    expect(response.data.pageCount).toEqual(3);
    expect(response.data.requests).toHaveLength(1);
    expectDbRequestMatchWithRequest(
        response.data.requests[0],
        dummyRequestWithAllFieldsSet3,
    );
});

it('get requests page 2 limit 2', async () => {
    const STATUS = 'ACTIVE';
    const PAGE = 2;
    const LIMIT = 2;

    const response = await axios.get(
        `${REQUEST_API_URL}/status/${STATUS}/?page=${PAGE}&limit=${LIMIT}`,
        {
            headers: {
                authorization: `Bearer ${TOKEN_PASS}2`,
            },
        },
    );

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.OK);

    expect(response.data.pageCount).toEqual(2);
    expect(response.data.requests).toHaveLength(1);
    expectDbRequestMatchWithRequest(
        response.data.requests[0],
        dummyRequestWithAllFieldsSet4,
    );
});

it('get requests invalid permissions', async () => {
    const STATUS = 'ACTIVE';
    const PAGE = 2;
    const LIMIT = 1;

    const response = await axios.get(
        `${REQUEST_API_URL}/status/${STATUS}/?page=${PAGE}&limit=${LIMIT}`,
        {
            validateStatus,
            headers: {
                // Token associated with Denise, who is not SUPERADMIN
                authorization: `Bearer ${TOKEN_PASS}1`,
            },
        },
    );
    expect(response.status).toEqual(HTTP.FORBIDDEN);
});

it('get single request, request belongs to user', async () => {
    const response = await axios.get(
        `${REQUEST_API_URL}/${studentUserRequest1._id}`,
        {
            validateStatus,
            headers: {
                // Token associated with Denise. Request is associated with them
                authorization: `Bearer ${TOKEN_PASS}1`,
            },
        },
    );
    expect(response.status).toEqual(HTTP.OK);
    expectDbRequestMatchWithRequest(response.data, studentUserRequest1);
});

it('get single request, user is superadmin', async () => {
    const response = await axios.get(
        `${REQUEST_API_URL}/${staffUserRequest._id}`,
        {
            validateStatus,
            headers: {
                // Token associated with Reza, who is a SUPERADMIN
                authorization: `Bearer ${TOKEN_PASS}2`,
            },
        },
    );
    expect(response.status).toEqual(HTTP.OK);
    expectDbRequestMatchWithRequest(response.data, staffUserRequest);
});

it('get single request invalid permissions', async () => {
    const response = await axios.get(
        `${REQUEST_API_URL}/${staffUserRequest._id}`,
        {
            validateStatus,
            headers: {
                // Token associated with Denise, who is not SUPERADMIN
                authorization: `Bearer ${TOKEN_PASS}1`,
            },
        },
    );
    expect(response.status).toEqual(HTTP.FORBIDDEN);
});

it('get single request garbage request id', async () => {
    const response = await axios.get(`${REQUEST_API_URL}/sadljasi`, {
        validateStatus,
        headers: {
            // Token associated with Reza, who is a SUPERADMIN
            authorization: `Bearer ${TOKEN_PASS}2`,
        },
    });
    expect(response.status).toEqual(HTTP.BAD_REQUEST);
});

it('approve PHD student request valid permissions', async () => {
    const response = await axios.patch(
        `${REQUEST_API_URL}/${studentUserRequest2._id}`,
        requestApproval,
        {
            validateStatus,
            headers: {
                authorization: `Bearer ${TOKEN_PASS}2`,
            },
        },
    );

    const updatedRequest = await retrieveRequestById(studentUserRequest2._id);

    expect(response.status).toEqual(HTTP.NO_CONTENT);
    expect(updatedRequest.allocatedWorkstationId.toString()).toEqual(
        updatedWorkstation._id.toString(),
    );
    expect(updatedRequest.status).toEqual('ACTIVE');
    datesAreTheSame(updatedRequest.startDate, Date.now());
    datesAreTheSame(updatedRequest.endDate, requestApproval.endDate);
});

it('approve ACTIVE request valid permissions', async () => {
    const response = await axios.patch(
        `${REQUEST_API_URL}/${dummyRequestWithAllFieldsSet4._id}`,
        requestApproval,
        {
            validateStatus,
            headers: {
                authorization: `Bearer ${TOKEN_PASS}2`,
            },
        },
    );

    const updatedRequest = await retrieveRequestById(
        dummyRequestWithAllFieldsSet4._id,
    );

    expect(response.status).toEqual(HTTP.NO_CONTENT);
    expect(updatedRequest.allocatedWorkstationId.toString()).toEqual(
        updatedWorkstation._id.toString(),
    );
    expect(updatedRequest.status).toEqual('ACTIVE');
    datesAreTheSame(
        updatedRequest.startDate,
        dummyRequestWithAllFieldsSet4.startDate,
    );
    datesAreTheSame(updatedRequest.endDate, requestApproval.endDate);
});

it('approve request invalid permissions', async () => {
    const response = await axios.patch(
        `${REQUEST_API_URL}/${studentUserRequest2._id}`,
        requestApproval,
        {
            validateStatus,
            headers: {
                authorization: `Bearer ${TOKEN_PASS}1`,
            },
        },
    );

    const dbRequest = await retrieveRequestById(studentUserRequest2._id);
    expect(response.status).toEqual(HTTP.FORBIDDEN);
    expect(dbRequest.status).toEqual('PENDING');
});

it('decline request valid permissions', async () => {
    const response = await axios.patch(
        `${REQUEST_API_URL}/${studentUserRequest2._id}`,
        requestDeclined,
        {
            validateStatus,
            headers: {
                authorization: `Bearer ${TOKEN_PASS}2`,
            },
        },
    );

    const updatedRequest = await retrieveRequestById(studentUserRequest2._id);

    expect(response.status).toEqual(HTTP.NO_CONTENT);
    expect(updatedRequest.status).toEqual('DECLINED');
    expect(updatedRequest.startDate).toBeUndefined();
    expect(updatedRequest.endDate).toBeUndefined();
});

it('update request status - invalid status', async () => {
    const response = await axios.patch(
        `${REQUEST_API_URL}/${studentUserRequest2._id}`,
        { status: 'INVALID' },
        {
            validateStatus,
            headers: {
                authorization: `Bearer ${TOKEN_PASS}2`,
            },
        },
    );

    const updatedRequest = await retrieveRequestById(studentUserRequest2._id);

    expect(response.status).toEqual(HTTP.BAD_REQUEST);
    expect(updatedRequest.status).toEqual('PENDING');
    expect(updatedRequest.startDate).toBeUndefined();
    expect(updatedRequest.endDate).toBeUndefined();
});

it('archive a request with valid permissions', async () => {
    const response = await axios.delete(
        `${REQUEST_API_URL}/${dummyRequestWithAllFieldsSet1._id}`,
        {
            validateStatus,
            headers: {
                authorization: `Bearer ${TOKEN_PASS}2`,
            },
        },
    );

    const archivedRequest = await retrieveRequestById(
        dummyRequestWithAllFieldsSet1._id,
    );

    expect(response.status).toEqual(HTTP.NO_CONTENT);
    expect(archivedRequest).toBeNull();
});

it('archive a request with invalid permissions', async () => {
    const response = await axios.delete(
        `${REQUEST_API_URL}/${dummyRequestWithAllFieldsSet1._id}`,
        {
            validateStatus,
            headers: {
                authorization: `Bearer ${TOKEN_PASS}1`,
            },
        },
    );

    const archivedRequest = await retrieveRequestById(
        dummyRequestWithAllFieldsSet1._id,
    );

    expect(response.status).toEqual(HTTP.FORBIDDEN);
    expectDbRequestMatchWithRequest(
        archivedRequest,
        dummyRequestWithAllFieldsSet1,
    );
});

it('archive a request which does not exist', async () => {
    const response = await axios.delete(
        `${REQUEST_API_URL}/999999999999999999999999`,
        {
            validateStatus,
            headers: {
                authorization: `Bearer ${TOKEN_PASS}2`,
            },
        },
    );

    expect(response.status).toEqual(HTTP.NOT_FOUND);
});

it('get request count pending as superadmin', async () => {
    const response = await axios.get(`${REQUEST_API_URL}/status/PENDING`, {
        validateStatus,
        headers: {
            authorization: `Bearer ${superAdminUser.authUserId}`,
        },
    });

    expect(response.status).toEqual(HTTP.OK);
    expect(response.data.count).toEqual(5);
});

it('get request count pending as non superadmin', async () => {
    const response = await axios.get(`${REQUEST_API_URL}/status/PENDING`, {
        validateStatus,
        headers: {
            authorization: `Bearer ${studentUser.authUserId}`,
        },
    });

    expect(response.status).toEqual(HTTP.FORBIDDEN);
});
