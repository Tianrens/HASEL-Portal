import { retrieveWorkstationById } from '../../../db/dao/workstationDao';
import HTTP from './http_codes';

/**
 * Adds the corresponding workstation object given the workstationId in the request.
 * If the workstation can't be found, returns a NOT_FOUND error.
 */
async function getWorkstation(req, res, next) {
    const { workstationId } = req.params;
    const workstation = await retrieveWorkstationById(workstationId);
    if (!workstation) {
        return res
            .status(HTTP.NOT_FOUND)
            .send(`Could not find workstation with id: ${workstation}`);
    }

    req.workstation = workstation;
    return next();
}

export { getWorkstation };
