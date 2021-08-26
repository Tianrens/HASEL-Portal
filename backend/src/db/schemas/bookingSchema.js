import mongoose from 'mongoose';

const BookingSchema = mongoose.Schema;

const bookingSchema = new BookingSchema(
    {
        resource: {
            type: BookingSchema.Types.ObjectId,
            ref: 'Resource',
            required: true,
        },
        user: {
            type: BookingSchema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        startTimestamp: { type: Date, required: true },
        endTimestamp: { type: Date, required: true },
        numGPUs: { type: Number, required: true },
    },
    {
        timestamps: {},
    },
);

const Booking = mongoose.model('Booking', bookingSchema);

export { Booking };
