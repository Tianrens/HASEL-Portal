import isReachable from 'is-reachable';

/**
 * @param {string} host ip address to connect to
 * @returns {boolean} true or false if server is reachable
 */
export async function checkServerOnline(host) {
    return isReachable(`${host}:22`);
}
