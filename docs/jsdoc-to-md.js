'use strict';

const Handlebars = require('handlebars');
const jsdocApi = require('jsdoc-api');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

// As far as I know, these are the only files containing JSDoc annotations:
const inputFiles = [
  path.join(__dirname, '..', 'lib', 'docs.js'),
  path.join(__dirname, '..', 'lib', 'publicMethods.js'),
];

const outputDir = path.join(__dirname, 'docs', 'reference');
const templateDir = path.join(__dirname, 'templates');

const sortByProp = (prop) => (a, b) => a[prop].localeCompare(b[prop]);

// This is more for development environments: if we change our docs.js,
// we don't want any dangling markdown files left in the directory. For
// publication on canvas-datagrid.js.org this is not relevant, as that
// environment is created anew each time.
fsExtra.emptyDirSync(outputDir);

/* parse jsdoc data */
// jsdoc runs in a child process; preload the Node compatibility shim there.
process.env.NODE_OPTIONS = [
  process.env.NODE_OPTIONS || '',
  `--require ${JSON.stringify(path.join(__dirname, 'jsdoc-node-compat.js'))}`,
]
  .join(' ')
  .trim();
const data = jsdocApi.explainSync({ files: inputFiles });

/*
 * Resolve JSDoc inline tags ({@link ...}, {@tutorial ...}) to markdown links
 * that point at the generated reference pages, so they do not appear as
 * literal `{@link canvasDatagrid.params}` text on the site (issue #574).
 */
const slug = (text) =>
  String(text)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

const exampleSlugs = fs
  .readdirSync(path.join(__dirname, 'docs', 'examples'))
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => f.replace(/^\d+-/, '').replace(/\.mdx?$/, ''));

function findExample(name) {
  const wanted = slug(name.replace(/^tutorial--/, '').replace(/\.$/, ''));
  return exampleSlugs.find((s) => s === wanted || s.startsWith(wanted));
}

function resolveLinkTarget(target, anchors) {
  let m;
  if (target === 'canvasDatagrid.params' || target === 'canvasDatagrid.args') {
    return '/reference/parameters';
  }
  if (target === 'canvasDatagrid.style') {
    return '/reference/styling';
  }
  if ((m = /^canvasDatagrid#param:(\w+)$/.exec(target))) {
    return `/reference/parameters#${slug(m[1])}`;
  }
  if ((m = /^canvasDatagrid\.attributes\.(\w+)$/.exec(target))) {
    return `/reference/parameters#${slug(m[1])}`;
  }
  if ((m = /^canvasDatagrid#event:(\w+)$/.exec(target))) {
    return `/reference/events#${slug(m[1])}`;
  }
  if ((m = /^canvasDatagrid#property:(\w+)$/.exec(target))) {
    return anchors.properties[m[1]] || `/reference/properties#${slug(m[1])}`;
  }
  if ((m = /^canvasDatagrid\.style\.(\w+)$/.exec(target))) {
    return `/reference/styling#${slug(m[1])}`;
  }
  if ((m = /^canvasDatagrid\.(\w+)(?:\.(\w+))?$/.exec(target))) {
    const [, member] = m;
    if (anchors.properties[member]) return anchors.properties[member];
    if (anchors.classes[member]) return anchors.classes[member];
    if (anchors.methods[member]) return anchors.methods[member];
    if (anchors.events[member]) return anchors.events[member];
    return null;
  }
  if (/^tutorial--/.test(target)) {
    const example = findExample(target);
    return example ? `/examples/${example}` : '/examples';
  }
  return null;
}

function resolveInlineTags(text, anchors) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/\{@link\s+([^}|\s]+)(?:\s*\|\s*([^}]+))?\}/g, (all, target, label) => {
      const href = resolveLinkTarget(target, anchors);
      const display =
        label ||
        target
          .replace(/^canvasDatagrid#(?:property|param|event):/, '')
          .replace(/^tutorial--/, '')
          .replace(/-+/g, ' ');
      return href ? `[${display}](${href})` : `\`${target}\``;
    })
    .replace(/\{@tutorial\s+([^}]+)\}/g, (all, name) => {
      const example = findExample(name);
      return example
        ? `[${name}](/examples/${example})`
        : `[${name}](/examples)`;
    });
}

