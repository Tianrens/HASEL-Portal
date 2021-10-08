import schedule from 'node-schedule';
import { retrieveAllWorkstations, updateWorkstation } from '../db/dao/workstationDao';
import { checkServerOnline } from '../ssh';

require('dotenv').config();

async function updateWorkstationOnlineStatus() {
    const workstations = await retrieveAllWorkstations();

    // eslint-disable-next-line no-restricted-syntax
    for (const workstation of workstations) {
        const ip = workstation.host;
        // eslint-disable-next-line no-await-in-loop
        const isOnline = await checkServerOnline(ip);

        workstation.status = isOnline;
        updateWorkstation(workstation._id, workstation);
    }
}

export async function checkServerStatus() {
    schedule.scheduleJob(`*/${process.env.PING_RATE} * * * *`, () => {
        updateWorkstationOnlineStatus();
    });
}
