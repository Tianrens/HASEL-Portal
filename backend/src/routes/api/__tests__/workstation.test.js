import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import express from 'express';
import router from '../workstation';
import firebaseAuth from '../../../firebase/auth';
import { authRequest } from './util/authRequest';
import { Workstation } from '../../../db/schemas/workstationSchema';
import { User } from '../../../db/schemas/userSchema';
import { SignUpRequest } from '../../../db/schemas/signUpRequestSchema';
import { Booking } from '../../../db/schemas/bookingSchema';
import HTTP from '../util/http_codes';

let mongo;
let app;
let server;
let originalDateFunction;
let workstation1;
let workstation2;
let workstation3;
let workstation4;
let adminUser;
let undergradUser;
let adminPastBooking;
let adminCurrentBooking;
let adminFutureBooking;
let undergradBooking;
let adminSignupRequest;
let undergradSignupRequest;

const ADMIN_TOKEN = 'test';
const UNDERGRAD_TOKEN = 'test2';

jest.mock('../../../firebase/index.js');
const WORKSTATION_API_URL = 'http://localhost:3000/api/workstation';

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
    app.use('/api/workstation', firebaseAuth, router);
    server = app.listen(3000);

    originalDateFunction = Date.now;
});

/**
 * Before each test, intialize the database with some data
 */
