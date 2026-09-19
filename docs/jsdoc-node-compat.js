'use strict';

// jsdoc 3.x's `-X` dumper still calls util.isRegExp/isDate/isError, which
// Node.js removed in v23. jsdoc-to-md.js preloads this file into the jsdoc
// child process (via NODE_OPTIONS --require) so the docs build works on any
// supported Node version.
const util = require('util');

if (typeof util.isRegExp !== 'function') {
  util.isRegExp = (value) => value instanceof RegExp;
}
if (typeof util.isDate !== 'function') {
  util.isDate = (value) => value instanceof Date;
}
if (typeof util.isError !== 'function') {
  util.isError = (value) => value instanceof Error;
}
