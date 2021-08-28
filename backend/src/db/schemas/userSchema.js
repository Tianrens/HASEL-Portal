import mongoose from 'mongoose';

const UserSchema = mongoose.Schema;

const userSchema = new UserSchema(
    {
        email: {
            type: String,
            required: [true, 'An email is required'],
            unique: true,
        },
        currentRequestId: {
            type: UserSchema.Types.ObjectId,
            ref: 'SignUpRequest',
        },
        upi: { type: String, required: true, unique: true },
        authUserId: { type: String, required: true },
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
