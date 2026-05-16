const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const parseNameArg = () => {
  const fromNpm = process.env.npm_config_name;
  if (fromNpm) {
    return fromNpm;
  }

  const args = process.argv.slice(2);
  const namedEq = args.find((arg) => arg.startsWith('--name='));
  if (namedEq) {
    return namedEq.split('=')[1];
  }

  const nameIndex = args.findIndex((arg) => arg === '--name');
  if (nameIndex >= 0 && args[nameIndex + 1]) {
    return args[nameIndex + 1];
  }

  return args[0];
};

const name = parseNameArg();

if (!name) {
  console.error('Missing migration name. Use: npm run db:migrate:generate --name=init-core');
  process.exit(1);
}

const root = path.resolve(__dirname, '..');
const migrationsDir = path.join(root, 'src', 'migrations');
fs.mkdirSync(migrationsDir, { recursive: true });

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
const args = [
  '-d',
  'dist/config/database.js',
  'migration:generate',
  `src/migrations/${name}`,
];

const result = spawnSync(process.execPath, [cli, ...args], {
  cwd: root,
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
