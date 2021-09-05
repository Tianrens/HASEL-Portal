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
        host: '192.168.1.100',
        location: 'HASEL Lab',
        numGPUs: 2,
        gpuDescription: 'Nvidia GeForce RTX 2080',
        ramDescription: 'Kingston HyperX Predator 32GB',
        cpuDescription: 'Intel Core i9 10900KF',
    });

    resource2 = new Resource({
        name: 'Deep Learning Machine 3',
        host: '192.168.1.101',
        location: 'Level 9 Building 405',
        numGPUs: 4,
        gpuDescription: 'Nvidia GeForce RTX 3080',
        ramDescription: 'Corsair Dominator Platinum RGB 32GB',
        cpuDescription: 'Intel Xeon Silver 4210R',
    });

    resource3 = {
        name: 'Deep Learning Machine 2',
        host: '192.168.1.102',
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
        type: 'UNDERGRAD',
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

function expectDbResourceMatchWithResource(dbResource, resource) {
    expect(dbResource).toBeTruthy();
    expect(dbResource.name).toEqual(resource.name);
    expect(dbResource.location).toEqual(resource.location);
    expect(dbResource.numGPUs).toEqual(resource.numGPUs);
    expect(dbResource.gpuDescription).toEqual(resource.gpuDescription);
    expect(dbResource.ramDescription).toEqual(resource.ramDescription);
    expect(dbResource.cpuDescription).toEqual(resource.cpuDescription);
}

it('get all resources', async () => {
    const resources = await retrieveAllResources();

    expect(resources).toBeTruthy();
    expect(resources).toHaveLength(2);

    expectDbResourceMatchWithResource(resources[0], resource1);
    expectDbResourceMatchWithResource(resources[1], resource2);
});

it('create new resource', async () => {
    const newResource = await createResource(resource3);
    const dbResource = await Resource.findById(newResource._id);

    expectDbResourceMatchWithResource(dbResource, resource3);
});

it("retrieve user's resource", async () => {
    const userResource = await retrieveResourceOfUser(user1._id);

    expectDbResourceMatchWithResource(userResource, resource2);
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

    expectDbResourceMatchWithResource(resources[0], resource1);
});
