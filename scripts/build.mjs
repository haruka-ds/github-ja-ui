import { build } from 'esbuild';
import { copyFile, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist');
await Promise.all([
  build({
    entryPoints: ['src/content.ts'],
    bundle: true,
    format: 'iife',
    outfile: 'dist/content.js',
    target: 'chrome114',
  }),
  build({
    entryPoints: ['src/popup.ts'],
    bundle: true,
    format: 'iife',
    outfile: 'dist/popup.js',
    target: 'chrome114',
  }),
  copyFile('manifest.json', 'dist/manifest.json'),
  copyFile('src/popup.html', 'dist/popup.html'),
]);