beforeEach(async () => {
    const workstationColl = await mongoose.connection.db.collection(
        'workstations',
    );
    const userColl = await mongoose.connection.db.collection('users');
    const bookingColl = await mongoose.connection.db.collection('bookings');
    const signupRequestColl = await mongoose.connection.db.collection(
        'signuprequests',
    );

    Date.now = jest.fn(() => new Date(2021, 6, 17)); // Mock current time

    workstation1 = new Workstation({
        name: 'Machine 1',
        location: 'HASEL Lab',
        host: '111.111.111.111',
        numGPUs: 2,
        gpuDescription: 'Nvidia GeForce RTX 2080',
        ramDescription: 'Kingston HyperX Predator 32GB',
        cpuDescription: 'Intel Core i9 10900KF',
    });
    workstation2 = new Workstation({
        name: 'Deep Learning Machine 3',
        location: 'Level 9 Building 405',
        host: '112.112.112.112',
        numGPUs: 4,
        gpuDescription: 'Nvidia GeForce RTX 3080',
        ramDescription: 'Corsair Dominator Platinum RGB 32GB',
        cpuDescription: 'Intel Xeon Silver 4210R',
    });
    workstation3 = new Workstation({
        name: 'Deep Learning Machine 2',
        location: 'HASEL Lab',
        host: '113.113.133.113',
        numGPUs: 3,
        gpuDescription: 'Nvidia GeForce RTX 3060 Ti',
        ramDescription: 'Kingston HyperX Predator 16GB',
        cpuDescription: 'Intel Core i7-11700K 8 Core / 16 Thread',
    });
    workstation4 = {
        name: 'Deep Learning Machine 4',
        host: '10.104.144.52',
        location: 'HASEL Lab',
        numGPUs: 4,
        gpuDescription: 'Nvidia GeForce RTX 3080',
        ramDescription: 'Corsair Dominator Platinum RGB 32GB',
        cpuDescription: 'Intel Xeon Silver 4210R',
    };
    await workstationColl.insertMany([
        workstation1,
        workstation2,
        workstation3,
    ]);

    adminUser = new User({
        email: 'icecream@gmail.com',
        currentRequestId: null,
        upi: 'ice123',
        authUserId: ADMIN_TOKEN,
        firstName: 'Ice',
        lastName: 'Cream',
        type: 'ADMIN',
    });
    undergradUser = new User({
        email: 'watermelon@gmail.com',
        currentRequestId: 'null',
        upi: 'wmn123',
        authUserId: UNDERGRAD_TOKEN,
        firstName: 'Water',
        lastName: 'Melon',
        type: 'UNDERGRAD',
    });

    adminSignupRequest = new SignUpRequest({
        userId: adminUser._id,
        allocatedWorkstationId: workstation1._id,
        supervisorName: '',
        comments: '',
        status: 'ACTIVE',
        startDate: new Date(2021, 1, 21),
        endDate: new Date(2021, 12, 21),
    });
    undergradSignupRequest = new SignUpRequest({
        userId: undergradUser._id,
        allocatedWorkstationId: workstation2._id,
        supervisorName: '',
        comments: '',
        status: 'ACTIVE',
        startDate: new Date(2021, 1, 20),
        endDate: new Date(2021, 12, 25),
    });
    adminUser.currentRequestId = adminSignupRequest._id;
    undergradUser.currentRequestId = undergradSignupRequest._id;
    await userColl.insertMany([adminUser, undergradUser]);
    await signupRequestColl.insertMany([
        adminSignupRequest,
        undergradSignupRequest,
    ]);

    adminPastBooking = new Booking({
        workstationId: workstation1._id,
        userId: adminUser._id,
        startTimestamp: new Date(2020, 6, 1),
        endTimestamp: new Date(2020, 7, 1),
        gpuIndices: [0, 1, 2, 3],
    });
    adminCurrentBooking = new Booking({
        workstationId: workstation1._id,
        userId: adminUser._id,
        startTimestamp: new Date(2021, 6, 1),
        endTimestamp: new Date(2021, 7, 1),
        gpuIndices: [0, 1, 2, 3],
    });
    adminFutureBooking = new Booking({
        workstationId: workstation1._id,
        userId: adminUser._id,
        startTimestamp: new Date(2021, 8, 1),
        endTimestamp: new Date(2021, 9, 1),
        gpuIndices: [0, 1, 2, 3],
    });
    undergradBooking = new Booking({
        workstationId: workstation2._id,
        userId: undergradUser._id,
        startTimestamp: new Date(2021, 2, 1),
        endTimestamp: new Date(2021, 4, 1),
        gpuIndices: [0, 1, 2, 3, 4],
    });
    await bookingColl.insertMany([
        adminPastBooking,
        adminCurrentBooking,
        adminFutureBooking,
        undergradBooking,
    ]);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
    await mongoose.connection.db.dropCollection('workstations');
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.db.dropCollection('bookings');
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

// Needed as mongodb returns a MongoArray that cannot be compared conventionally
function arraysAreTheSame(first, second) {
    expect(first.length).toEqual(second.length);
    for (let i = 0; i < first.length; i += 1) {
        expect(first[i]).toEqual(second[i]);
    }
}

function expectDbWorkstationMatchWithWorkstation(
    responseWorkstation,
    requestWorkstation,
) {
    expect(responseWorkstation).toBeTruthy();
    expect(responseWorkstation.name).toEqual(requestWorkstation.name);
    expect(responseWorkstation.location).toEqual(requestWorkstation.location);
    expect(responseWorkstation.numGPUs).toEqual(requestWorkstation.numGPUs);
    expect(responseWorkstation.gpuDescription).toEqual(
        requestWorkstation.gpuDescription,
    );
    expect(responseWorkstation.ramDescription).toEqual(
        requestWorkstation.ramDescription,
    );
    expect(responseWorkstation.cpuDescription).toEqual(
        requestWorkstation.cpuDescription,
    );
}

function expectDbBookingMatchWithBooking(responseBooking, requestBooking) {
    expect(responseBooking).toBeTruthy();
    expect(responseBooking.workstationId.str).toEqual(
        requestBooking.workstationId.str,
    );
    expect(responseBooking.userId.str).toEqual(requestBooking.userId.str);
    arraysAreTheSame(responseBooking.gpuIndices, requestBooking.gpuIndices);
    expect(responseBooking.startTimestamp).toEqual(
        requestBooking.startTimestamp.toISOString(),
    );
    expect(responseBooking.endTimestamp).toEqual(
        requestBooking.endTimestamp.toISOString(),
    );
}

function expectWorkstationUpdatedCorrectly(
    originalWorkstation,
    newWorkstation,
    updatedWorkstation,
) {
    expect(originalWorkstation._id).toEqual(updatedWorkstation._id);
    expect(updatedWorkstation.name).toEqual(newWorkstation.name);
    expect(updatedWorkstation.host).toEqual(newWorkstation.host);
    expect(updatedWorkstation.location).toEqual(newWorkstation.location);
    expect(updatedWorkstation.numGPUs).toEqual(newWorkstation.numGPUs);
    expect(updatedWorkstation.gpuDescription).toEqual(
        newWorkstation.gpuDescription,
    );
    expect(updatedWorkstation.ramDescription).toEqual(
        newWorkstation.ramDescription,
    );
    expect(updatedWorkstation.cpuDescription).toEqual(
        newWorkstation.cpuDescription,
    );
}

it('create new workstation valid permissions', async () => {
    const response = await authRequest(
        WORKSTATION_API_URL,
        'POST',
        ADMIN_TOKEN,
        workstation4,
    );

    const workstations = await Workstation.find({});

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.CREATED);
    expectDbWorkstationMatchWithWorkstation(response.data, workstation4);
    expect(workstations.length).toEqual(4);
});

it('create new workstation invalid permissions', async () => {
    const response = await authRequest(
        WORKSTATION_API_URL,
        'POST',
        UNDERGRAD_TOKEN,
        workstation4,
    );

    const workstations = await Workstation.find({});

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.FORBIDDEN);
    expect(workstations.length).toEqual(3);
});

