import mongoose from 'mongoose';

const WorkstationSchema = mongoose.Schema;

const workstationSchema = new WorkstationSchema(
    {
        name: { type: String, required: true },
        host: { type: String, required: true },
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

const Workstation = mongoose.model('Workstation', workstationSchema);

export { Workstation };
