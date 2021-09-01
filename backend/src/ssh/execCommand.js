const { NodeSSH } = require('node-ssh');

/**
 * @param {string} host ip address of machine to ssh to
 * @param {string} command can include sudo commands
 * @returns
 */
export async function execCommand(host, command) {
    const hasSudo = command.includes('sudo');

    const ssh = new NodeSSH();
    await ssh.connect({
        host,
        username: process.env.SSH_USERNAME,
        password: process.env.SSH_PASSWORD,
    });
    const sudoOptions = hasSudo ? { execOptions: { pty: true }, stdin: `${process.env.SSH_PASSWORD}\n` } : {};
    const result = await ssh.execCommand(command, sudoOptions);
    ssh.dispose();

    return result;
}
