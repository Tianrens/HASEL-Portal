import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import axios from 'axios';
import express from 'express';
import router from '../resource';
import firebaseAuth from '../../../firebase/auth';

let mongo;
let app;
let server;
let resource1;
let resource2;
let resource3;

const TOKEN_PASS = 'test';

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
});

/**
 * Before each test, intialize the database with some data
 */
beforeEach(async () => {
    const resourceColl = await mongoose.connection.db.collection('resources');

    // Need to use user constructor to obtain _id value
    resource1 = {
        name: 'Machine 1',
        location: 'HASEL Lab',
        numGPUs: 2,
        gpuDescription: 'Nvidia GeForce RTX 2080',
        ramDescription: 'Kingston HyperX Predator 32GB',
        cpuDescription: 'Intel Core i9 10900KF',
    };

    resource2 = {
        name: 'Deep Learning Machine 3',
        location: 'Level 9 Building 405',
        numGPUs: 4,
        gpuDescription: 'Nvidia GeForce RTX 3080',
        ramDescription: 'Corsair Dominator Platinum RGB 32GB',
        cpuDescription: 'Intel Xeon Silver 4210R',
    };

    resource3 = {
        name: 'Deep Learning Machine 2',
        location: 'HASEL Lab',
        numGPUs: 3,
        gpuDescription: 'Nvidia GeForce RTX 3060 Ti',
        ramDescription: 'Kingston HyperX Predator 16GB',
        cpuDescription: 'Intel Core i7-11700K 8 Core / 16 Thread',
    };
    await resourceColl.insertMany([resource1, resource2, resource3]);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
    await mongoose.connection.db.dropCollection('resources');
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

it('get all resources', async () => {
    const response = await axios.get(`${RESOURCE_API_URL}`, {
        headers: {
            authorization: `Bearer ${TOKEN_PASS}`,
        },
    });

    expectDbResourceMatchWithResource(response.data[0], resource1);
    expectDbResourceMatchWithResource(response.data[1], resource2);
    expectDbResourceMatchWithResource(response.data[2], resource3);
});
