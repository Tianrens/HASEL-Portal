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
import { Booking } from '../../schemas/bookingSchema';

let mongo;
let booking1;
let booking2;
let booking3;
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
    const bookingsColl = await mongoose.connection.db.createCollection(
        'bookings',
    );

    booking1 = {
        resourceId: mongoose.Types.ObjectId('666666666666666666666666'),
        userId: mongoose.Types.ObjectId('888888888888888888888888'),
        startTimestamp: new Date('2021-08-17T16:24:00'),
        endTimestamp: new Date('2021-08-17T17:55:30'),
        numGPUs: 2,
    };

    booking2 = {
        resourceId: mongoose.Types.ObjectId('666666666666666666666666'),
        userId: mongoose.Types.ObjectId('777777777777777777777777'),
        startTimestamp: new Date('2021-08-13T12:00:00'),
        endTimestamp: new Date('2021-08-13T13:30:30'),
        numGPUs: 4,
    };

    booking3 = {
        resourceId: mongoose.Types.ObjectId('555555555555555555555555'),
        userId: mongoose.Types.ObjectId('999999999999999999999999'),
        startTimestamp: new Date('2021-08-13T09:58:00'),
        endTimestamp: new Date('2021-08-13T12:30:42'),
        numGPUs: 1,
    };

    await bookingsColl.insertMany([booking1, booking2]);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
    await mongoose.connection.db.dropCollection('bookings');
});

/**
 * After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

it('get all bookings', async () => {
    const bookings = await retrieveAllBookings();

    expect(bookings).toBeTruthy();
    expect(bookings).toHaveLength(2);

    expect(bookings[0].resourceId).toEqual(booking1.resourceId);
    expect(bookings[0].userId).toEqual(booking1.userId);
    expect(bookings[0].startTimestamp).toEqual(booking1.startTimestamp);
    expect(bookings[0].endTimestamp).toEqual(booking1.endTimestamp);
    expect(bookings[0].numGPUs).toBe(booking1.numGPUs);

    expect(bookings[1].resourceId).toEqual(booking2.resourceId);
    expect(bookings[1].userId).toEqual(booking2.userId);
    expect(bookings[1].startTimestamp).toEqual(booking2.startTimestamp);
    expect(bookings[1].endTimestamp).toEqual(booking2.endTimestamp);
    expect(bookings[1].numGPUs).toBe(booking2.numGPUs);
});

it('create new booking', async () => {
    const newBooking = await createBooking(booking3);
    const dbBooking = await Booking.findById(newBooking._id);

    expect(dbBooking).toBeTruthy();
    expect(dbBooking.resourceId).toEqual(booking3.resourceId);
    expect(dbBooking.userId).toEqual(booking3.userId);
    expect(dbBooking.startTimestamp).toEqual(booking3.startTimestamp);
    expect(dbBooking.endTimestamp).toEqual(booking3.endTimestamp);
    expect(dbBooking.numGPUs).toBe(booking3.numGPUs);
});

it("retrieve user's bookings", async () => {
    const bookings = await retrieveBookingsByUser(booking1.userId);

    expect(bookings).toBeTruthy();
    expect(bookings).toHaveLength(1);
    expect(bookings[0]._id).toEqual(booking1._id);
});

it('retrieve bookings for a resource', async () => {
    const bookings = await retrieveBookingsByResource(booking1.resourceId);

    expect(bookings).toBeTruthy();
    expect(bookings).toHaveLength(2);
    expect(bookings[0]._id).toEqual(booking1._id);
    expect(bookings[1]._id).toEqual(booking2._id);
});

it('update booking info', async () => {
    const updatedBooking2Info = {
        startTimestamp: new Date('2021-08-19T13:24:00'),
        endTimestamp: new Date('2021-08-19T14:55:30'),
        numGPUs: 3,
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
    expect(dbBooking.numGPUs).toBe(updatedBooking2Info.numGPUs);
});

it('delete booking', async () => {
    await deleteBooking(booking2._id);
    const bookings = await Booking.find({});

    expect(bookings).toBeTruthy();
    expect(bookings).toHaveLength(1);
    expect(bookings[0]._id).toEqual(booking1._id);
});
