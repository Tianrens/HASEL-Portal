import mongoose from 'mongoose';

const ResourceSchema = mongoose.Schema;

const resourceSchema = new ResourceSchema(
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        numGPUs: { type: Number, required: true },
        gpuDescription: { type: String, required: true },
        ramDescription: { type: String, required: true },
        cpuDescription: { type: String, required: true },
    },
    {
        timestamps: {},
    },
);

const Resource = mongoose.model('Resource', resourceSchema);

export { Resource };
