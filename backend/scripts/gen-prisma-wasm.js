const { spawn } = require('child_process');
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'wasm';
const child = spawn('npx', ['prisma', 'generate', '--schema=prisma/schema.prisma'], { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code));
