'use strict';

const isSupportedHtml = function (pasteValue) {
  // We need to match new lines in the HTML, .* won't match new line characters.
  // `s` regex modifier can't be used with `ecmaVersion === 2017`.
  // As a workaround using [\s\S]*. Fix when we upgrade `ecmaVersion`.
  const genericDiv = /(?:^(<meta[^>]*>)?[\s\S]*<div[^>]*>)/;
  const genericSpan = /(?:^(<meta[^>]*>)?[\s\S]*<span[^>]*>)/;
  const genericTable = /(?:^(<meta[^>]*>)?[\s\S]*<table[^>]*>)/; // Matches Google Sheets format clipboard data format too.
  const excelTable = /(?:<!--StartFragment-->[\s\S]*<tr[^>]*>)/;
  const excelTableRow = /(?:<!--StartFragment-->[\s\S]*<td[^>]*>)/;

  return [
    genericDiv,
    genericTable,
    genericSpan,
    excelTable,
    excelTableRow,
  ].some((expression) => expression.test(pasteValue));
};

// Explanation of nodeType here: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
const IGNORE_NODETYPES = [8, 3]; // '#text' and '#comment'

const isHtmlTable = function (pasteValue) {
  return /(?:<table[^>]*>)|(?:<tr[^]*>)/.test(pasteValue);
};

const sanitizeElementData = function (element) {
  // It is not entirely clear if this check on nodeType is required.
  let elementData = element.nodeType === 1 ? element.innerText : element.data;

  return String(elementData).replace(/\s+/g, ' ').trim();
};

const parseHtmlText = function (data) {
  const doc = new DOMParser().parseFromString(data, 'text/html');
  const element = doc.querySelector('div') || doc.querySelector('span');
  const elementData = sanitizeElementData(element);

  return elementData
    .split('\n')
    .map((item) => item.split('\t').map((value) => ({ value: [{ value }] })));
};

const parseHtmlTable = function (data) {
  const doc = new DOMParser().parseFromString(data, 'text/html');
  const trs = doc.querySelectorAll('table tr');
  const rows = [];

  for (const tr of trs) {
    const row = [];

    for (const childNode of tr.childNodes) {
      if (IGNORE_NODETYPES.includes(childNode.nodeType)) continue;

      const col = { value: [] };
      const value = sanitizeElementData(childNode);

      if (value) col.value.push({ value });

      row.push(col);
    }

    rows.push(row);
  }

  return rows;
};

const parseText = function (data) {
  return data
    .split('\n')
    .map((item) => item.split('\t').map((value) => ({ value: [{ value }] })));
};

const parseData = function (data, mimeType) {
  if (mimeType === 'text/html' && isHtmlTable(data)) {
    return parseHtmlTable(data);
  } else if (mimeType === 'text/html') {
    return parseHtmlText(data);
  }

  // Default data format is string, so split on new line,
  // and then enclose in an array (a row with one cell):
  return parseText(data);
};

const htmlSafe = function (value) {
  if (typeof value !== 'string') return value;

  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const createTextString = function (selectedData, isNeat) {
  // Selected like [[0, 1], [0, 1]] of [[0, 3]] is neat; Selected like [[0, 1], [1, 2]] is untidy.
  // If not isNeat we just return a simple string of concatenated values.
  if (!isNeat)
    return selectedData.map((row) => Object.values(row).join('')).join('');

  // If isNeat, we can create tab separated mutti-line text.
  return selectedData.map((row) => Object.values(row).join('\t')).join('\n');
};

const createHTMLString = function (selectedData, isNeat) {
  if (!isNeat) return createTextString(selectedData, isNeat);

  // If isNeat, we can create a HTML table with the selected data.
  let htmlString = '<table>';
  htmlString += selectedData
    .map(
      (row) =>
        '<tr>' +
        Object.values(row)
          .map((value) => ['<td>', htmlSafe(value), '</td>'].join(''))
          .join('') +
        '</tr>',
    )
    .join('');
  htmlString += '</table>';

  return htmlString;
};

/**
 * deduce the type of values in the column 'colNum' of data represented by 'rows'
 * if the column is not empty and all values in the column are numbers, then the type is 'number',
 * otherwise the type is 'string'.
 * Purpose: check the type of pasted data when a new column is created dynamically
 * @param {Array} rows - array of rows, e.g. [ [{"value": [{"value": "a"}]},{"value": [{"value": "b"}]}], [{"value": [{"value": "1"}]},{"value": [{"value": "2"}]}] ]
 * @param {number} colNum - Column index to check
 * @returns {("string" | "number")} deduced type
 */
const deduceColTypeFromData = function (rows, colNum) {
  const len = rows.length;
  // the first row can represent column headings.
  // if one row is pasted, check it, otherwise start from the second row.
  const startRow = len === 1 ? 0 : 1;
  let isColEmpty = true;
  for (let i = startRow; i < len; i += 1) {
    const cellData = rows[i][colNum];
    if (!cellData || cellData.value.length === 0) {
      continue;
    }
    isColEmpty = false;
    const val = cellData.value[0].value;
    if (!Number.isFinite(Number(val))) {
      return 'string';
    }
  }
  return isColEmpty ? 'string' : 'number';
};

export {
  createTextString,
  createHTMLString,
  isSupportedHtml,
  htmlSafe,
  parseData,
  parseHtmlTable,
  parseHtmlText,
  parseText,
  sanitizeElementData,
  deduceColTypeFromData,
};
