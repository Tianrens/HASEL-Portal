import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
    createBooking,
    deleteBooking,
    retrieveAllBookings,
    retrieveBookingsByResource,
    retrieveBookingsByUser,
    updateBooking,
} from '../bookingDao';
import { Resource } from '../../schemas/resourceSchema';
import { Booking } from '../../schemas/bookingSchema';

let mongo;
let resource1;
let booking1;
let booking2;
let booking3;
let invalidGPUBooking1;
let invalidTimeBookings;
let validTimeBookings;

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
    const bookingsColl = await mongoose.connection.db.collection('bookings');
    const resourcesColl = await mongoose.connection.db.collection('resources');

    resource1 = new Resource({
        name: 'Machine 1',
        host: '192.168.1.100',
        location: 'HASEL Lab',
        numGPUs: 2,
        gpuDescription: 'Nvidia GeForce RTX 2080',
        ramDescription: 'Kingston HyperX Predator 32GB',
        cpuDescription: 'Intel Core i9 10900KF',
    });

    booking1 = {
        resourceId: resource1._id,
        userId: mongoose.Types.ObjectId('888888888888888888888888'),
        startTimestamp: new Date('2021-08-17T08:00:00'),
        endTimestamp: new Date('2021-08-17T12:00:00'),
        gpuIndices: [0, 1],
    };

    booking2 = {
        resourceId: resource1._id,
        userId: mongoose.Types.ObjectId('777777777777777777777777'),
        startTimestamp: new Date('2021-08-13T12:00:00'),
        endTimestamp: new Date('2021-08-13T15:00:00'),
        gpuIndices: [1],
    };

    booking3 = {
        resourceId: resource1._id,
        userId: mongoose.Types.ObjectId('999999999999999999999999'),
        startTimestamp: new Date('2021-08-13T09:58:00'),
        endTimestamp: new Date('2021-08-13T12:30:42'),
        gpuIndices: [0],
    };

    invalidGPUBooking1 = {
        resourceId: resource1._id,
        userId: mongoose.Types.ObjectId('999999999999999999999999'),
        startTimestamp: new Date('2021-08-21T09:58:00'),
        endTimestamp: new Date('2021-08-21T12:30:42'),
        gpuIndices: [2],
    };

    validTimeBookings = [
        // Close with booking2: ■
        // startTimestamp: new Date('2021-08-13T12:00:00'),
        // endTimestamp: new Date('2021-08-13T15:00:00'),
        // GPU1:   □□□□■■■■■■■■■
        {
            resourceId: resource1._id,
            userId: mongoose.Types.ObjectId('777777777777777777777777'),
            startTimestamp: new Date('2021-08-13T11:00:00'),
            endTimestamp: new Date('2021-08-13T12:00:00'),
            gpuIndices: [1],
        },
        // GPU1:       ■■■■■■■■■□□□□
        {
            resourceId: resource1._id,
            userId: mongoose.Types.ObjectId('777777777777777777777777'),
            startTimestamp: new Date('2021-08-13T15:00:00'),
            endTimestamp: new Date('2021-08-13T16:00:00'),
            gpuIndices: [1],
        },
        // GPU0:              □□□□
        // GPU1:       ■■■■■■■■■
        {
            resourceId: resource1._id,
            userId: mongoose.Types.ObjectId('777777777777777777777777'),
            startTimestamp: new Date('2021-08-13T14:00:00'),
            endTimestamp: new Date('2021-08-13T16:00:00'),
            gpuIndices: [0],
        },
        // GPU0:                □□□□
        // GPU1:       ■■■■■■■■■□□□□
        {
            resourceId: resource1._id,
            userId: mongoose.Types.ObjectId('777777777777777777777777'),
            startTimestamp: new Date('2021-08-13T15:00:00'),
            endTimestamp: new Date('2021-08-13T16:00:00'),
            gpuIndices: [0, 1],
        },
        // Close with booking1: ■
        // startTimestamp: new Date('2021-08-17T08:00:00'),
        // endTimestamp: new Date('2021-08-17T12:00:00'),
        // GPU0:       ■■■■■■■■■□□□□
        // GPU1:       ■■■■■■■■■
        {
            resourceId: resource1._id,
            userId: mongoose.Types.ObjectId('888888888888888888888888'),
            startTimestamp: new Date('2021-08-17T12:00:00'),
            endTimestamp: new Date('2021-08-17T15:00:00'),
            gpuIndices: [0],
        },
    ];

    invalidTimeBookings = [
        // Conflicts with booking2: ■
        // startTimestamp: new Date('2021-08-13T12:00:00'),
        // endTimestamp: new Date('2021-08-13T15:00:00'),
        // GPU1:       ■■■■■■■■■
        //           □□□□
        {
            resourceId: resource1._id,
            userId: mongoose.Types.ObjectId('777777777777777777777777'),
            startTimestamp: new Date('2021-08-13T11:00:00'),
            endTimestamp: new Date('2021-08-13T13:00:00'),
            gpuIndices: [1],
        },
        // GPU1:       ■■■■■■■■■
        //                    □□□□
        {
            resourceId: resource1._id,
            userId: mongoose.Types.ObjectId('777777777777777777777777'),
            startTimestamp: new Date('2021-08-13T14:00:00'),
            endTimestamp: new Date('2021-08-13T16:00:00'),
            gpuIndices: [1],
        },
        // GPU1:       ■■■■■■■■■
        //                □□□□
        {
            resourceId: resource1._id,
            userId: mongoose.Types.ObjectId('777777777777777777777777'),
            startTimestamp: new Date('2021-08-13T13:00:00'),
            endTimestamp: new Date('2021-08-13T14:00:00'),
            gpuIndices: [1],
        },
        // GPU1:       ■■■■■■■■■
        //            □□□□□□□□□□□□
        {
            resourceId: resource1._id,
            userId: mongoose.Types.ObjectId('777777777777777777777777'),
            startTimestamp: new Date('2021-08-13T11:00:00'),
            endTimestamp: new Date('2021-08-13T16:00:00'),
            gpuIndices: [1],
        },
        // GPU1:       ■■■■■■■■■
        //             □□□□□□□□□
        {
            resourceId: resource1._id,
            userId: mongoose.Types.ObjectId('777777777777777777777777'),
            startTimestamp: new Date('2021-08-13T12:00:00'),
            endTimestamp: new Date('2021-08-13T15:00:00'),
            gpuIndices: [1],
        },
        // GPU0:     □□□□
        // GPU1:       ■■■■■■■■■
        //           □□□□
        {
            resourceId: resource1._id,
            userId: mongoose.Types.ObjectId('777777777777777777777777'),
            startTimestamp: new Date('2021-08-13T11:00:00'),
            endTimestamp: new Date('2021-08-13T13:00:00'),
            gpuIndices: [0, 1],
        },

        // Conflicts with booking1: ■
        // startTimestamp: new Date('2021-08-17T08:00:00'),
        // endTimestamp: new Date('2021-08-17T12:00:00'),
        // GPU0:       ■■■■■■■■■
        // GPU1:       ■■■■■■■■■
        //           □□□□
        {
            resourceId: resource1._id,
            userId: mongoose.Types.ObjectId('888888888888888888888888'),
            startTimestamp: new Date('2021-08-17T07:00:00'),
            endTimestamp: new Date('2021-08-17T09:00:00'),
            gpuIndices: [1],
        },
    ];

    await resourcesColl.insertOne(resource1);
    await bookingsColl.insertMany([booking1, booking2]);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
    await mongoose.connection.db.dropCollection('bookings');
    await mongoose.connection.db.dropCollection('resources');
});

