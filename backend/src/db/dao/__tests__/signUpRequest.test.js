import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
    createSignUpRequest,
    retrieveAllRequests,
    retrieveRequestById,
    updateRequest,
    updateRequestStatus,
} from '../signUpRequestDao';
import { SignUpRequest } from '../../schemas/signUpRequestSchema';
import { User } from '../../schemas/userSchema';

let mongo;
let request1;
let request2;
let request3;
let user1;
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
    const signUpRequestsColl = await mongoose.connection.db.collection(
        'signuprequests',
    );

    const usersColl = await mongoose.connection.db.collection('users');

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

    user1 = new User({
        email: 'user1@gmail.com',
        upi: 'dnut420',
        authUserId: '12345',
        firstName: 'Denise',
        lastName: 'Nuts',
        type: 'STUDENT',
    });

    request3 = {
        userId: user1._id,
        allocatedResourceId: mongoose.Types.ObjectId(
            '444444444444444444444444',
        ),
        supervisorName: 'Nasser Giacaman',
        status: 'EXPIRED',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 7, 27),
    };

    await usersColl.insertOne(user1);
    await signUpRequestsColl.insertMany([request1, request2]);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
    await mongoose.connection.db.dropCollection('signuprequests');
    await mongoose.connection.db.dropCollection('users');
});

/**
 * After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

it('get all requests', async () => {
    const requests = await retrieveAllRequests();

    expect(requests).toBeTruthy();
    expect(requests).toHaveLength(2);

    expect(requests[0].userId).toEqual(request1.userId);
    expect(requests[0].allocatedResourceId).toEqual(
        request1.allocatedResourceId,
    );
    expect(requests[0].supervisorName).toBe(request1.supervisorName);
    expect(requests[0].comments).toBe(request1.comments);
    expect(requests[0].status).toBe(request1.status);
    expect(requests[0].startDate).toEqual(request1.startDate);
    expect(requests[0].endDate).toEqual(request1.endDate);

    expect(requests[1].userId).toEqual(request2.userId);
    expect(requests[1].allocatedResourceId).toEqual(
        request2.allocatedResourceId,
    );
    expect(requests[1].supervisorName).toBe(request2.supervisorName);
    expect(requests[1].comments).toBe(request2.comments);
    expect(requests[1].status).toBe(request2.status);
    expect(requests[1].startDate).toEqual(request2.startDate);
    expect(requests[1].endDate).toEqual(request2.endDate);
});

it('create new request', async () => {
    const newRequest = await createSignUpRequest(request3);
    const dbRequest = await SignUpRequest.findById(newRequest._id);

    expect(dbRequest).toBeTruthy();
    expect(dbRequest.userId).toEqual(request3.userId);
    expect(dbRequest.allocatedResourceId).toEqual(request3.allocatedResourceId);
    expect(dbRequest.supervisorName).toBe(request3.supervisorName);
    expect(dbRequest.comments).toBe('');
    expect(dbRequest.status).toBe(request3.status);
    expect(dbRequest.startDate).toEqual(request3.startDate);
    expect(dbRequest.endDate).toEqual(request3.endDate);
});

it('retrieve a single request', async () => {
    const dbRequest = await retrieveRequestById(request1._id);

    expect(dbRequest).toBeTruthy();
    expect(dbRequest.userId).toEqual(request1.userId);
    expect(dbRequest.allocatedResourceId).toEqual(request1.allocatedResourceId);
    expect(dbRequest.supervisorName).toBe(request1.supervisorName);
    expect(dbRequest.comments).toBe(request1.comments);
    expect(dbRequest.status).toBe(request1.status);
    expect(dbRequest.startDate).toEqual(request1.startDate);
    expect(dbRequest.endDate).toEqual(request1.endDate);
});

it('update request status', async () => {
    await updateRequestStatus(request1._id, 'EXPIRED');
    const dbRequest = await SignUpRequest.findById(request1._id);

    expect(dbRequest).toBeTruthy();
    expect(dbRequest.userId).toEqual(request1.userId);
    expect(dbRequest.allocatedResourceId).toEqual(request1.allocatedResourceId);
    expect(dbRequest.supervisorName).toBe(request1.supervisorName);
    expect(dbRequest.comments).toBe(request1.comments);
    expect(dbRequest.status).toBe('EXPIRED');
    expect(dbRequest.startDate).toEqual(request1.startDate);
    expect(dbRequest.endDate).toEqual(request1.endDate);
});

it('update request info', async () => {
    const updatedRequest2Info = {
        allocatedResourceId: mongoose.Types.ObjectId(
            '222222222222222222222222',
        ),
        status: 'PENDING',
        startDate: new Date(2021, 9, 29),
        endDate: new Date(2022, 2, 14),
    };

    await updateRequest(request2._id, updatedRequest2Info);

    const dbRequest = await SignUpRequest.findById(request2._id);

    expect(dbRequest).toBeTruthy();
    expect(dbRequest.userId).toEqual(request2.userId);
    expect(dbRequest.allocatedResourceId).toEqual(
        updatedRequest2Info.allocatedResourceId,
    );
    expect(dbRequest.supervisorName).toBe(request2.supervisorName);
    expect(dbRequest.comments).toBe(request2.comments);
    expect(dbRequest.status).toBe(updatedRequest2Info.status);
    expect(dbRequest.startDate).toEqual(updatedRequest2Info.startDate);
    expect(dbRequest.endDate).toEqual(updatedRequest2Info.endDate);
});
