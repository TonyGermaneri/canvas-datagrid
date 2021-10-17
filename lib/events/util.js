'use strict';

const isSupportedHtml = function (pasteValue) {
  const genericDiv = /(?:^(<meta[^>]+>)?[\s\S]*<div[^>]*>)/;
  const genericSpan = /(?:^(<meta[^>]+>)?[\s\S]*<span[^>]*>)/;
  const genericTable = /(?:^(<meta[^>]+>)?[\s\S]*<table[^>]*>)/; // Matches Google Sheets format clipboard data format too.
  const excelTable = /(?:<!--StartFragment-->[\s\S]*<tr[^>]*>)/;
  const excelTableRow = /(?:<!--StartFragment-->[\s\S]*<td[^>]*>)/;

  if (genericDiv.test(pasteValue)) return true;
  if (genericSpan.test(pasteValue)) return true;
  if (genericTable.test(pasteValue)) return true;
  if (excelTable.test(pasteValue)) return true;
  if (excelTableRow.test(pasteValue)) return true;

  return false;
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

const parseData = function (data, mimeType) {
  if (mimeType === 'text/html' && isHtmlTable(data)) {
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
  } else if (mimeType === 'text/html') {
    const doc = new DOMParser().parseFromString(data, 'text/html');
    const element = doc.querySelector('div') || doc.querySelector('span');
    const elementData = sanitizeElementData(element);

    return elementData
      .split('\n')
      .map((item) => item.split('\t').map((value) => ({ value: [{ value }] })));
  }

  // Default data format is string, so split on new line,
  // and then enclose in an array (a row with one cell):
  return data
    .split('\n')
    .map((item) => item.split('\t').map((value) => ({ value: [{ value }] })));
};

export { isSupportedHtml, sanitizeElementData, parseData };
