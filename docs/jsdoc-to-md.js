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
const data = jsdocApi.explainSync({ files: inputFiles });

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

for (const [sectionName, section] of Object.entries(sections)) {
  writeMarkdown({
    outputFile: path.join(outputDir, `${sectionName}.md`),
    templateFile: path.join(templateDir, `${sectionName}.hbs`),
    data: section.data,
  });
}