function transformInlineTags(node, anchors, seen = new Set()) {
  if (!node || typeof node !== 'object' || seen.has(node)) return node;
  seen.add(node);
  if (Array.isArray(node)) {
    node.forEach((item) => transformInlineTags(item, anchors, seen));
    return node;
  }
  for (const key of Object.keys(node)) {
    const value = node[key];
    if (typeof value === 'string' && /description|classdesc|summary/.test(key)) {
      node[key] = resolveInlineTags(value, anchors);
    } else if (value && typeof value === 'object') {
      transformInlineTags(value, anchors, seen);
    }
  }
  return node;
}

function getEvents(jsdocData) {
  const events = jsdocData.filter(
    (identifier) =>
      identifier.kind === 'event' && identifier.memberof === 'canvasDatagrid',
  );

  return events.sort(sortByProp('name'));
}

function getParams(jsdocData) {
  const cdgNode = jsdocData.find(
    (identifier) => identifier.name === 'canvasDatagrid', // && identifier.kind === 'constructor',
  );
  const params = cdgNode.params.filter((p) => p.name !== 'args'); // exclude non-param description

  return params
    .map((p) => ({ ...p, name: p.name.replace(/^args\./, '') }))
    .sort(sortByProp('name'));
}

function getProperties(jsdocData) {
  const cdgNode = jsdocData.find(
    (identifier) =>
      identifier.name === 'canvasDatagrid' && identifier.kind === 'class',
  );
  const properties = cdgNode.properties;

  return properties.sort(sortByProp('name'));
}

function getClasses(jsdocData) {
  const classes = jsdocData.filter((identifier) => identifier.kind === 'class');

  return classes;
}

function getMethods(jsdocData) {
  const cdgNode = jsdocData.find(
    (identifier) => identifier.name === 'canvasDatagrid',
  );

  return jsdocData
    .filter((identifier) => identifier.kind === 'function')
    .concat(cdgNode.methods);
}

function getStyles(jsdocData) {
  const style = jsdocData.find(
    (identifier) =>
      identifier.kind === 'class' &&
      identifier.longname === 'canvasDatagrid.style',
  );

  return style.properties.sort(sortByProp('name'));
}

function writeMarkdown({ outputFile, templateFile, data }) {
  const templateString = fsExtra.readFileSync(templateFile).toString();
  const template = Handlebars.compile(templateString);
  const outputString = template({ data });

  fsExtra.writeFileSync(outputFile, outputString);
}

const sections = {
  parameters: { data: getParams(data), template: 'parameters.hbs' },
  properties: { data: getProperties(data), template: 'properties.hbs' },
  events: { data: getEvents(data), template: 'events.hbs' },
  classes: { data: getClasses(data), template: 'classes.hbs' },
  methods: { data: getMethods(data), template: 'methods.hbs' },
  styling: { data: getStyles(data), template: 'styling.hbs' },
};

// Anchor maps mirror the headings emitted by the templates:
// properties.hbs uses "### name <span>type</span>", the others "### name".
const anchors = {
  properties: Object.fromEntries(
    sections.properties.data.filter(Boolean).map((p) => [
      p.name,
      `/reference/properties#${slug(
        `${p.name} ${p.type && p.type.names ? p.type.names.join(',') : ''}`,
      )}`,
    ]),
  ),
  classes: Object.fromEntries(
    sections.classes.data.filter(Boolean).map((c) => [c.name, `/reference/classes#${slug(c.name)}`]),
  ),
  methods: Object.fromEntries(
    sections.methods.data.filter(Boolean).map((m) => [m.name, `/reference/methods#${slug(m.name)}`]),
  ),
  events: Object.fromEntries(
    sections.events.data.filter(Boolean).map((e) => [e.name, `/reference/events#${slug(e.name)}`]),
  ),
};
Object.values(sections).forEach((section) =>
  transformInlineTags(section.data, anchors),
);

for (const [sectionName, section] of Object.entries(sections)) {
  writeMarkdown({
    outputFile: path.join(outputDir, `${sectionName}.md`),
    templateFile: path.join(templateDir, `${sectionName}.hbs`),
    data: section.data,
  });
}
