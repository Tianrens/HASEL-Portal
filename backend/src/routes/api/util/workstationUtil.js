import { retrieveWorkstationById } from '../../../db/dao/workstationDao';
import HTTP from './http_codes';

async function getWorkstation(req, res, next) {
    const { workstationId } = req.params;
    const workstation = await retrieveWorkstationById(workstationId);
    if (!workstation) {
        return res
            .status(HTTP.NOT_FOUND)
            .send(`Could not find booking with id: ${workstation}`);
    }

    req.workstation = workstation;
    return next();
}

export { getWorkstation };
