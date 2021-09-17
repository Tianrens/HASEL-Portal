import mongoose from 'mongoose';

const BookingSchema = mongoose.Schema;

const bookingSchema = new BookingSchema(
    {
        workstationId: {
            type: BookingSchema.Types.ObjectId,
            ref: 'Workstation',
            required: true,
        },
        userId: {
            type: BookingSchema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        startTimestamp: { type: Date, required: true },
        endTimestamp: { type: Date, required: true },
        gpuIndices: [{ type: Number, required: true }],
    },
    {
        timestamps: {},
    },
);

const Booking = mongoose.model('Booking', bookingSchema);

export { Booking };
