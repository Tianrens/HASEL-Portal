import mongoose from 'mongoose';

const UserSchema = mongoose.Schema;
const { Types } = mongoose.Schema.Types;

const userSchema = new UserSchema(
    {
        email: {
            type: String,
            required: [true, 'An email is required'],
            unique: true,
        },
        currentRequest: { type: Types.ObjectId, ref: 'SignUpRequest' },
        upi: { type: String, required: true, unique: true },
        authUserId: { type: Types.Long, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        type: {
            type: String,
            required: true,
            enum: [
                'STUDENT',
                'STAFF',
                'ADMIN',
                'SUPERADMIN',
                'ACADEMIC',
                'OTHER',
            ],
        },
    },
    {
        timestamps: {},
    },
);

const User = mongoose.model('User', userSchema);

export { User };