it('create new workstation with missing params', async () => {
    delete workstation4.host;

    const response = await authRequest(
        WORKSTATION_API_URL,
        'POST',
        UNDERGRAD_TOKEN,
        workstation4,
    );

    const workstations = await Workstation.find({});

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.BAD_REQUEST);
    expect(workstations.length).toEqual(3);
});

it('Get workstation details', async () => {
    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation2._id}`,
        'GET',
        UNDERGRAD_TOKEN,
    );
    expectDbWorkstationMatchWithWorkstation(response.data, workstation2);
});

it('Get all workstations', async () => {
    const response = await authRequest(WORKSTATION_API_URL, 'GET', ADMIN_TOKEN);

    expectDbWorkstationMatchWithWorkstation(response.data[0], workstation1);
    expectDbWorkstationMatchWithWorkstation(response.data[1], workstation2);
    expectDbWorkstationMatchWithWorkstation(response.data[2], workstation3);
});

it('Get bookings for a specified workstation for Gantt chart', async () => {
    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}/booking`,
        'GET',
        ADMIN_TOKEN,
    );

    expect(response.data).toHaveLength(1);
    // Admin future booking is too far in the future
    expectDbBookingMatchWithBooking(response.data[0], adminCurrentBooking);
});

it('Get bookings for a specified workstation, user is admin', async () => {
    const status = 'all';
    const page = 1;
    const limit = 10;

    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}/booking/${status}?page=${page}&limit=${limit}`,
        'GET',
        ADMIN_TOKEN,
    );

    expect(response.data.count).toEqual(3);
    expect(response.data.pageCount).toEqual(1);
    expectDbBookingMatchWithBooking(
        response.data.bookings[0],
        adminFutureBooking,
    );
    expectDbBookingMatchWithBooking(
        response.data.bookings[1],
        adminCurrentBooking,
    );
    expectDbBookingMatchWithBooking(
        response.data.bookings[2],
        adminPastBooking,
    );
});

it('Get bookings for a specified workstation but there are no bookings', async () => {
    const status = 'all';
    const page = 1;
    const limit = 10;

    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation3._id}/booking/${status}?page=${page}&limit=${limit}`,
        'GET',
        ADMIN_TOKEN,
    );

    expect(response.data.bookings).toEqual([]);
});

it('Get CURRENT + ONGOING (ACTIVE) bookings for a specified workstation, user is admin', async () => {
    const status = 'active';
    const page = 1;
    const limit = 10;

    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}/booking/${status}?page=${page}&limit=${limit}`,
        'GET',
        ADMIN_TOKEN,
    );

    expect(response.data.count).toEqual(2);
    expect(response.data.pageCount).toEqual(1);
    expectDbBookingMatchWithBooking(
        response.data.bookings[0],
        adminCurrentBooking,
    );
    expectDbBookingMatchWithBooking(
        response.data.bookings[1],
        adminFutureBooking,
    );
    expect(response.data.bookings).toHaveLength(2);
});

it('Get FUTURE bookings for a specified workstation, user is admin', async () => {
    const status = 'FUTURE';
    const page = 1;
    const limit = 10;

    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}/booking/${status}?page=${page}&limit=${limit}`,
        'GET',
        ADMIN_TOKEN,
    );

    expect(response.data.count).toEqual(1);
    expect(response.data.pageCount).toEqual(1);
    expectDbBookingMatchWithBooking(
        response.data.bookings[0],
        adminFutureBooking,
    );
});

it('Get CURRENT bookings for a specified workstation, user is admin', async () => {
    const status = 'CURRENT';
    const page = 1;
    const limit = 10;

    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}/booking/${status}?page=${page}&limit=${limit}`,
        'GET',
        ADMIN_TOKEN,
    );

    expect(response.data.count).toEqual(1);
    expect(response.data.pageCount).toEqual(1);
    expectDbBookingMatchWithBooking(
        response.data.bookings[0],
        adminCurrentBooking,
    );
});

it('Get PAST bookings for a specified workstation, user is admin', async () => {
    const status = 'PAST';
    const page = 1;
    const limit = 10;

    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}/booking/${status}?page=${page}&limit=${limit}`,
        'GET',
        ADMIN_TOKEN,
    );

    expect(response.data.count).toEqual(1);
    expect(response.data.pageCount).toEqual(1);
    expectDbBookingMatchWithBooking(
        response.data.bookings[0],
        adminPastBooking,
    );
});

