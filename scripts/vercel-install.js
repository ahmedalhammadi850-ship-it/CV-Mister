#!/usr/bin/env node
/**
 * Vercel install script — strips server-only packages before npm install.
 * Vercel only needs frontend packages to run `vite build`.
 * Server packages (firebase-admin, express, puppeteer-core, etc.) cause
 * npm to crash on Vercel due to memory/network pressure (~564 → ~200 packages).
 */
import { readFileSync, writeFileSync } from 'fs';

const SERVER_ONLY = new Set([
  'firebase-admin',
  'express',
  'express-session',
  'cors',
  'helmet',
  'bcryptjs',
  'openid-client',
  'passport',
  'tsx',
  'connect-pg-simple',
  'pg',
  'puppeteer-core',
  '@types/cors',
  '@types/express',
  '@types/express-session',
  '@types/passport',
  '@types/bcryptjs',
]);

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

for (const section of ['dependencies', 'devDependencies', 'optionalDependencies']) {
  if (pkg[section]) {
    for (const name of Object.keys(pkg[section])) {
      if (SERVER_ONLY.has(name)) {
        delete pkg[section][name];
      }
    }
  }
}

delete pkg.optionalDependencies;

writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✓ Stripped server-only packages from package.json for Vercel build');
