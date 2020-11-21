import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import replace from 'rollup-plugin-re';
import clear from 'rollup-plugin-clear';

const input = 'lib/main.js';
const fileName = 'canvas-datagrid';
const name = 'canvasDatagrid';

const babelInput = {
  babelHelpers: 'bundled',
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        useBuiltIns: 'entry',
        modules: false,
        spec: true,
        targets: '> 0.25%, not dead',
      },
    ],
  ],
};

export default [
  {
    input,
    plugins: [
      clear({ targets: ['dist'] }),
      replace({
        patterns: [
          {
            match: /lib(\/|\\)main/,
            test: /(\/\/ #NO_GLOBAL)(.|\r|\n)*\1/,
            /* export default function canvasDatagrid (args) {
                return new Grid(args);
              }; */
            replace: ``,
          },
        ],
      }),
      nodeResolve(),
      commonjs(),
      babel(babelInput),
    ],
    output: {
      file: `dist/${fileName}.module.js`,
      plugins: [terser()],
      sourcemap: true,
    },
  },
  {
    input,
    plugins: [nodeResolve(), commonjs(), babel(babelInput)],
    output: {
      file: `dist/${fileName}.js`,
      plugins: [terser()],
      format: 'umd',
      name,
      extend: true,
      sourcemap: true,
    },
  },
];
