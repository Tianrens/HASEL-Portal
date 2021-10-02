import express from 'express';
import http from 'http';
import path from 'path';
import routes from './routes';
import { initCron } from './cron';
import { initDb } from './db/utils/initDb';

const app = express();
const server = http.createServer(app);

require('dotenv').config();

initDb();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/', routes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));

    app.get('/*', (_req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

initCron();

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
