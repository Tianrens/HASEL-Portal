import mongoose from 'mongoose';

const SignUpRequestSchema = mongoose.Schema;

const signUpRequestSchema = new SignUpRequestSchema(
    {
        userId: {
            type: SignUpRequestSchema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        allocatedResourceId: {
            type: SignUpRequestSchema.Types.ObjectId,
            ref: 'Resource',
            required: true,
        },
        supervisorName: String,
        comments: { type: String, default: '' },
        status: {
            type: String,
            required: true,
            enum: ['PENDING', 'ACTIVE', 'EXPIRED', 'DECLINED'],
        },
        startDate: Date,
        endDate: Date,
        notifiedExpiring: { type: Boolean, default: false },
    },
    {
        timestamps: {},
    },
);

const SignUpRequest = mongoose.model('SignUpRequest', signUpRequestSchema);

export { SignUpRequest };
