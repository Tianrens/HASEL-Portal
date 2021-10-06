import mongoose from 'mongoose';
import mongooseArchive from 'mongoose-archive';
 
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

bookingSchema.plugin(mongooseArchive);

bookingSchema.pre('countDocuments', function removeArchived() {
    if (!this.getQuery().archivedAt) this.where('archivedAt').exists(false);
});

const Booking = mongoose.model('Booking', bookingSchema);

export { Booking };
