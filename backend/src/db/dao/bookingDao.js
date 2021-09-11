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

async function createBooking(booking) {
    if (!(await isBookingGPUValid(booking))) {
        throw new Error('GPU indices were out of range');
    } else if (!(await isBookingTimeValid(booking))) {
        throw new Error('Booking had conflicting times');
    } else {
        const dbBooking = new Booking(booking);
        await dbBooking.save();
        return dbBooking;
    }
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

async function retrieveBookingsByResource(resourceId) {
    return Booking.find({ resourceId });
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

    if (!(await isBookingGPUValid(modifiedBooking))) {
        throw new Error('GPU indices were out of range');
    } else if (!(await isBookingTimeValid(modifiedBooking))) {
        throw new Error('Booking had conflicting times');
    } else {
        await Booking.updateOne({ _id: bookingId }, newBookingInfo);
    }
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
