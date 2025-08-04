#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

try {
  console.log('Building frontend...');
  execSync('npx vite build', { cwd: projectRoot, stdio: 'inherit' });
  
  console.log('Building backend...');
  execSync([
    'esbuild server/index.ts',
    '--platform=node',
    '--packages=external', 
    '--bundle',
    '--format=esm',
    '--outdir=dist',
    '--define:import.meta.dirname=\'"."\''
  ].join(' '), { cwd: projectRoot, stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}