it('Get bookings for a specified workstation, page 2 limit 2', async () => {
    const status = 'ALL';
    const page = 2;
    const limit = 2;

    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}/booking/${status}?page=${page}&limit=${limit}`,
        'GET',
        ADMIN_TOKEN,
    );

    expect(response.data.count).toEqual(3);
    expect(response.data.pageCount).toEqual(2);
    expect(response.data.bookings).toHaveLength(1);
    expectDbBookingMatchWithBooking(
        response.data.bookings[0],
        adminPastBooking,
    );
});

it('Get bookings with a bad request query param', async () => {
    const status = 'helpme';
    const page = 1;
    const limit = 10;

    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}/booking/${status}?page=${page}&limit=${limit}`,
        'GET',
        ADMIN_TOKEN,
    );
    expect(response.status).toEqual(HTTP.BAD_REQUEST);
});

it('Get bookings for a specified workstation, user is NOT admin and workstation belongs to user', async () => {
    const status = 'all';
    const page = 1;
    const limit = 10;

    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation2._id}/booking/${status}?page=${page}&limit=${limit}`,
        'GET',
        UNDERGRAD_TOKEN,
    );
    expect(response.data.count).toEqual(1);
    expect(response.data.pageCount).toEqual(1);
    expectDbBookingMatchWithBooking(
        response.data.bookings[0],
        undergradBooking,
    );
});

it('Get bookings for a specified workstation, user is NOT admin and workstation DOES NOT belong to user', async () => {
    const status = 'all';
    const page = 1;
    const limit = 10;

    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}/booking/${status}?page=${page}&limit=${limit}`,
        'GET',
        UNDERGRAD_TOKEN,
    );
    expect(response.status).toEqual(HTTP.FORBIDDEN);
});

it('update workstation as admin', async () => {
    const newWorkstation = workstation4;
    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}`,
        'PUT',
        ADMIN_TOKEN,
        newWorkstation,
    );

    expect(response.status).toEqual(HTTP.NO_CONTENT);
    expect(response).toBeDefined();

    const updatedWorkstation = await Workstation.findById(workstation1._id);
    expectWorkstationUpdatedCorrectly(
        workstation1,
        newWorkstation,
        updatedWorkstation,
    );

    const workstations = await Workstation.find({});
    expect(workstations.length).toEqual(3);
});

it('update workstation as non-admin', async () => {
    const newWorkstation = workstation4;
    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}`,
        'PUT',
        UNDERGRAD_TOKEN,
        newWorkstation,
    );

    expect(response.status).toEqual(HTTP.FORBIDDEN);
    expect(response).toBeDefined();

    const workstations = await Workstation.find({});
    expect(workstations.length).toEqual(3);

    const updatedWorkstation = await Workstation.findById(workstation1._id);
    expectDbWorkstationMatchWithWorkstation(workstation1, updatedWorkstation);
});

it('does not update non existing workstation as admin', async () => {
    const newWorkstation = new Workstation({
        name: 'Should not exist',
        host: 'Should not exist',
        location: 'Should not exist',
        numGPUs: 0,
        gpuDescription: 'Should not exist',
        ramDescription: 'Should not exist',
        cpuDescription: 'Should not exist',
    });

    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}`,
        'PUT',
        ADMIN_TOKEN,
        newWorkstation,
    );

    expect(response.status).toEqual(HTTP.BAD_REQUEST);
    expect(response).toBeDefined();

    const workstations = await Workstation.find({});
    expect(workstations.length).toEqual(3);
});

it('archive workstation that exists as admin', async () => {
    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}`,
        'DELETE',
        ADMIN_TOKEN,
    );

    expect(response.status).toEqual(HTTP.NO_CONTENT);

    const workstations = await Workstation.find({});

    expect(response).toBeDefined();
    expect(workstations.length).toEqual(2);
});

it('archive workstation that exists as a non admin', async () => {
    const response = await authRequest(
        `${WORKSTATION_API_URL}/${workstation1._id}`,
        'DELETE',
        UNDERGRAD_TOKEN,
    );

    expect(response.status).toEqual(HTTP.FORBIDDEN);

    const workstations = await Workstation.find({});

    expect(response).toBeDefined();
    expect(workstations.length).toEqual(3);
});

it('archive workstation that does not exists as admin', async () => {
    const response = await authRequest(
        `${WORKSTATION_API_URL}/555555555553555555455355`,
        'DELETE',
        ADMIN_TOKEN,
    );

    expect(response.status).toEqual(HTTP.NOT_FOUND);

    const workstations = await Workstation.find({});

    expect(response).toBeDefined();
    expect(workstations.length).toEqual(3);
});
