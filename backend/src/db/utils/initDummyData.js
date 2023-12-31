import {
    createWorkstation,
    retrieveAllWorkstations,
} from '../dao/workstationDao';

async function initWorkstations() {
    const zeus = await createWorkstation({
        name: 'ZEUS',
        host: 'localhost:5678',
        location: '401.401 PC 1',
        numGPUs: 3,
        gpuDescription: 'GeForce RTX 3080 x3',
        ramDescription: '64 GB',
        cpuDescription: '2.6 GHz',
    });
    const apollo = await createWorkstation({
        name: 'Apollo',
        host: 'localhost:5679',
        location: '401.401 PC 2',
        numGPUs: 4,
        gpuDescription: 'GeForce RTX 3080 x4',
        ramDescription: '64 GB',
        cpuDescription: '2.6 GHz',
    });
    const athena = await createWorkstation({
        name: 'Athena',
        host: 'localhost:5680',
        location: '401.401 PC 3',
        numGPUs: 5,
        gpuDescription: 'GeForce RTX 3080 x5',
        ramDescription: '64 GB',
        cpuDescription: '2.6 GHz',
    });

    return [zeus, apollo, athena];
}

export async function initDummyData() {
    const workstations = await retrieveAllWorkstations();
    if (workstations.length === 0) {
        return initWorkstations();
    }
    return null;
}
