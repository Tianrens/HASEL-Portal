import { connectToDatabase } from './dbConnect';
import { initDummyData } from './initDummyData';

require('dotenv').config();

export async function initDb() {
    await connectToDatabase();
    if (process.env.NODE_ENV !== 'production') {
        await initDummyData();
        console.log('Added 3 dummy resources to the database');
    }
}
