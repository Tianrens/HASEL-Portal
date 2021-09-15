const { Booking } = require('../schemas/bookingSchema');
const { Resource } = require('../schemas/resourceSchema');

async function isBookingGPUValid(booking) {
    // Check if booked GPUs are valid
    const resource = await Resource.findById(booking.resourceId);
    for (let i = 0; i < booking.gpuIndices.length; i += 1) {
        if (
            booking.gpuIndices[i] < 0 ||
            booking.gpuIndices[i] >= resource.numGPUs
        ) {
            // Booking indexes were out of range
            return false;
        }
    }
    return true;
}

async function isBookingTimeValid(booking) {
    // Check if booking has no conflicts
    const numConflicts = await Booking.count({
        _id: { $ne: booking._id },
        resourceId: booking.resourceId,
        gpuIndices: { $in: booking.gpuIndices },
        startTimestamp: { $lt: booking.endTimestamp },
        endTimestamp: { $gt: booking.startTimestamp },
    });

    // If there are no conflicts, then the booking is possible
    return numConflicts === 0;
}

function isBookingPeriodValid(booking) {
    // Check if endTimestamp before startTimestamp
    const start = new Date(booking.startTimestamp);
    const end = new Date(booking.endTimestamp);
    return start < end;
}

async function checkBookingValid(booking) {
    if (!isBookingPeriodValid(booking)) {
        throw new Error('End date is before the start date');
    } else if (!(await isBookingGPUValid(booking))) {
        throw new Error('GPU indices were out of range');
    } else if (!(await isBookingTimeValid(booking))) {
        throw new Error('Booking had conflicting times');
    }
}

async function createBooking(booking) {
    await checkBookingValid(booking);
    const dbBooking = new Booking(booking);
    await dbBooking.save();
    return dbBooking;
}

async function retrieveAllBookings() {
    return Booking.find({});
}

async function retrieveBookingById(bookingId) {
    return Booking.findById(bookingId);
}

async function retrieveBookingsByUser(userId) {
    return Booking.find({ userId });
}

async function retrieveBookingsByResource(resourceId, page, limit, status) {
    const currentTime = Date.now();
    let startTimestampBoolean;
    let endTimestampBoolean;
    let sortObject;

    switch (status.toUpperCase()) {
        case 'ALL':
            startTimestampBoolean = { $exists: true };
            endTimestampBoolean = { $exists: true };
            sortObject = { startTimestamp: -1 }; // latest first
            break;
        case 'ACTIVE': // currrent + ongoing
            startTimestampBoolean = { $exists: true };
            endTimestampBoolean = { $gte: currentTime };
            sortObject = { startTimestamp: 1 }; // upcoming first
            break;
        case 'FUTURE':
            startTimestampBoolean = { $gte: currentTime };
            endTimestampBoolean = { $exists: true };
            sortObject = { startTimestamp: 1 }; // upcoming first
            break;
        case 'CURRENT':
            startTimestampBoolean = { $lte: currentTime };
            endTimestampBoolean = { $gte: currentTime };
            sortObject = { startTimestamp: 1 }; // upcoming first
            break;
        case 'PAST':
            startTimestampBoolean = { $exists: true };
            endTimestampBoolean = { $lte: currentTime };
            sortObject = { endTimestamp: -1 }; // latest first
            break;
        default:
            throw new Error('Invalid status parameter');
    }
    const bookings = await Booking.find({
        resourceId,
        startTimestamp: startTimestampBoolean,
        endTimestamp: endTimestampBoolean,
    })
        .sort(sortObject)
        .skip(page > 0 ? (page - 1) * limit : 0) // Skips start at 0, pages start at 1
        .limit(limit);

    const count = await Booking.countDocuments({
        resourceId,
        startTimestamp: startTimestampBoolean,
        endTimestamp: endTimestampBoolean,
    });

    return { bookings, count };
}

async function updateBooking(bookingId, newBookingInfo) {
    const originalBooking = await Booking.findById(bookingId);
    const modifiedBooking = {
        _id: originalBooking._id,
        resourceId: originalBooking.resourceId,
        startTimestamp: newBookingInfo.startTimestamp,
        endTimestamp: newBookingInfo.endTimestamp,
        gpuIndices: newBookingInfo.gpuIndices,
    };

    await checkBookingValid(modifiedBooking);
    await Booking.updateOne({ _id: bookingId }, newBookingInfo);
}

async function deleteBooking(bookingId) {
    await Booking.deleteOne({ _id: bookingId });
}

export {
    createBooking,
    retrieveAllBookings,
    retrieveBookingById,
    retrieveBookingsByUser,
    retrieveBookingsByResource,
    updateBooking,
    deleteBooking,
};
