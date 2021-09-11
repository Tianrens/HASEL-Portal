import mongoose from 'mongoose';

const BookingSchema = mongoose.Schema;

const bookingSchema = new BookingSchema(
    {
        resourceId: {
            type: BookingSchema.Types.ObjectId,
            ref: 'Resource',
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
