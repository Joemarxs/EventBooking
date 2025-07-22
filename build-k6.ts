// build-k6.ts
import { build } from 'esbuild';
import { readdirSync } from 'fs';
import { join } from 'path';

const inputDir = './src/performance/load';
const files = readdirSync(inputDir)
  .filter((file) => file.endsWith('.ts'))
  .map((file) => join(inputDir, file));

if (files.length === 0) {
  console.error(' No .ts files found in /performance');
  process.exit(1);
}

build({
  entryPoints: files,
  outdir: 'dist',
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  external: ['k6', 'k6/http'],
  logLevel: 'info',
}).then(() => {
  console.log(' Performance test files built successfully');
}).catch((err) => {
  console.error(' Build failed:', err);
  process.exit(1);
});
