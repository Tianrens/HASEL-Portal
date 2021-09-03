import axios from 'axios';
import { accessDoc } from '../state';
import { idTokenDoc } from '../docs/idTokenDoc';

export async function authRequest(url, type, data) {
    const [idToken] = accessDoc(idTokenDoc);
    const response = await axios({
        url,
        method: type,
        data,
        headers: {
            authorization: `Bearer ${idToken}`,
        },
    });
    return response;
}
