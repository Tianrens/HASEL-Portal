import mongoose from 'mongoose';

const SignUpRequestSchema = mongoose.Schema;

const signUpRequestSchema = new SignUpRequestSchema(
    {
        user: {
            type: SignUpRequestSchema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        allocatedResource: {
            type: SignUpRequestSchema.Types.ObjectId,
            ref: 'Resource',
            required: true,
        },
        supervisorName: String,
        comments: String,
        status: {
            type: String,
            required: true,
            enum: ['PENDING', 'ACTIVE', 'EXPIRED', 'DECLINED'],
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
    },
    {
        timestamps: {},
    },
);

const SignUpRequest = mongoose.model('SignUpRequest', signUpRequestSchema);

export { SignUpRequest };
