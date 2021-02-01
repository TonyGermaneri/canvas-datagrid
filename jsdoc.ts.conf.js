'use strict';

module.exports = {
  source: {
    include: './lib/',
  },
  plugins: ['./node_modules/tsd-jsdoc/dist/plugin'],
  opts: {
    recurse: true,
    template: './node_modules/tsd-jsdoc/dist',
    verbose: true,
    destination: 'dist',
  },
  templates: {
    theme: 'simplex',
    syntaxTheme: 'dark',
  },
};
