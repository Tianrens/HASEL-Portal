import dayjs from 'dayjs';

function dateRangeOverlaps(start1, end1, start2, end2) {
    if (start1 < start2 && start2 < end1) return true; // b starts in a
    if (start1 < end2 && end2 < end1) return true; // b ends in a
    if (start2 < start1 && end1 < end2) return true; // a in b
    return false;
}

function formatBookingData({ bookingData, currentBookingData, thisUsersId }) {
    const formattedData = [];
    let hasConflicts = false;
    const currentBookingValid =
        !currentBookingData?.noGPUSelected && !currentBookingData?.timingInvalid;
    if (currentBookingData) {
        if (currentBookingValid) {
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
                userName: `${booking.userId.firstName} ${booking.userId.lastName}`,
                userUPI: booking.userId.upi,
                startTimestamp: booking.startTimestamp,
                endTimestamp: booking.endTimestamp,
                gpuIndices: booking.gpuIndices,
                myBooking: booking.userId._id === thisUsersId,
                currentBooking: false,
            });
        }
        if (currentBookingData) {
            const timesOverlap = dateRangeOverlaps(
                dayjs(booking.startTimestamp).valueOf(),
                dayjs(booking.endTimestamp).valueOf(),
                currentBookingData.startTimestamp.valueOf(),
                currentBookingData.endTimestamp.valueOf(),
            );
            const gpuOverlaps = booking.gpuIndices.filter((gpu) =>
                currentBookingData.gpuIndices.includes(gpu),
            );
            if (timesOverlap && gpuOverlaps.length && currentBookingValid) {
                formattedData[0].errorBooking = true;
                hasConflicts = true;
            }
        }
    });

    return { formattedData, hasConflicts };
}

function formatResourceData(numGPUs) {
    const formattedData = [];

    for (let i = 0; i < numGPUs; i += 1) {
        formattedData.push({ gpuId: i, gpuName: `GPU ${i}` });
    }

    return formattedData;
}

export { formatResourceData, formatBookingData };
