/**
 * buildSsr.mjs — Pre-compile React JSX templates for Vercel SSR
 *
 * Vercel's Node.js runtime cannot import raw .jsx files.  This script uses
 * esbuild to bundle all CV templates into a single Node.js-compatible ESM
 * module (dist-ssr/templates.js) that atsReactRenderer.js imports on Vercel.
 *
 * Run as part of the Vercel build: `node scripts/buildSsr.mjs && npx vite build`
 */

import { build } from 'esbuild';
import { mkdirSync } from 'fs';

mkdirSync('dist-ssr', { recursive: true });

await build({
  entryPoints: ['api/_lib/ssrBundle.js'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'dist-ssr/templates.js',
  // Keep react and react-dom as external — they are runtime dependencies
  // installed in node_modules on Vercel, not bundled into the output.
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  loader: {
    '.jsx': 'jsx',
    '.tsx': 'tsx',
    '.js':  'js',
  },
  jsx: 'automatic',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  minify: false,
  sourcemap: false,
  logLevel: 'info',
});

console.log('✓ SSR templates bundle → dist-ssr/templates.js');
