'use strict';

import {
  parseHtmlTable,
  parseHtmlText,
  parseText,
} from '../../lib/events/util.js';

export default function () {
  it('parse html table', function () {
    const htmlTable = `<html>
      <body>
        <table border=0 cellpadding=0 cellspacing=0 width=101 style='border-collapse: collapse;width:76pt'>
          <col width=101 style='mso-width-source:userset;mso-width-alt:3242;width:76pt'>
          <col width=101 style='mso-width-source:userset;mso-width-alt:3242;width:76pt'>
          <!--StartFragment-->
          <tr height=23 style='mso-height-source:userset;height:17.0pt'>
              <td height=23 class=xl65 width=101 style='height:17.0pt;width:76pt'>First cell</td>
              <td height=23 class=xl65 width=101 style='height:17.0pt;width:76pt'>Second cell</td>
          </tr>
          <!--EndFragment-->
      </table>
      </body>
    </html>`;

    const result = parseHtmlTable(htmlTable);

    chai.assert.deepStrictEqual(result, [
      [
        { value: [{ value: 'First cell' }] },
        { value: [{ value: 'Second cell' }] },
      ],
    ]);
    // doAssert(
    //   JSON.stringify(result) === expectedResultString,
    //   'get expected html table values',
    // );
  });

  it('parse html text', function () {
    const htmlTable = `<meta charset='utf-8'>
      <div style="color: #d4d4d4;background-color: #1e1e1e;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;">
        <div>
        <span style="color: #4fc1ff;">Paste value</span>
        </div>
      </div>`;

    const result = parseHtmlText(htmlTable);

    chai.assert.deepStrictEqual(result, [
      [{ value: [{ value: 'Paste value' }] }],
    ]);
  });

  it('parse plain text', function () {
    const result = parseText('Single value');

    chai.assert.deepStrictEqual(result, [
      [{ value: [{ value: 'Single value' }] }],
    ]);
  });

  it('parse mulitline plain text', function () {
    const result = parseText('First value\nSecond value');

    console.log(JSON.stringify(result));
    chai.assert.deepStrictEqual(result, [
      [{ value: [{ value: 'First value' }] }],
      [{ value: [{ value: 'Second value' }] }],
    ]);
  });
}
