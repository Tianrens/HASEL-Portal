import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import express from 'express';
import router from '../booking';
import firebaseAuth from '../../../firebase/auth';
import { Workstation } from '../../../db/schemas/workstationSchema';
import { User } from '../../../db/schemas/userSchema';
import { SignUpRequest } from '../../../db/schemas/signUpRequestSchema';
import { Booking } from '../../../db/schemas/bookingSchema';
import { retrieveBookingById } from '../../../db/dao/bookingDao';
import { authRequest } from './util/authRequest';
import HTTP from '../util/http_codes';

let mongo;
let app;
let server;
let undergradUser;
let mastersUser;
let adminUser;
let request1;
let workstation1;
let existingBooking1;
let existingBooking2;
let validBooking;
let invalidTimeBooking;
let invalidGPUBooking;
let invalidWorkstationBooking;

jest.mock('../../../firebase/index.js');
const BOOKING_API_URL = 'http://localhost:3000/api/booking';

const UNDERGRAD_TOKEN = 'test';

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
    app.use('/api/booking', firebaseAuth, router);
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
    const workstationColl = await mongoose.connection.db.collection(
        'workstations',
    );
    const bookingColl = await mongoose.connection.db.collection('bookings');

    undergradUser = new User({
        email: 'watermelon@gmail.com',
        currentRequestId: null,
        upi: 'wmn123',
        authUserId: UNDERGRAD_TOKEN,
        firstName: 'Water',
        lastName: 'Melon',
        type: 'UNDERGRAD',
    });

    mastersUser = {
        email: 'pineapple@gmail.com',
        currentRequestId: null,
        upi: 'papp695',
        authUserId: 'test1',
        firstName: 'Pine',
        lastName: 'Apple',
        type: 'MASTERS',
    };

    adminUser = {
        email: 'admin@gmail.com',
        currentRequestId: null,
        upi: 'amin695',
        authUserId: 'test2',
        firstName: 'Ad',
        lastName: 'Min',
        type: 'ADMIN',
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
        userId: undergradUser._id,
        allocatedWorkstationId: workstation1._id,
        supervisorName: 'Reza Shahamiri',
        comments: 'Need to use the deep learning machines for part 4 project.',
        status: 'ACTIVE',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 19),
    });
    undergradUser.currentRequestId = request1._id;

    existingBooking1 = new Booking({
        workstationId: workstation1._id,
        userId: undergradUser._id,
        startTimestamp: new Date('2021-08-13T12:00:00'),
        endTimestamp: new Date('2021-08-13T15:00:00'),
        gpuIndices: [1],
    });

    existingBooking2 = new Booking({
        workstationId: workstation1._id,
        userId: undergradUser._id,
        startTimestamp: new Date('2021-08-15T12:00:00'),
        endTimestamp: new Date('2021-08-15T15:00:00'),
        gpuIndices: [1],
    });

    // GPU1:   
    validBooking = {
        workstationId: workstation1._id,
        startTimestamp: new Date('2021-08-13T11:00:00'),
        endTimestamp: new Date('2021-08-13T12:00:00'),
        gpuIndices: [1],
    };

    // GPU1:       
    invalidTimeBooking = {
        workstationId: workstation1._id,
        startTimestamp: new Date('2021-08-13T11:00:00'),
        endTimestamp: new Date('2021-08-13T13:00:00'),
        gpuIndices: [1],
    };

    invalidGPUBooking = {
        workstationId: workstation1._id,
        startTimestamp: new Date('2021-08-21T09:58:00'),
        endTimestamp: new Date('2021-08-21T12:30:42'),
        gpuIndices: [2],
    };

    invalidWorkstationBooking = {
        workstationId: mongoose.Types.ObjectId('555555555555555555555555'),
        startTimestamp: new Date('2021-08-13T11:00:00'),
        endTimestamp: new Date('2021-08-13T12:00:00'),
        gpuIndices: [1],
    };

    await usersColl.insertMany([undergradUser, mastersUser, adminUser]);
    await signUpRequestsColl.insertOne(request1);
    await workstationColl.insertOne(workstation1);
    await bookingColl.insertMany([existingBooking1, existingBooking2]);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
    await mongoose.connection.db.dropCollection('workstations');
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.db.dropCollection('bookings');
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

// Needed as mongodb returns a MongoArray that cannot be compared conventionally
function arraysAreTheSame(first, second) {
    expect(first.length).toEqual(second.length);
    for (let i = 0; i < first.length; i += 1) {
        expect(first[i]).toEqual(second[i]);
    }
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

function expectDbBookingMatchWithBooking(responseBooking, requestBooking) {
    expect(responseBooking).toBeTruthy();
    expect(responseBooking.workstationId.toString()).toEqual(
        requestBooking.workstationId.toString(),
    );
    expect(responseBooking.userId).toBeDefined();
    datesAreTheSame(
        responseBooking.startTimestamp,
        requestBooking.startTimestamp,
    );
    datesAreTheSame(responseBooking.endTimestamp, requestBooking.endTimestamp);
    expect(responseBooking.gpuIndices).toEqual(
        requestBooking.gpuIndices.toObject(),
    );
}

it('creates a valid booking', async () => {
    const response = await authRequest(
        BOOKING_API_URL,
        'POST',
        UNDERGRAD_TOKEN,
        validBooking,
    );

    const dbBooking = await retrieveBookingById(response.data._id);

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.CREATED);
    expectDbBookingMatchWithBooking(response.data, dbBooking);
});

