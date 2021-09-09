import axios from 'axios';

function validateStatus(status) {
    return status < 500;
}

async function authRequest(url, type, idToken, data) {
    return axios({
        url,
        method: type,
        data,
        validateStatus,
        headers: {
            authorization: `Bearer ${idToken}`,
        },
    });
}

export { authRequest };
