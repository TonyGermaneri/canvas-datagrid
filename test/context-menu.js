import { contextmenu, g, smallData, assertIf } from './util.js';

export default function () {
  it('Should produce a context menu', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    grid.addEventListener('contextmenu', function (e) {
      setTimeout(function () {
        done(
          assertIf(
            !document.body.contains(e.items[0].title),
            'Expected context menu to exist in the body and be visible.',
          ),
        );
      }, 1);
    });
    contextmenu(grid.canvas, 60, 37);
  });
  it('Clicking Order by asc should order the selected column asc', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    grid.addEventListener('contextmenu', function (e) {
      setTimeout(function () {
        e.items[4].contextItemContainer.dispatchEvent(new Event('click'));
        done(
          assertIf(
            grid.viewData[0].col1 !== 'bar',
            'Expected the content to be reordered asc.',
          ),
        );
      }, 1);
    });
    contextmenu(grid.canvas, 100, 37);
  });
  it('Should produce a context menu very wide requiring the context menu move to be fully visible', function (done) {
    var d = [],
      x,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    for (x = 0; x < 100; x += 1) {
      d.push({
        title:
          'veryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryverywide',
      });
    }
    grid.addEventListener('contextmenu', function (e) {
      e.items.push({
        title: 'Child menu',
        items: function () {
          return d;
        },
      });
      setTimeout(function () {
        e.items[6].contextItemContainer.dispatchEvent(new Event('mouseover'));
        setTimeout(function () {
          done(
            assertIf(
              !e.items[6].contextMenu.container,
              'Expected child context menu.',
            ),
          );
        }, 1);
      }, 1);
    });
    contextmenu(grid.canvas, 60, 37);
  });
  it('Should create a child context menu using a function that returns items', function (done) {
    var d = [],
      x,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    for (x = 0; x < 100; x += 1) {
      d.push({
        title: x,
      });
    }
    grid.addEventListener('contextmenu', function (e) {
      e.items.push({
        title: 'Child menu',
        items: function () {
          return d;
        },
      });
      setTimeout(function () {
        e.items[6].contextItemContainer.dispatchEvent(new Event('mouseover'));
        setTimeout(function () {
          done(
            assertIf(
              !e.items[6].contextMenu.container,
              'Expected child context menu.',
            ),
          );
        }, 1);
      }, 1);
    });
    contextmenu(grid.canvas, 60, 37);
  });
  it('Should create a child context menu using a function that uses a callback argument', function (done) {
    var d = [],
      x,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    for (x = 0; x < 100; x += 1) {
      d.push({
        title: x,
      });
    }
    grid.addEventListener('contextmenu', function (e) {
      e.items.push({
        title: 'Child menu',
        items: function (callback) {
          return callback(d);
        },
      });
      setTimeout(function () {
        e.items[6].contextItemContainer.dispatchEvent(new Event('mouseover'));
        setTimeout(function () {
          done(
            assertIf(
              !e.items[6].contextMenu.container,
              'Expected child context menu.',
            ),
          );
        }, 1);
      }, 1);
    });
    contextmenu(grid.canvas, 60, 37);
  });
  it.skip('Create a child context menu and scroll up and down using mouseover events, then exit menu', function (done) {
    var d = [],
      x,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    for (x = 0; x < 100; x += 1) {
      d.push({
        title: x,
      });
    }
    grid.addEventListener('contextmenu', function (e) {
      e.items.push({
        title: 'child menu',
        items: d,
      });
      setTimeout(function () {
        e.items[6].contextItemContainer.dispatchEvent(new Event('mouseover'));
        e.items[6].contextMenu.downArrow.dispatchEvent(new Event('mouseover'));
        setTimeout(function () {
          var err = assertIf(e.items[6].contextMenu.container.scrollTop === 0);
          if (err) {
            return done(err);
          }
          e.items[6].contextMenu.downArrow.dispatchEvent(new Event('mouseout'));
          e.items[6].contextMenu.upArrow.dispatchEvent(new Event('mouseover'));
          setTimeout(function () {
            e.items[6].contextMenu.upArrow.dispatchEvent(new Event('mouseout'));
            err = assertIf(e.items[6].contextMenu.container.scrollTop !== 0);
            if (err) {
              return done(err);
            }
            setTimeout(function () {
              e.items[6].contextItemContainer.dispatchEvent(
                new Event('mouseout'),
              );
              done(
                assertIf(
                  e.items[6].contextMenu !== undefined,
                  'expected child context menu to be gone.',
                ),
              );
            }, 100);
          }, 1500);
        }, 1000);
      }, 1);
    });
    contextmenu(grid.canvas, 60, 37);
  });
  it('Autocomplete should appear when a value is entered into the filter input', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    grid.addEventListener('contextmenu', function (e) {
      setTimeout(function () {
        //HACK: get to filter input element in context menu
        var i = e.items[0].title.children[1];
        i.value = 'f';
        i.dispatchEvent(new Event('keyup'));
        done(
          assertIf(
            document.body.lastChild.childNodes.length === 1 &&
              document.body.lastChild.firstChild.innerHTML !== 'foo',
            'Expected the autocomplete to be the most recent item added to body and expected it to only contain "foo"',
          ),
        );
      }, 1);
    });
    contextmenu(grid.canvas, 100, 37);
  });
  it('Autocomplete keys should key down and filter', function (done) {
    var err,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.addEventListener('contextmenu', function (e) {
      setTimeout(function () {
        //HACK: get to filter input element in context menu
        var i = e.items[0].title.children[1];
        i.value = 'b';
        i.dispatchEvent(new Event('keyup'));

        ['ArrowDown', 'Enter'].forEach(function (key) {
          var ev = new Event('keydown');
          ev.key = key;

          i.dispatchEvent(ev);

          if (key === 'Enter') {
            err = assertIf(
              grid.viewData[0].col1 !== 'baz',
              'Expected key combination to filter for baz',
            );
          }
        });
        done(err);
      }, 1);
    });
    contextmenu(grid.canvas, 100, 37);
  });
  it('Autocomplete keys should key down, key up and filter', function (done) {
    var err,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.addEventListener('contextmenu', function (e) {
      setTimeout(function () {
        //HACK: get to filter input element in context menu
        var i = e.items[0].title.children[1];
        i.value = 'b';
        i.dispatchEvent(new Event('keyup'));
        ['ArrowDown', 'ArrowUp', 'Enter'].forEach(function (key) {
          var ev = new Event('keydown');
          ev.key = key;

          i.dispatchEvent(ev);

          if (key === 'Enter') {
            err = assertIf(
              grid.viewData[0].col1 !== 'bar',
              'Expected key combination to filter for bar',
            );
          }
        });
        done(err);
      }, 1);
    });
    contextmenu(grid.canvas, 100, 37);
  });
  it('Autocomplete keys should key tab', function (done) {
    var err,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.addEventListener('contextmenu', function (e) {
      setTimeout(function () {
        //HACK: get to filter input element in context menu
        var i = e.items[0].title.children[1];
        i.value = 'f';
        i.dispatchEvent(new Event('keyup'));
        ['Tab'].forEach(function (key) {
          var ev = new Event('keydown');
          ev.key = key;
          i.dispatchEvent(ev);
          if (key === 'Tab') {
            err = assertIf(
              grid.viewData[0].col1 !== 'foo',
              'Expected key combination to filter for bar',
            );
          }
        });
        done(err);
      }, 1);
    });
    contextmenu(grid.canvas, 100, 37);
  });
  it('Autocomplete keys should key esc', function (done) {
    var err,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.addEventListener('contextmenu', function (e) {
      setTimeout(function () {
        //HACK: get to filter input element in context menu
        var i = e.items[0].title.children[1];
        i.value = 'f';
        i.dispatchEvent(new Event('keyup'));
        ['Escape'].forEach(function (key) {
          var ev = new Event('keydown');
          ev.key = key;
          i.dispatchEvent(ev);
          if (key === 'esc') {
            err = assertIf(
              grid.viewData[0].col1 !== 'foo',
              'Expected key combination to filter for bar',
            );
          }
        });
        done(err);
      }, 1);
    });
    contextmenu(grid.canvas, 100, 37);
  });
  it('Autocomplete should have an option for filtering blank values', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { col1: 'bar', col2: 0, col3: 'a' },
        { col1: '    ', col2: 1, col3: 'b' },
        { col1: 'baz', col2: 2, col3: 'c' },
      ],
    });
    grid.addEventListener('contextmenu', function (e) {
      setTimeout(function () {
        //HACK: get to filter input element in context menu
        var i = e.items[0].title.children[1];
        i.value = '';
        i.dispatchEvent(new Event('keyup'));
        var firstDropdownValue =
          document.body.lastChild.childNodes[0].innerHTML;
        var containsBlanksText = firstDropdownValue === '(Blanks)';
        done(
          assertIf(
            !containsBlanksText,
            'Expected the autocomplete to have blanksText value item',
          ),
        );
      }, 1);
    });
    contextmenu(grid.canvas, 100, 37);
  });
  it('Should store JSON view state data, then clear it once clear settings is clicked.', function (done) {
    var n = 'a' + new Date().getTime(),
      k = 'canvasDataGrid-' + n,
      grid = g({
        test: this.test,
        data: smallData(),
        name: n,
      });
    grid.order('col1');
    grid.addEventListener('contextmenu', function (e) {
      setTimeout(function () {
        var err,
          i = localStorage.getItem(k);
        e.items[3].contextItemContainer.dispatchEvent(new Event('click'));
        err = assertIf(
          localStorage.getItem(k) === i,
          'expected storage values to differ',
        );
        localStorage.removeItem(k);
        done(err);
      }, 1);
    });
    contextmenu(grid.canvas, 100, 37);
  });
}
