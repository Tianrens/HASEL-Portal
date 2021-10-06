import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
    createWorkstation,
    archiveWorkstation,
    retrieveAllWorkstations,
    retrieveWorkstationOfUser,
    updateWorkstation,
} from '../workstationDao';
import { Workstation } from '../../schemas/workstationSchema';
import { createSignUpRequest } from '../signUpRequestDao';
import { User } from '../../schemas/userSchema';
import { SignUpRequest } from '../../schemas/signUpRequestSchema';

let mongo;
let workstation1;
let workstation2;
let workstation3;
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
    const workstationsColl = await mongoose.connection.db.collection(
        'workstations',
    );
    await mongoose.connection.db.collection('signuprequests');
    const usersColl = await mongoose.connection.db.collection('users');

    workstation1 = new Workstation({
        name: 'Machine 1',
        host: '192.168.1.100',
        location: 'HASEL Lab',
        numGPUs: 2,
        gpuDescription: 'Nvidia GeForce RTX 2080',
        ramDescription: 'Kingston HyperX Predator 32GB',
        cpuDescription: 'Intel Core i9 10900KF',
    });

    workstation2 = new Workstation({
        name: 'Deep Learning Machine 3',
        host: '192.168.1.101',
        location: 'Level 9 Building 405',
        numGPUs: 4,
        gpuDescription: 'Nvidia GeForce RTX 3080',
        ramDescription: 'Corsair Dominator Platinum RGB 32GB',
        cpuDescription: 'Intel Xeon Silver 4210R',
    });

    workstation3 = {
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
        allocatedWorkstationId: workstation2._id,
        supervisorName: 'Reza Shahamiri',
        comments: 'Need to use the deep learning machines for part 4 project.',
        status: 'ACTIVE',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 29),
    });

    request2 = new SignUpRequest({
        userId: user1._id,
        allocatedWorkstationId: workstation1._id,
        supervisorName: 'Reza Shahamiri',
        comments: 'Need to use the deep learning machines for part 4 project.',
        status: 'DECLINED',
        startDate: new Date(2021, 0, 21),
        endDate: new Date(2021, 9, 29),
    });

    await workstationsColl.insertMany([workstation1, workstation2]);
    await usersColl.insertOne(user1);
    await createSignUpRequest(request1);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
    await mongoose.connection.db.dropCollection('workstations');
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

function expectDbWorkstationMatchWithWorkstation(dbWorkstation, workstation) {
    expect(dbWorkstation).toBeTruthy();
    expect(dbWorkstation.name).toEqual(workstation.name);
    expect(dbWorkstation.location).toEqual(workstation.location);
    expect(dbWorkstation.numGPUs).toEqual(workstation.numGPUs);
    expect(dbWorkstation.gpuDescription).toEqual(workstation.gpuDescription);
    expect(dbWorkstation.ramDescription).toEqual(workstation.ramDescription);
    expect(dbWorkstation.cpuDescription).toEqual(workstation.cpuDescription);
}

it('get all workstations', async () => {
    const workstations = await retrieveAllWorkstations();

    expect(workstations).toBeTruthy();
    expect(workstations).toHaveLength(2);

    expectDbWorkstationMatchWithWorkstation(workstations[0], workstation1);
    expectDbWorkstationMatchWithWorkstation(workstations[1], workstation2);
});

it('create new workstation', async () => {
    const newWorkstation = await createWorkstation(workstation3);
    const dbWorkstation = await Workstation.findById(newWorkstation._id);

    expectDbWorkstationMatchWithWorkstation(dbWorkstation, workstation3);
});

it("retrieve user's workstation", async () => {
    const userWorkstation = await retrieveWorkstationOfUser(user1._id);

    expectDbWorkstationMatchWithWorkstation(userWorkstation, workstation2);
});

it("retrieve user's workstation with declined request", async () => {
    await createSignUpRequest(request2);
    const userWorkstation = await retrieveWorkstationOfUser(user1._id);

    expect(userWorkstation).toBeNull();
});

it('update workstation', async () => {
    const newWorkstation = {
        name: 'Deep Learning Machine 3',
        host: '192.168.1.101',
        location: 'Level 9 Building 405',
        numGPUs: 4,
        gpuDescription: 'Nvidia GeForce RTX 3080',
        ramDescription: 'Corsair Dominator Platinum RGB 32GB',
        cpuDescription: 'Intel Xeon Silver 4210R',
    };

    await updateWorkstation(workstation1._id, newWorkstation);

    const updatedWorkstation = await Workstation.findById(workstation1._id);
    expectDbWorkstationMatchWithWorkstation(updatedWorkstation, newWorkstation);
});

it('archive workstation', async () => {
    await archiveWorkstation(workstation2._id);
    const workstations = await Workstation.find({});

    expect(workstations).toBeTruthy();
    expect(workstations).toHaveLength(1);

    expectDbWorkstationMatchWithWorkstation(workstations[0], workstation1);

    const archivedWorkstation = await Workstation.findById(workstation2._id);
    expect(archivedWorkstation).toBeNull();
});
