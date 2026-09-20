'use strict';

// Publishes the built bundles and type declarations with the site so the
// historical download URLs keep working:
//   https://canvas-datagrid.js.org/canvas-datagrid.js
//   https://canvas-datagrid.js.org/canvas-datagrid.debug.js
//   https://canvas-datagrid.js.org/canvas-datagrid.module.js
//   https://canvas-datagrid.js.org/types.d.ts
// The root `npm run build` must have run first (the publish workflows do).
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const target = path.join(__dirname, 'static');
const files = [
  'canvas-datagrid.js',
  'canvas-datagrid.debug.js',
  'canvas-datagrid.module.js',
  'types.d.ts',
];

for (const file of files) {
  const source = path.join(dist, file);
  if (!fs.existsSync(source)) {
    console.warn(`copy-dist: ${file} not found in dist/, run "npm run build" in the repository root first`);
    continue;
  }
  fs.copyFileSync(source, path.join(target, file));
  console.log(`copy-dist: static/${file}`);
}
