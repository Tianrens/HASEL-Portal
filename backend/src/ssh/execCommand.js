const { NodeSSH } = require('node-ssh');

export async function execCommand(host, command) {
    const ssh = new NodeSSH()
  
    await ssh.connect({
        host,
        username: process.env.SSH_USERNAME,
        password: process.env.SSH_PASSWORD,
    });
    const result = await ssh.execCommand(command);
  
    ssh.dispose();

    return result;
}
