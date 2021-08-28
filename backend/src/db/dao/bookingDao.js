const { Booking } = require('../schemas/bookingSchema');

async function createBooking(booking) {
    const dbBooking = new Booking(booking);
    await dbBooking.save();

    return dbBooking;
}

async function retrieveAllBookings() {
    return Booking.find({});
}

async function retrieveBookingsByUser(userId) {
    return Booking.find({ userId });
}

async function retrieveBookingsByResource(resourceId) {
    return Booking.find({ resourceId });
}

async function updateBooking(bookingId, newBookingInfo) {
    await Booking.updateOne({ _id: bookingId }, newBookingInfo);
}

async function deleteBooking(bookingId) {
    await Booking.deleteOne({ _id: bookingId });
}

export {
    createBooking,
    retrieveAllBookings,
    retrieveBookingsByUser,
    retrieveBookingsByResource,
    updateBooking,
    deleteBooking,
};
