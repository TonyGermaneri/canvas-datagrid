'use strict';

// Guards issue #311: the published bundles must not use eval(), so the grid
// works under a Content Security Policy without 'unsafe-eval'.
const fs = require('fs');
const path = require('path');

const files = ['canvas-datagrid.js', 'canvas-datagrid.module.js'].map((f) =>
  path.join(__dirname, '..', 'dist', f),
);
let failed = false;
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const match = /\beval\s*\(/.exec(source);
  if (match) {
    const line = source.slice(0, match.index).split('\n').length;
    console.error(`check-no-eval: eval() found in ${file} at line ${line}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('check-no-eval: no eval() in the published bundles');