/**
 * After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

function expectDbBookingMatchWithBooking(dbBooking, booking) {
    expect(dbBooking).toBeTruthy();
    expect(dbBooking.resourceId).toEqual(booking.resourceId);
    expect(dbBooking.userId).toEqual(booking.userId);
    expect(dbBooking.startTimestamp).toEqual(booking.startTimestamp);
    expect(dbBooking.endTimestamp).toEqual(booking.endTimestamp);
    expect(dbBooking.gpuIndices.toObject()).toEqual(booking.gpuIndices);
}

it('get all bookings', async () => {
    const bookings = await retrieveAllBookings();

    expect(bookings).toBeTruthy();
    expect(bookings).toHaveLength(2);

    expectDbBookingMatchWithBooking(bookings[0], booking1);
    expectDbBookingMatchWithBooking(bookings[1], booking2);
});

it('create new booking', async () => {
    const newBooking = await createBooking(booking3);
    const dbBooking = await Booking.findById(newBooking._id);

    expectDbBookingMatchWithBooking(dbBooking, booking3);
});

it('create new booking GPU out of range', async () => {
    expect.assertions(1);
    try {
        await createBooking(invalidGPUBooking1);
    } catch (err) {
        // Do nothing as correct action
        expect(err.message).toBeTruthy();
    }
});

it('create new booking time agreement', async () => {
    for (let i = 0; i < validTimeBookings.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const newBooking = await createBooking(validTimeBookings[i]);

        expectDbBookingMatchWithBooking(newBooking, validTimeBookings[i]);
        // eslint-disable-next-line no-await-in-loop
        await Booking.findByIdAndDelete(newBooking._id);
    }
});

it('create new booking time conflict', async () => {
    expect.assertions(invalidTimeBookings.length);
    for (let i = 0; i < invalidTimeBookings.length; i += 1) {
        try {
            // eslint-disable-next-line no-await-in-loop
            await createBooking(invalidTimeBookings[i]);
        } catch (err) {
            // Do nothing as expected action
            expect(err.message).toBeTruthy();
        }
    }
});

it("retrieve user's bookings", async () => {
    const bookings = await retrieveBookingsByUser(booking1.userId);

    expect(bookings).toBeTruthy();
    expect(bookings).toHaveLength(1);
    expectDbBookingMatchWithBooking(bookings[0], booking1);
});

it('retrieve bookings for a resource', async () => {
    const bookings = await retrieveBookingsByResource(booking1.resourceId);

    expect(bookings).toBeTruthy();
    expect(bookings).toHaveLength(2);
    expectDbBookingMatchWithBooking(bookings[0], booking1);
    expectDbBookingMatchWithBooking(bookings[1], booking2);
});

it('update booking info', async () => {
    const updatedBooking2Info = {
        startTimestamp: new Date('2021-08-19T13:24:00'),
        endTimestamp: new Date('2021-08-19T14:55:30'),
        gpuIndices: [0],
    };
    await updateBooking(booking2._id, updatedBooking2Info);
    const dbBooking = await Booking.findById(booking2._id);

    expect(dbBooking).toBeTruthy();
    expect(dbBooking.resourceId).toEqual(booking2.resourceId);
    expect(dbBooking.userId).toEqual(booking2.userId);
    expect(dbBooking.startTimestamp).toEqual(
        updatedBooking2Info.startTimestamp,
    );
    expect(dbBooking.endTimestamp).toEqual(updatedBooking2Info.endTimestamp);
    expect(dbBooking.gpuIndices.toObject()).toEqual(
        updatedBooking2Info.gpuIndices,
    );
});

it('update booking time agreement', async () => {
    const updatedBooking2Info = {
        startTimestamp: booking2.startTimestamp,
        endTimestamp: new Date('2021-08-13T16:00:00'),
        gpuIndices: [1],
    };
    await updateBooking(booking2._id, updatedBooking2Info);
    const dbBooking = await Booking.findById(booking2._id);

    expect(dbBooking).toBeTruthy();
    expect(dbBooking.resourceId).toEqual(booking2.resourceId);
    expect(dbBooking.userId).toEqual(booking2.userId);
    expect(dbBooking.startTimestamp).toEqual(
        updatedBooking2Info.startTimestamp,
    );
    expect(dbBooking.endTimestamp).toEqual(updatedBooking2Info.endTimestamp);
    expect(dbBooking.gpuIndices.toObject()).toEqual(
        updatedBooking2Info.gpuIndices,
    );
});

it('update booking time conflict', async () => {
    expect.assertions(7);
    // Conflicts with booking1
    const updatedBooking2Info = {
        startTimestamp: new Date('2021-08-17T09:00:00'),
        endTimestamp: new Date('2021-08-17T13:00:00'),
        gpuIndices: [0],
    };
    try {
        await updateBooking(booking2._id, updatedBooking2Info);
    } catch (err) {
        expect(err).toBeTruthy();
    }
    const dbBooking = await Booking.findById(booking2._id);

    expect(dbBooking).toBeTruthy();
    expect(dbBooking.resourceId).toEqual(booking2.resourceId);
    expect(dbBooking.userId).toEqual(booking2.userId);
    expect(dbBooking.startTimestamp).toEqual(booking2.startTimestamp);
    expect(dbBooking.endTimestamp).toEqual(booking2.endTimestamp);
    expect(dbBooking.gpuIndices.toObject()).toEqual(booking2.gpuIndices);
});

it('delete booking', async () => {
    await deleteBooking(booking2._id);
    const bookings = await Booking.find({});

    expect(bookings).toBeTruthy();
    expect(bookings).toHaveLength(1);
    expectDbBookingMatchWithBooking(bookings[0], booking1);
});
