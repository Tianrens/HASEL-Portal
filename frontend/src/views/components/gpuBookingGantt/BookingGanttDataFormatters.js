function formatBookingData({ bookingData, currentBookingData, thisUsersId }) {
    const formattedData = [];

    if (currentBookingData) {
        if (!currentBookingData.noGPUSelected && !currentBookingData.timingInvalid) {
            formattedData.push({
                bookingId: bookingData.length,
                startTimestamp: currentBookingData.startTimestamp,
                endTimestamp: currentBookingData.endTimestamp,
                gpuIndices: currentBookingData.gpuIndices,
                myBooking: true,
                currentBooking: true,
            });
        }
    }

    bookingData.forEach((booking, index) => {
        if (!currentBookingData || booking._id !== currentBookingData.id) {
            formattedData.push({
                bookingId: index,
                startTimestamp: booking.startTimestamp,
                endTimestamp: booking.endTimestamp,
                gpuIndices: booking.gpuIndices,
                myBooking: booking.userId._id === thisUsersId,
                currentBooking: false,
            });
        }
    });

    return formattedData;
}

function formatResourceData(numGPUs) {
    const formattedData = [];

    for (let i = 0; i < numGPUs; i += 1) {
        formattedData.push({ gpuId: i, gpuName: `GPU ${i}` });
    }

    return formattedData;
}

export { formatResourceData, formatBookingData };
