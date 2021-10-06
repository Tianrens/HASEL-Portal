import mongoose from 'mongoose';
import mongooseArchive from 'mongoose-archive';

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

workstationSchema.plugin(mongooseArchive);

workstationSchema.pre('countDocuments', function removeArchived() {
    if (!this.getQuery().archivedAt) this.where('archivedAt').exists(false);
});

const Workstation = mongoose.model('Workstation', workstationSchema);

export { Workstation };
