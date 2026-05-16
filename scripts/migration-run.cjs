const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const buildResult = spawnSync(npmBin, ['run', 'build'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});

if ((buildResult.status ?? 1) !== 0) {
  process.exit(buildResult.status ?? 1);
}

const cli = path.join(root, 'node_modules', 'typeorm', 'cli.js');
const args = ['-d', 'dist/config/database.js', 'migration:run'];

const result = spawnSync(process.execPath, [cli, ...args], {
  cwd: root,
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
