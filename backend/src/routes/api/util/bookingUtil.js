function getBookingsByStatus(status, bookings) {
    const currentTime = Date.now();

    switch(status.toUpperCase()) {
    case 'ACTIVE': // currrent + ongoing
        return bookings.filter((booking) => currentTime <= booking.endTimestamp);
    default:
        return null;
    }
}

export { getBookingsByStatus };
