import {
  mouseup,
  mousedown,
  dblclick,
  mousemove,
  doAssert,
  g,
  smallData,
  assertIf,
  handlemove,
} from './util.js';

const fakeClipboardEvent = {
  clipboardData: {
    data: {},
    setData: function (mime, data) {
      this.data[mime] = data;
    },
  },
  preventDefault: () => null, // noop so the call in addCellValue doesn't cause an error
};

export default function () {
  it('Begin editing, end editing', function (done) {
    var ev,
      err,
      grid = g({
        test: this.test,
        data: [{ d: '' }],
      });
    grid.beginEditAt(0, 0);
    err = assertIf(
      !grid.input.parentNode,
      'Expected an input to have appeared',
    );
    if (err) {
      return done(err);
    }
    ev = new Event('keydown');
    ev.key = 'Escape';

    grid.addEventListener('endedit', function () {
      done();
    });
    grid.input.dispatchEvent(ev);
  });
  it('Begin editing, enter a value, end editing', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: [{ d: '' }],
      });
    grid.beginEditAt(0, 0);
    ev = new Event('keydown');
    ev.key = 'Enter';
    grid.input.value = 'blah';
    grid.addEventListener('endedit', function () {
      done(
        assertIf(grid.viewData[0].d !== 'blah', 'Expected value to be in data'),
      );
    });
    grid.input.dispatchEvent(ev);
  });
  it('Begin editing, enter a value, end editing, abort before ending.', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: [{ d: '' }],
      });
    grid.beginEditAt(0, 0);
    ev = new Event('keydown');
    ev.key = 'Enter';
    grid.input.value = 'blah';
    grid.addEventListener('beforeendedit', function (e) {
      e.abort();
      done(
        assertIf(grid.viewData[0].d === 'blah', 'Expected value to be in data'),
      );
    });
    grid.input.dispatchEvent(ev);
  });
  it('Begin editing a select with short definition.', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '' }],
      schema: [{ name: 'd', enum: ['a', 'b', 'c'] }],
    });
    grid.beginEditAt(0, 0);
    done(
      assertIf(
        grid.input.childNodes.length === 3 && grid.input.tagName !== 'SELECT',
        'Expected an input to have appeared',
      ),
    );
    grid.endEdit();
  });
  it('Begin editing a select with standard definition.', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '' }],
      schema: [
        {
          name: 'd',
          enum: [
            ['a', 'A'],
            ['b', 'B'],
            ['c', 'C'],
          ],
        },
      ],
    });
    grid.beginEditAt(0, 0);
    done(
      assertIf(
        grid.input.childNodes[0].innerHTML === 'A' &&
          grid.input.childNodes.length === 3 &&
          grid.input.tagName !== 'SELECT',
        'Expected an input to have appeared',
      ),
    );
    grid.endEdit();
  });
  it('Begin editing by double clicking a cell.', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '' }],
    });
    mousemove(window, 65, 37, grid.canvas);
    mousedown(grid.canvas, 65, 37);
    mouseup(grid.canvas, 65, 37);
    mousedown(grid.canvas, 65, 37);
    mouseup(grid.canvas, 65, 37);
    dblclick(grid.canvas, 65, 37);
    done(
      assertIf(
        grid.input.tagName !== 'INPUT',
        'Expected an input to have appeared',
      ),
    );
    grid.endEdit();
  });
  describe('copy', function () {
    it('neatly selected data onto simulated clipboard', function (done) {
      const data = [
        {
          d: 'Text with, a comma 1',
          e: 'Text that has no comma in in 1',
        },
        {
          d: 'Text with, a comma 2',
          e: 'Text that has no comma in in 2',
        },
      ];

      const grid = g({
        test: this.test,
        data,
      });

      grid.selectAll();
      grid.focus();

      const textResult = `Text with, a comma 1\tText that has no comma in in 1\nText with, a comma 2\tText that has no comma in in 2`;
      const htmlResult =
        '<table><tr><td>Text with, a comma 1</td><td>Text that has no comma in in 1</td></tr><tr><td>Text with, a comma 2</td><td>Text that has no comma in in 2</td></tr></table>';
      const jsonResult = JSON.stringify(data);

      grid.copy(new Object(fakeClipboardEvent));
      const { clipboardData } = fakeClipboardEvent;

      doAssert(
        clipboardData.data['text/plain'] === textResult,
        'Expected plain text to be copied',
      );
      doAssert(
        clipboardData.data['text/html'] === htmlResult,
        'Expected html to be copied',
      );
      doAssert(
        clipboardData.data['text/csv'] === textResult,
        'Expected csv text to be copied',
      );
      doAssert(
        clipboardData.data['application/json'] === jsonResult,
        'Expected json to be copied',
      );

      done();
    });
    it('untidy selected data onto simulated clipboard', function (done) {
      const data = [
        {
          d: 'Text with, a comma 1',
          e: 'Text that has no comma in in 1',
        },
        {
          d: 'Text with, a comma 2',
          e: 'Text that has no comma in in 2',
        },
      ];

      const grid = g({
        test: this.test,
        data,
      });

      grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });
      grid.selectArea({ top: 1, left: 1, bottom: 1, right: 1 }, true); // ctrl = true, adds to previous selection
      grid.focus();

      const textResult = `Text with, a comma 1Text that has no comma in in 2`;
      const htmlResult = textResult;
      const jsonResult = JSON.stringify([
        {
          d: 'Text with, a comma 1',
        },
        {
          e: 'Text that has no comma in in 2',
        },
      ]);

      grid.copy(new Object(fakeClipboardEvent));
      const { clipboardData } = fakeClipboardEvent;

      doAssert(
        clipboardData.data['text/plain'] === textResult,
        'Expected plain text to be copied',
      );
      doAssert(
        clipboardData.data['text/html'] === htmlResult,
        'Expected html to be copied',
      );
      doAssert(
        clipboardData.data['text/csv'] === textResult,
        'Expected csv text to be copied',
      );
      doAssert(
        clipboardData.data['application/json'] === jsonResult,
        'Expected json to be copied',
      );

      done();
    });
    it('null value is not cast to `null`', function () {
      const data = [
        {
          d: null,
        },
      ];

      const grid = g({
        test: this.test,
        data,
      });

      grid.selectAll();
      grid.focus();

      const textResult = ``;
      const htmlResult = '<table><tr><td></td></tr></table>';

      grid.copy(new Object(fakeClipboardEvent));
      const { clipboardData } = fakeClipboardEvent;

      doAssert(
        clipboardData.data['text/plain'] === textResult,
        'Expected plain text to be copied',
      );
      doAssert(
        clipboardData.data['text/html'] === htmlResult,
        'Expected html text to be copied',
      );
    });
    it('only selected cells onto simulated clipboard', function (done) {
      // Ensure padding of rows not in selection is removed before placing data on clipboard.
      const data = [
        {
          d: 'Text with, a comma 1',
          e: 'Text that has no comma in in 1',
        },
        {
          d: 'Text with, a comma 2',
          e: 'Text that has no comma in in 2',
        },
      ];

      const grid = g({
        test: this.test,
        data,
      });

      grid.selectArea({ top: 1, left: 1, bottom: 1, right: 1 });
      grid.focus();

      const textResult = `Text that has no comma in in 2`;
      const htmlResult =
        '<table><tr><td>Text that has no comma in in 2</td></tr></table>';
      const jsonResult = JSON.stringify([
        {
          e: 'Text that has no comma in in 2',
        },
      ]);

      grid.copy(new Object(fakeClipboardEvent));
      const { clipboardData } = fakeClipboardEvent;
      console.log(textResult);
      console.log(clipboardData.data);
      doAssert(
        clipboardData.data['text/plain'] === textResult,
        'Expected plain text to be copied',
      );
      doAssert(
        clipboardData.data['text/html'] === htmlResult,
        'Expected html to be copied',
      );
      doAssert(
        clipboardData.data['text/csv'] === textResult,
        'Expected csv text to be copied',
      );
      doAssert(
        clipboardData.data['application/json'] === jsonResult,
        'Expected json to be copied',
      );

      done();
    });
  });
  it('Should paste a value from the clipboard into a cell', function (done) {
    var grid = g({
      test: this.test,
      data: [{ 'Column A': 'Original value' }],
    });

    grid.focus();
    grid.setActiveCell(0, 0);
    grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });

    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/plain',
            getAsString: function (callback) {
              callback('Paste buffer value');
            },
          },
        ],
      },
    });

    setTimeout(function () {
      var cellData = grid.viewData[0]['Column A'];
      done(
        assertIf(
          cellData !== 'Paste buffer value',
          'Value has not been replaced with clipboard data: ' + cellData,
        ),
      );
    }, 10);
  });
  it('Should paste an HTML table value from the clipboard into a cell', function (done) {
    var grid = g({
      test: this.test,
      data: [{ 'Column A': 'Original value' }],
    });

    grid.focus();
    grid.setActiveCell(0, 0);
    grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });

    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/html',
            getAsString: function (callback) {
              callback(
                "<meta charset='utf-8'><table><tr><td>Paste buffer value</td></tr></table>",
              );
            },
          },
        ],
      },
    });

    setTimeout(function () {
      var cellData = grid.viewData[0]['Column A'];
      done(
        assertIf(
          cellData !== 'Paste buffer value',
          'Value has not been replaced with clipboard data: ' + cellData,
        ),
      );
    }, 10);
  });
  it('paste a Google Sheets table with table body from the clipboard into a cell', function (done) {
    var grid = g({
      test: this.test,
      data: [{ 'Column A': 'Original value' }],
    });

    grid.focus();
    grid.setActiveCell(0, 0);
    grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });

    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/html',
            getAsString: function (callback) {
              callback(
                `<meta charset='utf-8'><google-sheets-html-origin><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><table xmlns="http://www.w3.org/1999/xhtml" cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout:fixed;font-size:10pt;font-family:arial,sans,sans-serif;width:0px;border-collapse:collapse;border:none"><colgroup><col width="181"/><col width="17"/><col width="85"/></colgroup><tbody><tr style="height:21px;"><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;font-size:18pt;font-weight:bold;text-align:right;" data-sheets-value="{&quot;1&quot;:3,&quot;3&quot;:2022}">Paste buffer value</td><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;" data-sheets-numberformat="{&quot;1&quot;:4,&quot;2&quot;:&quot;[$€]#,##0.00&quot;}"></td><td style="border-right:1px solid transparent;overflow:visible;padding:2px 0px 2px 0px;vertical-align:middle;font-size:18pt;font-weight:bold;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;Cash flow forecast&quot;}"><div style="white-space:nowrap;overflow:hidden;position:relative;width:224px;left:3px;"><div style="float:left;">Paste buffer value</div></div></td></tr></tbody></table>`,
              );
            },
          },
        ],
      },
    });

    setTimeout(function () {
      var cellData = grid.viewData[0]['Column A'];
      done(
        assertIf(
          cellData !== 'Paste buffer value',
          'Value has not been replaced with clipboard data: ' + cellData,
        ),
      );
    }, 10);
  });
  it('paste a Excel table with multiple rows from the clipboard', function (done) {
    var grid = g({
      test: this.test,
      data: [
        {
          d: 'Text with, a comma 1',
          e: 'Text that has no comma in in 1',
        },
        {
          d: 'Text with, a comma 2',
          e: 'Text that has no comma in in 2',
        },
      ],
    });

    grid.focus();
    grid.setActiveCell(0, 0);
    grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });

    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/html',
            getAsString: function (callback) {
              callback(
                `<html>
                  <body>
                      <table>
                        <!--StartFragment-->
                          <col width=412 style='mso-width-source:userset;mso-width-alt:13184;width:309pt'>
                          <col width=340 style='mso-width-source:userset;mso-width-alt:10880;width:255pt'>
                          <tr>
                            <td>Paste buffer value</td>
                            <td>Paste buffer value</td>
                          </tr>
                          <tr>
                            <td>Paste buffer value</td>
                            <td>Paste buffer value</td>
                          </tr>
                        <!--EndFragment-->
                      </table>
                    </body>
                  </html>`,
              );
            },
          },
        ],
      },
    });

    setTimeout(function () {
      const cellData = [
        ...new Set(grid.viewData.map((row) => Object.values(row)).flat()),
      ];
      done(
        doAssert(
          cellData[0] === 'Paste buffer value' && cellData.length === 1,
          'Value has not been replaced with clipboard data: ' + cellData,
        ),
      );
    }, 10);
  });

  it('paste a 2x3 numeric table into 2x2 grid should add a new column of type "number", if allowGridExpandOnPaste === true', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { a: 'a', b: 'b' },
        { a: 'c', b: 'd' },
      ],
      autoGenerateSchema: true,
      allowGridExpandOnPaste: true,
    });

    grid.focus();
    grid.setActiveCell(0, 0);
    grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });

    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/plain',
            getAsString: function (callback) {
              callback('1\t2\t3\n4\t5\t6');
            },
          },
        ],
      },
    });

    setTimeout(function () {
      const colName = Object.keys(grid.viewData[0])[2];
      const cellData1 = grid.viewData[0][colName];
      const cellData2 = grid.viewData[1][colName];

      try {
        doAssert(
          grid.viewData.length === 2 &&
            Object.keys(grid.viewData[0]).length === 3,
          'New column was not added to the grid',
        );
        doAssert(
          cellData1 === '3' && cellData2 === '6',
          'Correct data was not added to the new column',
        );
        doAssert(
          grid.schema.find((col) => col.name === colName).type === 'number',
          'New column has incorrect type',
        );
        done();
      } catch (error) {
        done(error);
      }
    }, 10);
  });

  it('paste a 3x2 table into 2x2 grid should add a new row, if allowGridExpandOnPaste === true', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { a: 'a', b: 'b' },
        { a: 'c', b: 'd' },
      ],
      autoGenerateSchema: true,
      allowGridExpandOnPaste: true,
    });

    grid.focus();
    grid.setActiveCell(0, 0);
    grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });

    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/plain',
            getAsString: function (callback) {
              callback('1\t2\n3\t4\n5\t6');
            },
          },
        ],
      },
    });

    setTimeout(function () {
      const lastRow = grid.viewData[2];
      const cellData1 = lastRow['a'];
      const cellData2 = lastRow['b'];

      try {
        doAssert(
          grid.viewData.length === 3 &&
            Object.keys(grid.viewData[0]).length === 2,
          'New row was not added to the grid',
        );
        doAssert(
          cellData1 === '5' && cellData2 === '6',
          'Correct data was not added to the new row',
        );
        done();
      } catch (error) {
        done(error);
      }
    }, 10);
  });

  it('paste a 2x2 table of text cells into 1x1 grid should add a new row and a new column of type "string", if allowGridExpandOnPaste === true', function (done) {
    var grid = g({
      test: this.test,
      data: [{ a: 'a' }],
      autoGenerateSchema: true,
      allowGridExpandOnPaste: true,
    });

    grid.focus();
    grid.setActiveCell(0, 0);
    grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });

    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/plain',
            getAsString: function (callback) {
              callback('a\tb\nc\td');
            },
          },
        ],
      },
    });

    setTimeout(function () {
      const [firstRow, lastRow] = grid.viewData;
      const colName = Object.keys(firstRow)[1];
      const cellData1 = firstRow[colName];
      const cellData2 = lastRow['a'];
      const cellData3 = lastRow[colName];

      try {
        doAssert(
          grid.viewData.length === 2 &&
            Object.keys(grid.viewData[0]).length === 2,
          'New row or new column was not added to the grid',
        );
        doAssert(
          cellData1 === 'b' && cellData2 === 'c' && cellData3 === 'd',
          'Correct data was not added to the new row',
        );
        doAssert(
          grid.schema.find((col) => col.name === colName).type === 'string',
          'New column has incorrect type',
        );
        done();
      } catch (error) {
        done(error);
      }
    }, 10);
  });

  it('paste a 1x1 table into 1x1 grid should not add any new rows or columns, if allowGridExpandOnPaste === true', function (done) {
    var grid = g({
      test: this.test,
      data: [{ a: 'a' }],
      autoGenerateSchema: true,
      allowGridExpandOnPaste: true,
    });

    grid.focus();
    grid.setActiveCell(0, 0);
    grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });

    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/plain',
            getAsString: function (callback) {
              callback('1');
            },
          },
        ],
      },
    });

    setTimeout(function () {
      done(
        doAssert(
          grid.viewData.length === 1 &&
            Object.keys(grid.viewData[0]).length === 1,
          'New row or new column was not added to the grid',
        ),
      );
    }, 10);
  });

  it('paste a Excel table single row / single cell value from the clipboard into a cell', function (done) {
    var grid = g({
      test: this.test,
      data: [{ 'Column A': 'Original value' }],
    });

    grid.focus();
    grid.setActiveCell(0, 0);
    grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });

    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/html',
            getAsString: function (callback) {
              callback(
                `<html>
                  <body>
                    <table border=0 cellpadding=0 cellspacing=0 width=101 style='border-collapse: collapse;width:76pt'>
                      <col width=101 style='mso-width-source:userset;mso-width-alt:3242;width:76pt'>
                      <tr height=23 style='mso-height-source:userset;height:17.0pt'>
                        <!--StartFragment-->
                          <td height=23 class=xl65 width=101 style='height:17.0pt;width:76pt'>Paste buffer value</td>
                        <!--EndFragment-->
                      </tr>
                  </table>
                  </body>
                </html>`,
              );
            },
          },
        ],
      },
    });

    setTimeout(function () {
      var cellData = grid.viewData[0]['Column A'];
      done(
        assertIf(
          cellData !== 'Paste buffer value',
          'Value has not been replaced with clipboard data: ' + cellData,
        ),
      );
    }, 10);
  });
  it('paste a HTML div value from the clipboard into a cell', function (done) {
    var grid = g({
      test: this.test,
      data: [{ 'Column A': 'Original value' }],
    });

    grid.focus();
    grid.setActiveCell(0, 0);
    grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });

    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/html',
            getAsString: function (callback) {
              callback(
                `<meta charset='utf-8'>
                  <div style="color: #d4d4d4;background-color: #1e1e1e;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;">
                    <div>
                    <span style="color: #4fc1ff;">Paste buffer value</span>
                    </div>
                  </div>`,
              );
            },
          },
        ],
      },
    });

    setTimeout(function () {
      var cellData = grid.viewData[0]['Column A'];
      done(
        assertIf(
          cellData !== 'Paste buffer value',
          'Value has not been replaced with clipboard data: ' + cellData,
        ),
      );
    }, 10);
  });
  it('paste data and fill it down/over', function (done) {
    const grid = g({
      test: this.test,
      data: [
        {
          field1: 'Value 1',
          field2: 'Value 2',
          field3: 'Value 3',
        },
        {},
        {},
      ],
    });

    grid.focus();
    grid.selectRow(0, false, false, false);
    grid.selectRow(2, false, true, false);

    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/plain',
            getAsString: function (callback) {
              callback('New value');
            },
          },
        ],
      },
    });

    setTimeout(function () {
      try {
        doAssert(grid.viewData.length == 3, 'Should have 3 rows exactly');
        doAssert(
          Object.keys(grid.viewData[0]).length == 3,
          'Should have 3 columns exactly',
        );

        for (let i = 0; i < grid.viewData.length; i++) {
          for (const columnKey in grid.viewData[i]) {
            const currentValue = grid.viewData[i][columnKey];
            doAssert(
              currentValue === 'New value',
              'Value for "' +
                columnKey +
                '" should be "New value", but got ' +
                currentValue,
            );
          }
        }

        done();
      } catch (error) {
        done(error);
      }
    }, 10);
  });
  it('paste data with a custom fill down/over function', function (done) {
    const grid = g({
      test: this.test,
      data: [
        {
          field1: 'Value 1',
          field2: 'Value 2',
          field3: 'Value 3',
        },
        {},
      ],
      fillCellCallback: function (args) {
        let counter = 0;

        if (args.fillingColumnPosition > -1)
          counter = args.fillingColumnPosition + 1;
        if (args.fillingRowPosition > -1)
          counter += args.fillingRowPosition + 1;
        return args.newCellData + ' ' + counter;
      },
    });

    grid.focus();
    grid.selectRow(0, false, false, false);
    grid.selectRow(1, false, true, false);

    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/plain',
            getAsString: function (callback) {
              callback('New value');
            },
          },
        ],
      },
    });
    setTimeout(function () {
      try {
        doAssert(grid.viewData.length == 2, 'Should have 2 rows exactly');
        doAssert(
          Object.keys(grid.viewData[0]).length == 3,
          'Should have 3 columns exactly',
        );

        const expectedResult = [
          {
            field1: 'New value',
            field2: 'New value 1',
            field3: 'New value 2',
          },
          {
            field1: 'New value 1',
            field2: 'New value 2',
            field3: 'New value 3',
          },
        ];

        for (let i = 0; i < grid.viewData.length; i++) {
          for (const columnKey in grid.viewData[i]) {
            const expectedValue = expectedResult[i][columnKey];
            const currentValue = grid.viewData[i][columnKey];
            doAssert(
              currentValue === expectedValue,
              `Value for "${columnKey}" should be "${expectedValue}", but got "${currentValue}"`,
            );
          }
        }

        done();
      } catch (error) {
        done(error);
      }
    }, 10);
  });
  it('Should fire a beforepaste event', function (done) {
    var grid = g({
      test: this.test,
      data: [{ 'Column A': 'Original value' }],
    });

    grid.focus();
    grid.setActiveCell(0, 0);

    grid.addEventListener('beforepaste', function (event) {
      event.preventDefault();
      done();
    });

    // Event can be empty, because beforepaste should fire immediately,
    // and return from paste function (because preventDefault):
    grid.paste({});
  });
  it('Should fire an afterpaste event', function (done) {
    var grid = g({
      test: this.test,
      data: [{ 'Column A': 'Original value' }],
    });

    grid.focus();
    grid.setActiveCell(0, 0);
    grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });

    grid.addEventListener('afterpaste', function (event) {
      try {
        doAssert(!!event.cells, 'event has cells property');
        doAssert(event.cells.length === 1, 'one row has been pasted ');
        doAssert(event.cells[0][0] === 0, 'pasted column == 0');
        doAssert(event.cells[0][2] === 0, 'pasted bound column == 0');
      } catch (error) {
        done(error);
      }

      done();
    });

    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/plain',
            getAsString: function (callback) {
              callback('Paste buffer value');
            },
          },
        ],
      },
    });
  });
  it('Begin editing, tab to next cell', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.beginEditAt(0, 0);
    ev = new Event('keydown');
    ev.key = 'Tab';
    grid.input.dispatchEvent(ev);
    grid.addEventListener('endedit', function (e) {
      if (e.cell.columnIndex === 1) {
        done();
      }
    });
    grid.endEdit();
  });
  it('Begin editing, shift tab to very last cell', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.beginEditAt(0, 0);
    ev = new Event('keydown');
    ev.shiftKey = true;
    ev.key = 'Tab';
    grid.addEventListener('endedit', function (e) {
      if (e.cell.columnIndex === 2 && e.cell.rowIndex === 2) {
        done();
      }
    });
    grid.input.dispatchEvent(ev);
    grid.endEdit();
  });
  it('Begin editing, tab to next row by hitting tab three times', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.beginEditAt(0, 0);
    grid.addEventListener('endedit', function (e) {
      if (e.cell.columnIndex === 0 && e.cell.rowIndex === 0) {
        done();
      }
    });
    ev = new Event('keydown');
    ev.key = 'Tab';
    document.body.lastChild.dispatchEvent(ev);
    document.body.lastChild.dispatchEvent(ev);
    document.body.lastChild.dispatchEvent(ev);
    grid.endEdit();
  });
  describe('cut', function () {
    it('fires a aftercut event with affected cells', function (done) {
      var grid = g({
        test: this.test,
        data: [{ 'Column A': 'Original value' }],
      });

      grid.focus();
      grid.setActiveCell(0, 0);
      grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });

      grid.addEventListener('aftercut', function (event) {
        try {
          doAssert(!!event.cells, 'event has cells property');
          doAssert(event.cells.length === 1, 'one row has been pasted ');
          doAssert(event.cells[0][0] === 0, 'pasted column == 0');
          doAssert(event.cells[0][2] === 0, 'pasted bound column == 0');
        } catch (error) {
          done(error);
        }

        done();
      });

      grid.cut(fakeClipboardEvent);
    });
  });
  describe('clear', () => {
    it('selection fires `afterdelete` event', function (done) {
      var grid = g({
        test: this.test,
        data: [{ 'Column A': 'Original value' }],
      });

      grid.focus();
      grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });

      grid.addEventListener('afterdelete', function (event) {
        event.preventDefault();
        doAssert(
          event.cells[0].length == 4,
          'first affected cell is [rowIndex, columnIndex, boundRowIndex, boundColumnIndex] tuple',
        );
        chai.assert.deepStrictEqual(event.cells[0], [0, 0, 0, 0]);
        done();
      });

      grid.deleteSelectedData();
    });

    it('selection on filtered view clears data', function () {
      var grid = g({
        test: this.test,
        data: [
          { 'Column A': 'Original value' },
          { 'Column A': 'Foo bar' },
          { 'Column A': 'Original value' },
        ],
      });

      grid.focus();
      grid.setFilter('Column A', 'Original');
      grid.selectArea({ top: 0, left: 0, bottom: 1, right: 1 });

      grid.deleteSelectedData();
      chai.assert.deepStrictEqual(
        grid.viewData.map((c) => Object.values(c)).flat(),
        ['', ''],
      );
      chai.assert.deepStrictEqual(
        grid.data.map((c) => Object.values(c)).flat(),
        ['', 'Foo bar', ''],
        'Bound data has been updated',
      );
    });
  });
  it('Moving handle on desktop fills the overlay region with selection data', function (done) {
    const grid = g({
      test: this.test,
      data: [{ field1: 'value1' }, { field1: 'value2' }, { field1: 'value3' }],
      fillCellCallback: function (args) {
        return (
          args.newCellData + ' ' + (args.fillingRowPosition + 1).toString()
        );
      },
      selectionHandleBehavior: 'single',
    });
    let handled = false;

    grid.addEventListener('afterdraw', function (ev) {
      if (handled) return;
      handled = true;
      handlemove(grid, 0, 30);

      try {
        const expectedResult = [
          { field1: 'value1' },
          { field1: 'value1 1' },
          { field1: 'value1 2' },
        ];

        for (let i = 0; i < grid.viewData.length; i++) {
          for (const columnKey in grid.viewData[i]) {
            const expectedValue = expectedResult[i][columnKey];
            const currentValue = grid.viewData[i][columnKey];
            doAssert(
              currentValue === expectedValue,
              `Value for "${columnKey}" should be "${expectedValue}", but got "${currentValue}"`,
            );
          }
        }

        done();
      } catch (error) {
        done(error);
      }
    });

    grid.focus();
    grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });
  });
}
