#!/usr/bin/env node
import execa from 'execa';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const smokeScript = path.join(__dirname, 'smoke-generated-app.mjs');
const presets = ['dashboard', 'minimal', 'api'];

for (const preset of presets) {
  console.log(`\n========== preset: ${preset} (sqlite) ==========\n`);
  await execa('node', [smokeScript, 'sqlite', preset], { stdio: 'inherit' });
}
