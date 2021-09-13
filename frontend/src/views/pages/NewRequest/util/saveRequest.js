import HTTP from '../../../../hooks/util/httpCodes';
import { authRequest } from '../../../../hooks/util/authRequest';
import { fetchUser } from '../../../../state/docs/userDoc';

export async function saveRequest(supervisor, workstation, comments) {
    const res = await authRequest('/api/request', 'POST', {
        allocatedResourceId: workstation,
        supervisorName: supervisor,
        comments
    });
    
    if (res.status === HTTP.CREATED) {
        await fetchUser();
    }
    // TODO: what if request creation fails?
};
