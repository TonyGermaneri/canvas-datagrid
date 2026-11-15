'use strict';

// tsd-jsdoc emits `declare class canvasDatagrid` / `declare namespace
// canvasDatagrid` but no export, so TypeScript rejects the file with
// "File 'dist/types.d.ts' is not a module" (#567). Append the module shape
// the runtime actually has: a factory function plus the class/namespace for
// typing, and the window global for script users.
//
// The shape differs per module format, and TypeScript picks the format of a
// declaration file from its extension (#613), so three files are written:
//
//   types.d.mts  ESM: `export default`. Matches dist/canvas-datagrid.module.js
//                (`export { F as default }`); the `import` condition.
//   types.d.cts  CommonJS: `export =`. Matches the UMD bundle, whose
//                `libraryExport: 'default'` makes `module.exports` the
//                factory itself; the `require` condition.
//   types.d.ts   Same as types.d.mts. The top-level "types" field, for
//                `moduleResolution: node10`, which ignores "exports" and
//                does not check module format.
//
// The package has no `"type": "module"`, so a `.d.ts` counts as CommonJS
// under node16/nodenext. That is why the ESM declarations need the `.d.mts`
// extension, and why the `"types"` condition in package.json "exports"
// cannot simply point at types.d.ts.
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const file = path.join(dist, 'types.d.ts');
const marker = '// --- module exports (added by scripts/finalize-types.js) ---';

let body = fs.readFileSync(file, 'utf8');
const markerAt = body.indexOf(marker);
if (markerAt !== -1) {
  // Already finalized; rebuild all three files from the generated part.
  body = body.slice(0, markerAt);
} else {
  if (!/declare class canvasDatagrid\b/.test(body)) {
    console.error(
      'finalize-types: expected "declare class canvasDatagrid" in ' + file,
    );
    process.exit(1);
  }
  // tsd-jsdoc marks every `@memberof canvasDatagrid` method as `static`, but
  // at runtime they live on the grid instance (`grid.draw()`,
  // `grid.addEventListener`), so drop the modifier inside the class body.
  const classStart = body.indexOf('declare class canvasDatagrid {');
  const classEnd = body.indexOf('\n}\n', classStart);
  body =
    body.slice(0, classStart) +
    body.slice(classStart, classEnd).replace(/^(\s+)static /gm, '$1') +
    body.slice(classEnd);
}
body = body.trimEnd() + '\n\n';
if (/^export /m.test(body)) {
  // `export =` cannot coexist with other exports in types.d.cts.
  console.error(
    'finalize-types: tsd-jsdoc output already contains an export; ' +
      'update scripts/finalize-types.js',
  );
  process.exit(1);
}

const shared = `${marker}
/**
 * Arguments accepted by the factory. Every option is optional; without
 * \`parentNode\` the returned element must be appended to the document by
 * the caller.
 */
type CanvasDatagridArgs = Partial<
  ConstructorParameters<typeof canvasDatagrid>[0]
>;
/**
 * Creates a grid. This is what \`import canvasDatagrid from 'canvas-datagrid'\`
 * and the \`window.canvasDatagrid\` global resolve to.
 */
declare function createCanvasDatagrid(args?: CanvasDatagridArgs): canvasDatagrid;
declare global {
  interface Window {
    canvasDatagrid: typeof createCanvasDatagrid;
  }
}
`;

const esm =
  body +
  shared +
  `export default createCanvasDatagrid;
export { canvasDatagrid, CanvasDatagridArgs };
`;

const cjs =
  body +
  shared +
  `declare namespace createCanvasDatagrid {
  export { canvasDatagrid, CanvasDatagridArgs };
}
export = createCanvasDatagrid;
`;

const outputs = {
  'types.d.ts': esm,
  'types.d.mts': esm,
  'types.d.cts': cjs,
};
for (const name of Object.keys(outputs)) {
  fs.writeFileSync(path.join(dist, name), outputs[name]);
}
console.log(
  'finalize-types: wrote ' +
    Object.keys(outputs)
      .map((name) => path.relative(process.cwd(), path.join(dist, name)))
      .join(', '),
);