it('creates a invalid time booking', async () => {
    const response = await authRequest(
        BOOKING_API_URL,
        'POST',
        UNDERGRAD_TOKEN,
        invalidTimeBooking,
    );

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.BAD_REQUEST);
});

it('creates a invalid GPU booking', async () => {
    const response = await authRequest(
        BOOKING_API_URL,
        'POST',
        UNDERGRAD_TOKEN,
        invalidGPUBooking,
    );

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.BAD_REQUEST);
});

it('get existing booking by ID', async () => {
    const response = await authRequest(
        `${BOOKING_API_URL}/${existingBooking1._id}`,
        'GET',
        UNDERGRAD_TOKEN,
    );

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.OK);
    expectDbBookingMatchWithBooking(response.data, existingBooking1);
});

it('get non-existing booking by ID', async () => {
    const response = await authRequest(
        `${BOOKING_API_URL}/696969696969696969696969`,
        'GET',
        UNDERGRAD_TOKEN,
    );

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.NOT_FOUND);
});

it('get booking by ID invalid permissions', async () => {
    const response = await authRequest(
        `${BOOKING_API_URL}/${existingBooking1._id}`,
        'GET',
        mastersUser.authUserId,
    );

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.FORBIDDEN);
});

it('get booking by ID valid ADMIN permissions', async () => {
    const response = await authRequest(
        `${BOOKING_API_URL}/${existingBooking1._id}`,
        'GET',
        adminUser.authUserId,
    );

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.OK);
    expectDbBookingMatchWithBooking(response.data, existingBooking1);
});

it('creates a invalid resource booking', async () => {
    const response = await authRequest(
        BOOKING_API_URL,
        'POST',
        UNDERGRAD_TOKEN,
        invalidWorkstationBooking,
    );

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.FORBIDDEN);
});

it('update booking valid', async () => {
    const request = {
        startTimestamp: existingBooking2.startTimestamp,
        endTimestamp: new Date('2021-08-15T16:00:00'),
        gpuIndices: [0],
    };
    const response = await authRequest(
        `${BOOKING_API_URL}/${existingBooking2._id}`,
        'PUT',
        UNDERGRAD_TOKEN,
        request,
    );

    const dbBooking = await retrieveBookingById(existingBooking2._id);

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.NO_CONTENT);
    datesAreTheSame(dbBooking.startTimestamp, request.startTimestamp);
    datesAreTheSame(dbBooking.endTimestamp, request.endTimestamp);
    arraysAreTheSame(dbBooking.gpuIndices, request.gpuIndices);
});

it('update booking invalid time', async () => {
    const request = {
        startTimestamp: existingBooking1.startTimestamp.toISOString(),
        endTimestamp: existingBooking2.endTimestamp.toISOString(),
        gpuIndices: existingBooking2.gpuIndices,
    };
    const response = await authRequest(
        `${BOOKING_API_URL}/${existingBooking2._id}`,
        'PUT',
        UNDERGRAD_TOKEN,
        request,
    );

    const dbBooking = await retrieveBookingById(existingBooking2._id);

    expect(response).toBeDefined();
    expect(response.status).toEqual(HTTP.BAD_REQUEST);
    arraysAreTheSame(dbBooking.gpuIndices, existingBooking2.gpuIndices);
});

it('archive booking with valid permissions', async () => {
    const response = await authRequest(
        `${BOOKING_API_URL}/${existingBooking2._id}`,
        'DELETE',
        UNDERGRAD_TOKEN,
    );
    const dbBooking = await retrieveBookingById(existingBooking2._id);

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.NO_CONTENT);
    expect(dbBooking).toBeNull();
});

it('archive a non-existent booking', async () => {
    const response = await authRequest(
        `${BOOKING_API_URL}/888888888888888888888888`,
        'DELETE',
        UNDERGRAD_TOKEN,
    );

    const bookings = await Booking.find({});

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.NOT_FOUND);
    expect(bookings).toHaveLength(2);
});

it('archive booking with invalid permissions', async () => {
    const response = await authRequest(
        `${BOOKING_API_URL}/${existingBooking2._id}`,
        'DELETE',
        'test1', // auth token does not belong to booking owner
    );

    const dbBooking = await retrieveBookingById(existingBooking2._id);

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.FORBIDDEN);
    expect(dbBooking).toBeTruthy();
    expect(dbBooking).toBeDefined();
});

it('archive booking with admin permissions', async () => {
    const response = await authRequest(
        `${BOOKING_API_URL}/${existingBooking2._id}`,
        'DELETE',
        'test2', // auth token belongs to ADMIN
    );

    const dbBooking = await retrieveBookingById(existingBooking2._id);

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.NO_CONTENT);
    expect(dbBooking).toBeNull();
});
