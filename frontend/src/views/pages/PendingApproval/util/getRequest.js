import { authRequest } from '../../../../hooks/util/authRequest';
import { accessDoc } from '../../../../state/state';
import { userDoc } from '../../../../state/docs/userDoc';

export async function getRequest() {
    const [user] = accessDoc(userDoc);
    const request = await authRequest(`/api/request/${user.currentRequestId._id}`);
    const resource = await authRequest(`/api/resource/${request.data.allocatedResourceId}`);

    return {
        supervisorName: request.data.supervisorName,
        comments : request.data.comments,
        workstation: resource.data,
    };
};
