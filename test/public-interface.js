import {
  mouseup,
  mousedown,
  makeData,
  mousemove,
  assertPxColor,
  g,
  smallData,
  assertIf,
  c,
} from './util.js';

export default function () {
  it('Focus on the grid', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    grid.focus();
    done(assertIf(!grid.hasFocus, 'Expected the grid to have focus'));
  });
  it('Blur the grid', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    grid.blur();
    done(assertIf(grid.hasFocus, 'Expected the grid to not have focus'));
  });
  it('Insert column', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '', e: '' }],
      schema: [{ name: 'd' }, { name: 'e' }],
    });
    grid.insertColumn(
      {
        name: 'f',
        defaultValue: 'g',
      },
      1,
    );
    done(
      assertIf(
        grid.schema[1].name !== 'f' || grid.data[0].f !== 'g',
        'Expected to see a specific column here, it is not here.',
      ),
    );
  });
  it('Use a function as a default value', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '', e: '' }],
      schema: [{ name: 'd' }, { name: 'e' }],
    });
    grid.insertColumn(
      {
        name: 'f',
        defaultValue: function () {
          return 'g';
        },
      },
      1,
    );
    done(
      assertIf(
        grid.schema[1].name !== 'f' || grid.data[0].f !== 'g',
        'Expected to see a specific column here, it is not here.',
      ),
    );
  });
  it('Autosize a column', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '123456', e: '123456' }],
    });
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.columnIndex === 1) {
        e.ctx.fillStyle = c.b;
      }
    });
    grid.autosize('d');
    grid.draw();
    assertPxColor(grid, 200, 32, c.b, done);
  });
  it('Autosize all columns', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '123456', e: '123456' }],
      style: {
        gridBackgroundColor: c.b,
      },
    });
    grid.autosize();
    grid.draw();
    assertPxColor(grid, 220, 32, c.b, done);
  });
  it('Add a style to the style setter', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '123456', e: '123456' }],
    });
    grid.style.gridBackgroundColor = c.b;
    assertPxColor(grid, 200, 70, c.b, done);
  });
  it('Add an attribute to the attribute setter', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '123456', e: '123456' }],
    });
    grid.addEventListener('attributechanged', function () {
      done(
        assertIf(grid.attributes.name !== 'blah', 'expected name to be blah'),
      );
    });
    grid.attributes.name = 'blah';
  });
  it('Get visible schema', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '123456', e: '123456' }],
    });
    done(
      assertIf(
        grid.visibleSchema[0].name !== 'd',
        'Expected schema to be returned',
      ),
    );
  });
  it('Get visible rows', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '123456', e: '123456' }],
    });
    done(
      assertIf(grid.visibleRows.length === 1, 'Expected 1 row to be returned'),
    );
  });
  it('Get visible cells', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '123456', e: '123456' }],
    });
    done(
      assertIf(
        grid.visibleCells.length === 2,
        'Expected 2 cells to be returned',
      ),
    );
  });
  it('Get current cell', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '123456', e: '123456' }],
    });
    mousemove(grid.canvas, 45, 37);
    mousedown(grid.canvas, 45, 37);
    mouseup(grid.canvas, 45, 37);
    done(
      assertIf(
        grid.currentCell.rowIndex !== 0,
        'Expected current cell to be rowIndex 0',
      ),
    );
  });
  it('Property `boundData` should be equal to original source data', function () {
    const data = smallData();
    const grid = g({
      test: this.test,
      data,
    });

    assert.deepStrictEqual(grid.boundData, data);

    grid.setFilter('col1', 'foo');
    grid.order('col1', 'desc');

    assert.deepStrictEqual(
      grid.boundData,
      data,
      'filtering/sorting does not affect boundData',
    );
  });
  it('Get offsetLeft of the parent node', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '123456', e: '123456' }],
    });
    done(assertIf(grid.offsetLeft === 0, 'Expected offsetLeft to be > 0'));
  });
  it.skip('Get offsetTop of the parent node', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '123456', e: '123456' }],
    });
    done(assertIf(grid.offsetTop === 0, 'Expected offsetLeft to be > 0'));
  });
  it('Get the offsetParent node', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '123456', e: '123456' }],
    });
    done(assertIf(grid.offsetParent === undefined, 'Expected a DOM node'));
  });
  it.skip('Should throw an error if insertColumn is passed a bad index', function (done) {
    var e,
      grid = g({
        test: this.test,
        data: [{ d: '', e: '' }],
        schema: [{ name: 'd' }, { name: 'e' }],
      });
    try {
      grid.insertColumn(
        {
          name: 'f',
          defaultValue: 'g',
        },
        5000,
      );
    } catch (er) {
      e = er;
    } finally {
      done(
        assertIf(e === undefined, 'Expected insertColumn to throw an error.'),
      );
    }
  });
  it('Delete column', function (done) {
    var grid = g({
        test: this.test,
        data: [{ d: '', e: '' }],
      }),
      n = Object.keys(smallData()[0])[0];
    grid.deleteColumn(0);
    done(
      assertIf(
        Object.keys(grid.data[0])[0] === n || grid.schema[0].name === n,
        'Expected to see column 0 deleted, but it appears to still be there.',
      ),
    );
  });
  it('Add column', function (done) {
    var l,
      grid = g({
        test: this.test,
        data: [{ d: '', e: '' }],
        schema: [{ name: 'd' }, { name: 'e' }],
      });
    grid.addColumn({
      name: 'f',
      defaultValue: 'g',
    });
    l = grid.schema.length - 1;
    done(
      assertIf(
        grid.schema[l].name !== 'f' || grid.data[0].f !== 'g',
        'Expected to see a specific column here, it is not here.',
      ),
    );
  });
  it('Add row', function (done) {
    var l,
      grid = g({
        test: this.test,
        data: [{ d: '', e: '' }],
        schema: [{ name: 'd' }, { name: 'e', defaultValue: 10 }],
      });
    grid.addRow({ d: '1' });
    l = grid.data.length - 1;
    done(
      assertIf(
        grid.data[l].d !== '1' || grid.data[l].e !== 10,
        'Expected to see a specific row here, it is not here.',
      ),
    );
  });
  it('Insert row', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { d: '1', e: '2' },
        { d: '3', e: '4' },
      ],
      schema: [{ name: 'd' }, { name: 'e', defaultValue: 10 }],
    });
    grid.insertRow({ d: '6' }, 1);
    done(
      assertIf(
        grid.data[2].d !== '3' || grid.data[1].e !== 10,
        'Expected to see a specific row here, it is not here.',
      ),
    );
  });
  it('Should throw an error if insertRow is passed a bad index', function (done) {
    var e,
      grid = g({
        test: this.test,
        data: [{ d: '', e: '' }],
        schema: [{ name: 'd' }, { name: 'e' }],
      });
    try {
      grid.insertRow({ d: '6' }, 5000);
    } catch (er) {
      e = er;
    } finally {
      done(assertIf(e === undefined, 'Expected insertRow to throw an error.'));
    }
  });
  it('Delete row', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '1' }, { d: '2' }],
    });
    grid.deleteRow(1);
    done(
      assertIf(
        grid.data.length !== 1 || grid.data[0].d !== '1',
        'Expected to see only 1 row, expected row 1 to contain a specific value.',
      ),
    );
  });
  it('Set row height', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.rowIndex === 0) {
        e.ctx.fillStyle = c.y;
      }
    });
    grid.setRowHeight(0, 60);
    assertPxColor(grid, 40, 80, c.y, done);
  });
  it('Set column width', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.columnIndex === 0) {
        e.ctx.fillStyle = c.y;
      }
    });
    grid.setColumnWidth(0, 10);
    setTimeout(function () {
      assertPxColor(grid, 48, 78, c.y, done);
    }, 1);
  });
  it('Reset row height', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.rowIndex !== 0) {
        e.ctx.fillStyle = c.y;
      }
    });
    grid.setRowHeight(0, 60);
    grid.resetRowHeights();
    assertPxColor(grid, 90, 80, c.y, done);
  });
  it('Reset column width', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.columnIndex === 1) {
        e.ctx.fillStyle = c.y;
      }
    });
    grid.setColumnWidth(0, 10);
    grid.resetColumnWidths();
    assertPxColor(grid, 340, 80, c.y, done);
  });
  it('Inserting an impossible column index should throw an error', function (done) {
    var err,
      grid = g({
        test: this.test,
        data: [{ d: '', e: '' }],
        schema: [{ name: 'd' }, { name: 'e' }],
      });
    try {
      grid.insertColumn(
        {
          name: 'f',
          defaultValue: 'g',
        },
        999,
      );
    } catch (e) {
      err = e;
    }

    done(assertIf(!err, 'Expected to see an error.'));
  });
  it('Inserting an impossible row index should throw an error', function (done) {
    var err,
      grid = g({
        test: this.test,
        data: [{ d: '', e: '' }],
        schema: [{ name: 'd' }, { name: 'e' }],
      });
    try {
      grid.insertrow(
        {
          d: 'f',
          e: 'g',
        },
        999,
      );
    } catch (e) {
      err = e;
    }
    done(assertIf(!err, 'Expected to see an error.'));
  });
  it('Goto a specific row', function (done) {
    var grid = g({
      test: this.test,
      data: makeData(30, 30),
    });
    grid.gotoRow(20);
    done(
      assertIf(
        grid.scrollTop < 1,
        'Expected scrollTop to be a little further along.',
      ),
    );
  });
  it('Fit column size to values', function (done) {
    var doneCalled,
      grid = g({
        test: this.test,
        data: makeData(30, 30, function (y, x) {
          return x + ':' + y;
        }),
      });
    grid.fitColumnToValues('a');
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.rowIndex === 0 && e.cell.columnIndex === 0) {
        if (doneCalled) {
          return;
        }
        doneCalled = true;
        done(
          assertIf(
            e.cell.width > 100,
            'Expected column to be a little narrower.',
          ),
        );
      }
    });
    grid.draw();
  });
  it('isCellVisible should return true when cell is visible, false when it is not', function (done) {
    var grid = g({
      test: this.test,
      data: makeData(30, 30, function (y, x) {
        return x + ':' + y;
      }),
    });
    done(
      assertIf(
        !grid.isCellVisible({ x: 0, y: 0 }) ||
          grid.isCellVisible({ x: 0, y: 20 }),
        'Expected column to be a little narrower.',
      ),
    );
  });
}
