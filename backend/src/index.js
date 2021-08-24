import express from 'express';
import http from 'http';
import path from 'path';
import mongoose from 'mongoose';
import routes from './routes';

const app = express();
const server = http.createServer(app);

require('dotenv').config();

const mongoUri = process.env.ATLAS_URI;
mongoose.connect(
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

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/', routes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));

    app.get('/*', (_req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
