import mongoose from 'mongoose';

const mongoUri = process.env.ATLAS_URI;

export function connectToDatabase() {
    return mongoose.connect(
        mongoUri,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err) => {
            if (err) {
                throw err;
            } else {
                console.log('Successfully connected to MongoDB Atlas.');
            }
        },
    );
}
