'use strict';

// tsd-jsdoc emits `declare class canvasDatagrid` / `declare namespace
// canvasDatagrid` but no export, so TypeScript rejects the file with
// "File 'dist/types.d.ts' is not a module" (#567). Append the module shape
// the runtime actually has: a default-exported factory function plus the
// class/namespace for typing, and the window global for script users.
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'dist', 'types.d.ts');
const marker = '// --- module exports (added by scripts/finalize-types.js) ---';

let source = fs.readFileSync(file, 'utf8');
if (source.includes(marker)) {
  process.exit(0);
}
if (!/declare class canvasDatagrid\b/.test(source)) {
  console.error(
    'finalize-types: expected "declare class canvasDatagrid" in ' + file,
  );
  process.exit(1);
}

// tsd-jsdoc marks every `@memberof canvasDatagrid` method as `static`, but at
// runtime they live on the grid instance (`grid.draw()`, `grid.addEventListener`),
// so drop the modifier inside the class body.
const classStart = source.indexOf('declare class canvasDatagrid {');
const classEnd = source.indexOf('\n}\n', classStart);
source =
  source.slice(0, classStart) +
  source.slice(classStart, classEnd).replace(/^(\s+)static /gm, '$1') +
  source.slice(classEnd);

source += `
${marker}
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
export default createCanvasDatagrid;
export { canvasDatagrid, CanvasDatagridArgs };
`;

fs.writeFileSync(file, source);
console.log(
  'finalize-types: exports appended to ' + path.relative(process.cwd(), file),
);
