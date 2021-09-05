import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { addDays, subDays } from 'date-fns';
import {
    countRequests,
    createSignUpRequest,
    retrieveAllRequests,
    retrieveExpiringRequests,
    retrieveRequestById,
    retrieveRequests,
    updateRequest,
    updateRequestStatus,
} from '../signUpRequestDao';
import { SignUpRequest } from '../../schemas/signUpRequestSchema';
import { User } from '../../schemas/userSchema';

let mongo;

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
 * After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

describe('non-time dependent tests', () => {
    let request1;
    let request2;
    let request3;
    let request4;
    let user1;

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
            comments:
                'Need to use the deep learning machines for part 4 project.',
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

        user1 = new User({
            email: 'user1@gmail.com',
            upi: 'dnut420',
            authUserId: '12345',
            firstName: 'Denise',
            lastName: 'Nuts',
            type: 'UNDERGRAD',
        });

        request4 = {
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
        await signUpRequestsColl.insertMany([request1, request2, request3]);
    });

    /**
     * After each test, clear the database entirely
     */
    afterEach(async () => {
        await mongoose.connection.db.dropCollection('signuprequests');
        await mongoose.connection.db.dropCollection('users');
    });

    function expectDbRequestMatchWithRequest(dbRequest, request) {
        expect(dbRequest).toBeTruthy();
        expect(dbRequest.userId).toEqual(request.userId);
        expect(dbRequest.allocatedResourceId).toEqual(
            request.allocatedResourceId,
        );
        expect(dbRequest.supervisorName).toEqual(request.supervisorName);
        if (request.comments) {
            expect(dbRequest.comments).toEqual(request.comments);
        }
        expect(dbRequest.status).toEqual(request.status);
        expect(dbRequest.startDate).toEqual(request.startDate);
        expect(dbRequest.endDate).toEqual(request.endDate);
    }

    it('get all requests', async () => {
        const requests = await retrieveAllRequests();

        expect(requests).toBeTruthy();
        expect(requests).toHaveLength(3);

        expectDbRequestMatchWithRequest(requests[0], request1);
        expectDbRequestMatchWithRequest(requests[1], request2);
        expectDbRequestMatchWithRequest(requests[2], request3);
    });

    it('get pending requests', async () => {
        const STATUS = 'PENDING';
        const PAGE = 1;
        const LIMIT = 1;

        const requests = await retrieveRequests(STATUS, PAGE, LIMIT);

        expect(requests).toBeTruthy();
        expect(requests).toHaveLength(1);

        expectDbRequestMatchWithRequest(requests[0], request1);
    });

    it('get page 1 limit 2 active requests', async () => {
        const STATUS = 'ACTIVE';
        const PAGE = 1;
        const LIMIT = 2;

        const requests = await retrieveRequests(STATUS, PAGE, LIMIT);

        expect(requests).toBeTruthy();
        expect(requests).toHaveLength(2);

        expectDbRequestMatchWithRequest(requests[0], request2);
        expectDbRequestMatchWithRequest(requests[1], request3);
    });

    it('get page 2 limit 1 active requests', async () => {
        const STATUS = 'ACTIVE';
        const PAGE = 2;
        const LIMIT = 1;

        const requests = await retrieveRequests(STATUS, PAGE, LIMIT);

        expect(requests).toBeTruthy();
        expect(requests).toHaveLength(1);

        expectDbRequestMatchWithRequest(requests[0], request3);
    });

    it('counts ACTIVE documents', async () => {
        const STATUS = 'ACTIVE';

        const count = await countRequests(STATUS);

        expect(count).toBeTruthy();
        expect(count).toEqual(2);
    });

    it('create new request', async () => {
        const newRequest = await createSignUpRequest(request4);
        const dbRequest = await SignUpRequest.findById(newRequest._id);

        expectDbRequestMatchWithRequest(dbRequest, request4);
    });

    it('retrieve a single request', async () => {
        const dbRequest = await retrieveRequestById(request1._id);

        expectDbRequestMatchWithRequest(dbRequest, request1);
    });

    it('update request status', async () => {
        await updateRequestStatus(request1._id, 'EXPIRED');
        const dbRequest = await SignUpRequest.findById(request1._id);

        expect(dbRequest).toBeTruthy();
        expect(dbRequest.userId).toEqual(request1.userId);
        expect(dbRequest.allocatedResourceId).toEqual(
            request1.allocatedResourceId,
        );
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
});

describe('time dependent tests', () => {
    let expiredTest;
    let expiringTest;
    let nonExpiringTest;

    beforeEach(async () => {
        const signUpRequestsColl = await mongoose.connection.db.collection(
            'signuprequests',
        );

        expiredTest = {
            userId: mongoose.Types.ObjectId('888888888888888888888888'),
            allocatedResourceId: mongoose.Types.ObjectId(
                '666666666666666666666666',
            ),
            supervisorName: 'Reza Shahamiri',
            comments:
                'Need to use the deep learning machines for part 4 project.',
            status: 'EXPIRED',
            startDate: subDays(new Date(), 1),
            endDate: subDays(new Date(), 1),
        };

        expiringTest = {
            userId: mongoose.Types.ObjectId('999999999999999999999999'),
            allocatedResourceId: mongoose.Types.ObjectId(
                '555555555555555555555555',
            ),
            supervisorName: 'Andrew Meads',
            comments: 'Need access to the HASEL Lab machines for PhD research',
            status: 'ACTIVE',
            startDate: subDays(new Date(), 1),
            endDate: addDays(new Date(), 7),
        };

        nonExpiringTest = {
            userId: mongoose.Types.ObjectId('111111111111111111111111'),
            allocatedResourceId: mongoose.Types.ObjectId(
                '555555555555555555555555',
            ),
            supervisorName: 'Meads Andrew',
            comments: 'Need access to the LESAH Lab machines for PhD research',
            status: 'ACTIVE',
            startDate: subDays(new Date(), 1),
            endDate: addDays(new Date(), 100),
        };

        await signUpRequestsColl.insertMany([
            expiredTest,
            expiringTest,
            nonExpiringTest,
        ]);
    });

    afterEach(async () => {
        await mongoose.connection.db.dropCollection('signuprequests');
    });

    it('retrieve expiring requests', async () => {
        const expiringRequests = await retrieveExpiringRequests();
        expect(expiringRequests).toBeTruthy();
        expect(expiringRequests).toHaveLength(1);

        expect(expiringRequests[0]._id).toEqual(expiringTest._id);
    });
});
