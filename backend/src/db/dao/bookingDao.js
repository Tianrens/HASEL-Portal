import { addMonths } from 'date-fns';

const { Booking } = require('../schemas/bookingSchema');
const { Workstation } = require('../schemas/workstationSchema');

async function isBookingGPUValid(booking) {
    // Check if booked GPUs are valid
    const workstation = await Workstation.findById(booking.workstationId);
    for (let i = 0; i < booking.gpuIndices.length; i += 1) {
        if (
            booking.gpuIndices[i] < 0 ||
            booking.gpuIndices[i] >= workstation.numGPUs
        ) {
            // Booking indexes were out of range
            return false;
        }
    }
    return true;
}

async function isBookingTimeValid(booking) {
    // Check if booking has no conflicts
    const numConflicts = await Booking.countDocuments({
        _id: { $ne: booking._id },
        workstationId: booking.workstationId,
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

async function retrieveBookingsByWorkstationForGantt(workstationId) {
    const currentTime = Date.now();
    const endTime = addMonths(currentTime, 1);

    const bookings = await Booking.find({
        workstationId,
        startTimestamp: { $lte: endTime },
        endTimestamp: { $gte: currentTime },
    }).populate('userId', 'firstName lastName');

    return bookings;
}

async function retrieveBookingsByWorkstation(
    workstationId,
    page,
    limit,
    status,
) {
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
        workstationId,
        startTimestamp: startTimestampBoolean,
        endTimestamp: endTimestampBoolean,
    })
        .sort(sortObject)
        .skip(page > 0 ? (page - 1) * limit : 0) // Skips start at 0, pages start at 1
        .limit(limit)
        .populate('userId', 'firstName lastName');

    const count = await Booking.countDocuments({
        workstationId,
        startTimestamp: startTimestampBoolean,
        endTimestamp: endTimestampBoolean,
    });

    return { bookings, count };
}

async function updateBooking(bookingId, newBookingInfo) {
    const originalBooking = await Booking.findById(bookingId);
    const modifiedBooking = {
        _id: originalBooking._id,
        workstationId: originalBooking.workstationId,
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
    retrieveBookingsByWorkstationForGantt,
    retrieveBookingsByWorkstation,
    updateBooking,
    deleteBooking,
};
