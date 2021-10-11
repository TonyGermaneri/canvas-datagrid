import {
  mouseup,
  mousedown,
  dblclick,
  mousemove,
  doAssert,
  g,
  smallData,
  assertIf,
} from './util.js';

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
    mousemove(document.body, 65, 37, grid.canvas);
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
  it.skip('Should copy a value onto the simulated clipboard.', function (done) {
    var once,
      grid = g({
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
    grid.selectAll();
    grid.focus();
    setTimeout(function () {
      grid.copy({
        clipboardData: {
          setData: function (mime, data) {
            if (once) {
              return;
            }
            once = true;
            done(
              assertIf(
                mime !== 'text/html' || data.indexOf('Text with') === -1,
                'Expected data from the grid to be placed into the fake clipboard.',
              ),
            );
          },
        },
        preventDefault: () => null, // noop so the call in addCellValue doesn't cause an error
      });
    }, 1);
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
  it('Should paste an HTML value from the clipboard into a cell', function (done) {
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
  it('paste a CF_HTML table value from the clipboard into a cell', function (done) {
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
                '<html> <body> <!--StartFragment--><table><tr><td>Paste buffer value</td></tr></table><!--EndFragment--> </body> </html>',
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

  it('paste a CF_HTML table with multiple cells from the clipboard', function (done) {
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
      const cellData = [...new Set(grid.viewData
        .map((row) => Object.values(row))
        .flat())];
      done(
        doAssert(
          cellData[0] === 'Paste buffer value' && cellData.length === 1,
          'Value has not been replaced with clipboard data: ' + cellData,
        ),
      );
    }, 10);
  });
  it('paste a CF_HTML table row / single cell value from the clipboard into a cell', function (done) {
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
  it('paste a CF_HTML div value from the clipboard into a cell', function (done) {
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
}
