const { spawnSync } = require('child_process');
const result = spawnSync('C:\\Windows\\System32\\cmd.exe', ['/c', 'echo Hello']);
console.log(result.stdout?.toString() || 'stdoutなし');
console.error(result.stderr?.toString() || 'stderrなし');
