import strip from '@rollup/plugin-strip';
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
export default {
  input: 'lib/main.js',
  output: {
    file: 'dist/canvas-datagrid.module.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    strip({
    functions:['window.customElements.define']
    }),
    replace({
    'window.require': true,
    'window.customElements': false
    }),
    nodeResolve(),
    commonjs()
  ]
};
