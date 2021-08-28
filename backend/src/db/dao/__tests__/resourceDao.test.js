import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
    createResource,
    deleteResource,
    retrieveAllResources,
    retrieveResourceOfUser,
} from '../resourceDao';
import { Resource } from '../../schemas/resourceSchema';
import { createSignUpRequest } from '../signUpRequestDao';
import { User } from '../../schemas/userSchema';
import { SignUpRequest } from '../../schemas/signUpRequestSchema';

let mongo;
let resource1;
let resource2;
let resource3;
let request1;
let request2;
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
    const resourcesColl = await mongoose.connection.db.collection('resources');
    await mongoose.connection.db.collection('signuprequests');
    const usersColl = await mongoose.connection.db.collection('users');

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

    resource3 = {
        name: 'Deep Learning Machine 2',
        location: 'HASEL Lab',
        numGPUs: 3,
        gpuDescription: 'Nvidia GeForce RTX 3060 Ti',
        ramDescription: 'Kingston HyperX Predator 16GB',
        cpuDescription: 'Intel Core i7-11700K 8 Core / 16 Thread',
    };

    user1 = new User({
        email: 'user1@gmail.com',
        upi: 'dnut420',
        authUserId: '12345',
        firstName: 'Denise',
        lastName: 'Nuts',
        type: 'STUDENT',
    });

    request1 = new SignUpRequest({
        userId: user1._id,
        allocatedResourceId: resource2._id,
        supervisorName: 'Reza Shahamiri',
        comments: 'Need to use the deep learning machines for part 4 project.',
        status: 'ACTIVE',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 29),
    });

    request2 = new SignUpRequest({
        userId: user1._id,
        allocatedResourceId: resource1._id,
        supervisorName: 'Reza Shahamiri',
        comments: 'Need to use the deep learning machines for part 4 project.',
        status: 'DECLINED',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 29),
    });

    await resourcesColl.insertMany([resource1, resource2]);
    await usersColl.insertOne(user1);
    await createSignUpRequest(request1);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
    await mongoose.connection.db.dropCollection('resources');
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.db.dropCollection('signuprequests');
});

/**
 * After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

it('get all resources', async () => {
    const resources = await retrieveAllResources();

    expect(resources).toBeTruthy();
    expect(resources).toHaveLength(2);

    expect(resources[0].name).toBe(resource1.name);
    expect(resources[0].numGPUs).toBe(resource1.numGPUs);
    expect(resources[0].gpuDescription).toBe(resource1.gpuDescription);
    expect(resources[0].ramDescription).toBe(resource1.ramDescription);
    expect(resources[0].cpuDescription).toBe(resource1.cpuDescription);

    expect(resources[1].name).toBe(resource2.name);
    expect(resources[1].numGPUs).toBe(resource2.numGPUs);
    expect(resources[1].gpuDescription).toBe(resource2.gpuDescription);
    expect(resources[1].ramDescription).toBe(resource2.ramDescription);
    expect(resources[1].cpuDescription).toBe(resource2.cpuDescription);
});

it('create new resource', async () => {
    const newResource = await createResource(resource3);
    const dbResource = await Resource.findById(newResource._id);

    expect(dbResource).toBeTruthy();
    expect(dbResource.name).toBe(resource3.name);
    expect(dbResource.numGPUs).toBe(resource3.numGPUs);
    expect(dbResource.gpuDescription).toBe(resource3.gpuDescription);
    expect(dbResource.ramDescription).toBe(resource3.ramDescription);
    expect(dbResource.cpuDescription).toBe(resource3.cpuDescription);
});

it("retrieve user's resource", async () => {
    const userResource = await retrieveResourceOfUser(user1._id);

    expect(userResource).toBeTruthy();
    expect(userResource.name).toBe(resource2.name);
    expect(userResource.numGPUs).toBe(resource2.numGPUs);
    expect(userResource.gpuDescription).toBe(resource2.gpuDescription);
    expect(userResource.ramDescription).toBe(resource2.ramDescription);
    expect(userResource.cpuDescription).toBe(resource2.cpuDescription);
});

it("retrieve user's resource with declined request", async () => {
    await createSignUpRequest(request2);
    const userResource = await retrieveResourceOfUser(user1._id);

    expect(userResource).toBeNull();
});

it('delete resource', async () => {
    await deleteResource(resource2._id);
    const resources = await Resource.find({});

    expect(resources).toBeTruthy();
    expect(resources).toHaveLength(1);

    expect(resources[0].name).toBe(resource1.name);
    expect(resources[0].numGPUs).toBe(resource1.numGPUs);
    expect(resources[0].gpuDescription).toBe(resource1.gpuDescription);
    expect(resources[0].ramDescription).toBe(resource1.ramDescription);
    expect(resources[0].cpuDescription).toBe(resource1.cpuDescription);
});
