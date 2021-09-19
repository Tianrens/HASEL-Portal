// eslint-disable-next-line no-unused-vars
function formatBookingData(bookingData, thisUsersId) {
    // TODO: Format the actual data (myBooking == true if the userId on the booking matches thisUsersId)

    const formattedData = [
        {
            bookingId: 2,
            startTimestamp: new Date(2021, 8, 17, 9, 30, 0),
            endTimestamp: new Date(2021, 8, 18, 15, 30, 0),
            gpuIndices: [1],
            myBooking: false,
        },
        {
            bookingId: 3,
            startTimestamp: new Date(2021, 8, 20, 9, 0, 0),
            endTimestamp: new Date(2021, 8, 25, 22, 0, 0),
            gpuIndices: [1, 2, 3, 4],
            myBooking: false,
        },
        {
            bookingId: 4,
            startTimestamp: new Date('09/09/2021'),
            endTimestamp: new Date('09/13/2021'),
            gpuIndices: [1],
            myBooking: false,
        },

        {
            bookingId: 6,
            startTimestamp: new Date('09/01/2021'),
            endTimestamp: new Date('09/02/2021'),
            gpuIndices: [2],
            myBooking: true,
        },
        {
            bookingId: 7,
            startTimestamp: new Date('09/05/2021'),
            endTimestamp: new Date('09/08/2021'),
            gpuIndices: [2],
            myBooking: true,
        },
        {
            bookingId: 8,
            startTimestamp: new Date('09/09/2021'),
            endTimestamp: new Date('09/15/2021'),
            gpuIndices: [2],
            myBooking: false,
        },

        {
            bookingId: 10,
            startTimestamp: new Date('09/01/2021'),
            endTimestamp: new Date('09/05/2021'),
            gpuIndices: [3],
            myBooking: false,
        },
        {
            bookingId: 11,
            startTimestamp: new Date('09/08/2021'),
            endTimestamp: new Date('09/09/2021'),
            gpuIndices: [3],
            myBooking: true,
        },
        {
            bookingId: 12,
            startTimestamp: new Date('09/12/2021'),
            endTimestamp: new Date('09/14/2021'),
            gpuIndices: [3],
            myBooking: false,
        },

        {
            bookingId: 14,
            startTimestamp: new Date('09/01/2021'),
            endTimestamp: new Date('09/02/2021'),
            gpuIndices: [4],
            myBooking: true,
        },
        {
            bookingId: 15,
            startTimestamp: new Date('09/04/2021'),
            endTimestamp: new Date('09/06/2021'),
            gpuIndices: [4],
            myBooking: false,
        },
        {
            bookingId: 16,
            startTimestamp: new Date('09/08/2021'),
            endTimestamp: new Date('09/10/2021'),
            gpuIndices: [4],
            myBooking: false,
        },
        {
            bookingId: 17,
            startTimestamp: new Date('09/14/2021'),
            endTimestamp: new Date('09/16/2021'),
            gpuIndices: [1, 3, 4],
            myBooking: false,
        },
    ];

    return formattedData;
}

// eslint-disable-next-line no-unused-vars
function formatResourceData(resourceData) {
    // TODO: Format the actual data (probably just extract the number of GPUs)

    const formattedData = [
        {
            gpuId: 1,
            gpuName: 'GPU 1',
        },
        {
            gpuId: 2,
            gpuName: 'GPU 2',
        },
        {
            gpuId: 3,
            gpuName: 'GPU 3',
        },
        {
            gpuId: 4,
            gpuName: 'GPU 4',
        },
    ];

    return formattedData;
}

export { formatResourceData, formatBookingData };
