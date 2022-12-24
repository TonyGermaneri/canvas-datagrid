const fs = require('fs');

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

function allFiles(dirname) {
  return fs.readdirSync(dirname);
}

function allMarkdownSlugs(dirname) {
  return allFiles(dirname)
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => filename.replace(/\.md$/, ''));
}

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'intro',
    'getting-started',
    'building-and-testing',
    {
      type: 'category',
      label: 'Topics',
      items: [
        'topics/drawing-on-the-canvas',
        'topics/extending-the-visual-appearance',
        'topics/formatting-using-event-listeners',
        'topics/setting-a-schema',
        'topics/setting-and-getting-data',
        'topics/setting-height-and-width',
        'topics/ways-to-create-a-grid',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/properties',
        'reference/parameters',
        'reference/events',
        'reference/methods',
        'reference/classes',
        'reference/styling',
      ],
    },
    'examples',
  ],
};

module.exports = sidebars;
