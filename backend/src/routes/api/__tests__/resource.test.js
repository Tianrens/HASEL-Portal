import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import express from 'express';
import router from '../resource';
import firebaseAuth from '../../../firebase/auth';
import { authRequest } from './util/authRequest';
import { Resource } from '../../../db/schemas/resourceSchema';
import { User } from '../../../db/schemas/userSchema';
import { SignUpRequest } from '../../../db/schemas/signUpRequestSchema';
import { Booking } from '../../../db/schemas/bookingSchema';
import HTTP from '../util/http_codes';

let mongo;
let app;
let server;
let originalDateFunction;
let resource1;
let resource2;
let resource3;
let adminUser;
let undergradUser;
let adminCurrentBooking;
let adminFutureBooking;
let undergradBooking;
let adminSignupRequest;
let undergradSignupRequest;

const ADMIN_TOKEN = 'test';
const UNDERGRAD_TOKEN = 'test2';

jest.mock('../../../firebase/index.js');
const RESOURCE_API_URL = 'http://localhost:3000/api/resource';

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
    app.use('/api/resource', firebaseAuth, router);
    server = app.listen(3000);

    originalDateFunction = Date.now;
});

/**
 * Before each test, intialize the database with some data
 */
beforeEach(async () => {
    const resourceColl = await mongoose.connection.db.collection('resources');
    const userColl = await mongoose.connection.db.collection('users');
    const bookingColl = await mongoose.connection.db.collection('bookings');
    const signupRequestColl = await mongoose.connection.db.collection('signuprequests');

    Date.now = jest.fn(() => new Date(2021, 6, 17)); // Mock current time

    resource1 = new Resource({
        name: 'Machine 1',
        location: 'HASEL Lab',
        numGPUs: 2,
        gpuDescription: 'Nvidia GeForce RTX 2080',
        ramDescription: 'Kingston HyperX Predator 32GB',
        cpuDescription: 'Intel Core i9 10900KF',
    });
    resource2 = new Resource({
        name: 'Deep Learning Machine 3',
        location: 'Level 9 Building 405',
        numGPUs: 4,
        gpuDescription: 'Nvidia GeForce RTX 3080',
        ramDescription: 'Corsair Dominator Platinum RGB 32GB',
        cpuDescription: 'Intel Xeon Silver 4210R',
    });
    resource3 = new Resource({
        name: 'Deep Learning Machine 2',
        location: 'HASEL Lab',
        numGPUs: 3,
        gpuDescription: 'Nvidia GeForce RTX 3060 Ti',
        ramDescription: 'Kingston HyperX Predator 16GB',
        cpuDescription: 'Intel Core i7-11700K 8 Core / 16 Thread',
    });
    await resourceColl.insertMany([resource1, resource2, resource3]);

    adminUser = new User({
        email: 'icecream@gmail.com',
        currentRequestId: null,
        upi: 'ice123',
        authUserId: ADMIN_TOKEN,
        firstName: 'Ice',
        lastName: 'Cream',
        type: 'ADMIN'
    });
    undergradUser = new User({
        email: 'watermelon@gmail.com',
        currentRequestId: 'null',
        upi: 'wmn123',
        authUserId: UNDERGRAD_TOKEN,
        firstName: 'Water',
        lastName: 'Melon',
        type: 'UNDERGRAD'
    });

    adminSignupRequest = new SignUpRequest({
        userId: adminUser._id,
        allocatedResourceId: resource1._id,
        supervisorName: '',
        comments: '',
        status: 'ACTIVE',
        startDate: new Date(2021, 1, 21),
        endDate: new Date(2021, 12, 21),
    });
    undergradSignupRequest = new SignUpRequest({
        userId: undergradUser._id,
        allocatedResourceId: resource2._id,
        supervisorName: '',
        comments: '',
        status: 'ACTIVE',
        startDate: new Date(2021, 1, 20),
        endDate: new Date(2021, 12, 25),
    });
    adminUser.currentRequestId = adminSignupRequest._id;
    undergradUser.currentRequestId = undergradSignupRequest._id;
    await userColl.insertMany([adminUser, undergradUser]);
    await signupRequestColl.insertMany([adminSignupRequest, undergradSignupRequest]);

    adminCurrentBooking = new Booking({
        resourceId: resource1._id,
        userId: adminUser._id,
        startTimestamp: new Date(2021, 6, 1),
        endTimestamp: new Date(2021, 7, 1),
        numGPUs: 4,
    });
    adminFutureBooking = new Booking({
        resourceId: resource1._id,
        userId: adminUser._id,
        startTimestamp: new Date(2021, 8, 1),
        endTimestamp: new Date(2021, 9, 1),
        numGPUs: 4,
    });
    undergradBooking = new Booking({
        resourceId: resource2._id,
        userId: undergradUser._id,
        startTimestamp: new Date(2021, 2, 1),
        endTimestamp: new Date(2021, 4, 1),
        numGPUs: 5,
    });
    await bookingColl.insertMany([adminCurrentBooking, adminFutureBooking, undergradBooking]);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
    await mongoose.connection.db.dropCollection('resources');
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

function expectDbResourceMatchWithResource(responseResource, requestResource) {
    expect(responseResource).toBeTruthy();
    expect(responseResource.name).toEqual(requestResource.name);
    expect(responseResource.location).toEqual(requestResource.location);
    expect(responseResource.numGPUs).toEqual(requestResource.numGPUs);
    expect(responseResource.gpuDescription).toEqual(
        requestResource.gpuDescription,
    );
    expect(responseResource.ramDescription).toEqual(
        requestResource.ramDescription,
    );
    expect(responseResource.cpuDescription).toEqual(
        requestResource.cpuDescription,
    );
}

function expectDbBookingMatchWithBooking(responseBooking, requestBooking) {
    expect(responseBooking).toBeTruthy();
    expect(responseBooking.resourceId.str).toEqual(requestBooking.resourceId.str);
    expect(responseBooking.userId.str).toEqual(requestBooking.userId.str);
    expect(responseBooking.numGPUs).toEqual(requestBooking.numGPUs);
    expect(responseBooking.startTimestamp).toEqual(requestBooking.startTimestamp.toISOString());
    expect(responseBooking.endTimestamp).toEqual(requestBooking.endTimestamp.toISOString());
}

it('Get resource details', async () => {
    const response = await authRequest(`${RESOURCE_API_URL}/${resource2._id}`, 'GET', UNDERGRAD_TOKEN);
    expectDbResourceMatchWithResource(response.data, resource2);
});

it('Get all resources', async () => {
    const response = await authRequest(RESOURCE_API_URL, 'GET', ADMIN_TOKEN);

    expectDbResourceMatchWithResource(response.data[0], resource1);
    expectDbResourceMatchWithResource(response.data[1], resource2);
    expectDbResourceMatchWithResource(response.data[2], resource3);
});

it('Get bookings for a specified resource, user is admin', async () => {
    const response = await authRequest(`${RESOURCE_API_URL}/booking/${resource1._id}`, 'GET', ADMIN_TOKEN);
    expectDbBookingMatchWithBooking(response.data[0], adminCurrentBooking);
    expectDbBookingMatchWithBooking(response.data[1], adminFutureBooking);
});

it('Get bookings for a specified resource but there are no bookings', async () => {
    const response = await authRequest(`${RESOURCE_API_URL}/booking/${resource3._id}`, 'GET', ADMIN_TOKEN);
    expect(response.data).toEqual([]);
});

it('Get CURRENT + ONGOING bookings for a specified resource, user is admin', async () => {
    const response = await authRequest(`${RESOURCE_API_URL}/booking/${resource1._id}?status=active`, 'GET', ADMIN_TOKEN);
    expectDbBookingMatchWithBooking(response.data[0], adminCurrentBooking);
    expectDbBookingMatchWithBooking(response.data[1], adminFutureBooking);
    expect(response.data).toHaveLength(2);
});

it('Get bookings with a bad request query param', async () => {
    const response = await authRequest(`${RESOURCE_API_URL}/booking/${resource1._id}?status=helpme`, 'GET', ADMIN_TOKEN);
    expect(response.status).toEqual(HTTP.BAD_REQUEST);
});

it('Get bookings for a specified resource, user is NOT admin and resource belongs to user', async () => {
    const response = await authRequest(`${RESOURCE_API_URL}/booking/${resource2._id}`, 'GET', UNDERGRAD_TOKEN);
    expectDbBookingMatchWithBooking(response.data[0], undergradBooking);
});

it('Get bookings for a specified resource, user is NOT admin and resource DOES NOT belong to user', async () => {
    const response = await authRequest(`${RESOURCE_API_URL}/booking/${resource1._id}`, 'GET', UNDERGRAD_TOKEN);
    expect(response.status).toEqual(HTTP.FORBIDDEN);
});
