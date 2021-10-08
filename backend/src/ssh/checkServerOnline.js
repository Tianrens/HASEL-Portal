import isReachable from 'is-reachable';

export async function checkServerOnline(host) {
    return isReachable(`${host}:22`);
}
