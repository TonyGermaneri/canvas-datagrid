import { g, assertIf } from './util.js';

export default function () {
  it('Should sort a string, should handle null and undefined', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { a: 'a' },
        { a: 'b' },
        { a: 'c' },
        { a: 'd' },
        { a: null },
        { a: undefined },
      ],
      schema: [{ name: 'a', type: 'string' }],
    });
    grid.order('a', 'desc');
    done(
      assertIf(
        grid.viewData[0].a !== 'd',
        'expected to see sort by string desc',
      ),
    );
  });
  it('Should sort numbers', function (done) {
    var grid = g({
      test: this.test,
      data: [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }],
      schema: [{ name: 'a', type: 'number' }],
    });
    grid.order('a', 'desc');
    done(
      assertIf(grid.viewData[0].a !== 5, 'expected to see sort by number desc'),
    );
  });
  it('Should sort date', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { a: 1503307131397 },
        { a: 1503307132397 },
        { a: 1503307133397 },
        { a: 1503307134397 },
        { a: 1503307135397 },
        { a: 1503307136397 },
      ],
      schema: [{ name: 'a', type: 'date' }],
    });
    grid.formatters.date = function (e) {
      return new Date(e.cell.value).toISOString();
    };
    grid.order('a', 'desc');
    done(
      assertIf(
        grid.viewData[0].a !== 1503307136397,
        'expected to see sort by date desc',
      ),
    );
  });
  it('Should set orderBy', function (done) {
    var grid = g({
      test: this.test,
      data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
      schema: [{ name: 'a', type: 'string' }],
    });
    if (grid.orderBy !== null) {
      throw new Error('expected orderBy to be null initially');
    }
    grid.order('a', 'desc');
    done(assertIf(grid.orderBy !== 'a', 'expected orderBy to be set'));
  });
  it('Should set orderDirection', function (done) {
    var grid = g({
      test: this.test,
      data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
      schema: [{ name: 'a', type: 'string' }],
    });
    if (grid.orderDirection !== 'asc') {
      throw new Error('expected orderBy to be asc initially');
    }
    grid.order('a', 'desc');
    done(
      assertIf(
        grid.orderDirection !== 'desc',
        'expected orderDirection to be set',
      ),
    );
  });
  it('Should sort with string sorter if type sorter undefined', function (done) {
    var grid = g({
      test: this.test,
      data: [{ a: '0' }, { a: '10' }, { a: '2' }],
      schema: [{ name: 'a', type: 'xxx' }],
      formatters: {
        xxx: function (e) {
          return e.cell.value.toString();
        },
      },
    });
    grid.order('a', 'desc');
    done(
      assertIf(
        grid.viewData[0].a !== '2',
        'expected to see sort by string desc',
      ),
    );
  });
  it('Should preserve current sort order, effectively allowing sort on multiple columns', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { a: 'a', b: 'a' },
        { a: 'b', b: 'a' },
        { a: 'c', b: 'b' },
      ],
      schema: [
        { name: 'a', type: 'string' },
        { name: 'b', type: 'string' },
      ],
    });
    grid.order('a', 'desc');
    grid.order('b', 'asc');
    done(
      assertIf(
        grid.viewData[0].a !== 'b',
        'expected to see sort by a desc then b asc',
      ),
    );
  });
  it('Should throw when a nonexistant column name is passed', function (done) {
    var grid = g({
      test: this.test,
      data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
      schema: [{ name: 'a', type: 'string' }],
    });
    var err;
    try {
      grid.order('x', 'desc');
    } catch (e) {
      err = e;
    }
    done(assertIf(typeof err === 'undefined', 'Error not thrown'));
  });
  it('Should raise beforesortcolumn before sort', function (done) {
    var err = new Error('Expected beforesortcolumn event to be raised');
    var grid = g({
      test: this.test,
      data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
      schema: [{ name: 'a', type: 'string' }],
    });
    grid.addEventListener('beforesortcolumn', function (e) {
      err =
        assertIf(e.name !== 'a', 'name should be "a" but was "%s"', e.column) ||
        assertIf(
          e.direction !== 'desc',
          'direction should be "desc" but was "%s"',
          e.direction,
        ) ||
        assertIf(
          grid.viewData[0].a !== 'a',
          'expected data to not be sorted in event',
        );
    });
    grid.order('a', 'desc');
    done(
      err || assertIf(grid.viewData[0].a !== 'c', 'expected data to be sorted'),
    );
  });
  it('Should not sort when beforesortcolumn prevents default', function (done) {
    var grid = g({
      test: this.test,
      data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
      schema: [{ name: 'a', type: 'string' }],
    });
    grid.addEventListener('beforesortcolumn', function (e) {
      e.preventDefault();
    });
    grid.order('a', 'desc');
    done(
      assertIf(grid.viewData[0].a !== 'a', 'expected no change in sort order'),
    );
  });
  it('Should raise sortcolumn event after sort', function (done) {
    var grid = g({
      test: this.test,
      data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
      schema: [{ name: 'a', type: 'string' }],
    });
    grid.addEventListener('sortcolumn', function (e) {
      done(
        assertIf(e.name !== 'a', 'name should be "a" but was "%s"', e.column) ||
          assertIf(
            e.direction !== 'desc',
            'direction should be "desc" but was "%s"',
            e.direction,
          ) ||
          assertIf(grid.viewData[0].a !== 'c', 'expected data to be sorted'),
      );
    });
    grid.order('a', 'desc');
  });
  it('Should raise sortcolumn event only once', function (done) {
    var grid = g({
      test: this.test,
      data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
      schema: [{ name: 'a', type: 'string' }],
    });
    var callCnt = 0;
    grid.addEventListener('sortcolumn', function () {
      callCnt++;
    });
    grid.order('a', 'desc');

    done(
      assertIf(callCnt !== 1, 'expected sort column to only be called once'),
    );
  });
  it('Should not raise sortcolumn event when beforesortcolumn prevents default', function (done) {
    var grid = g({
      test: this.test,
      data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
      schema: [{ name: 'a', type: 'string' }],
    });
    grid.addEventListener('beforesortcolumn', function (e) {
      e.preventDefault();
    });
    grid.addEventListener('sortcolumn', function () {
      throw new Error('sortcolumn event');
    });
    grid.order('a', 'desc');
    done();
  });
  it('Should apply the schema sorter to sort data', function (done) {
    var grid = g({
      test: this.test,
      data: [{ a: 'ab' }, { a: 'ba' }, { a: 'cd' }, { a: 'dc' }],
      schema: [
        {
          name: 'a',
          type: 'string',
          sorter: function (col, dir) {
            var mult = dir === 'desc' ? -1 : 1;
            return function (x, y) {
              var x1 = x[col].charCodeAt(1),
                y1 = y[col].charCodeAt(1);
              return mult * (x1 - y1);
            };
          },
        },
      ],
    });
    grid.order('a', 'desc');
    done(
      assertIf(
        grid.viewData[0].a !== 'cd',
        'expected schema sorter to be used',
      ),
    );
  });
  it('Should reapply current sort after data set', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { a: 'a', b: 'a' },
        { a: 'b', b: 'b' },
        { a: 'c', b: 'c' },
      ],
      schema: [
        { name: 'a', type: 'string' },
        { name: 'b', type: 'string' },
      ],
    });
    grid.order('a', 'desc');
    grid.order('b', 'asc');
    grid.data = [
      { a: 'a', b: 'a' },
      { a: 'b', b: 'a' },
      { a: 'c', b: 'b' },
    ];
    done(
      assertIf(
        grid.viewData[0].a !== 'b',
        'expected to see sort by a desc then b asc',
      ),
    );
  });
  it('Should reapply current sort after filter', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { a: 'a', b: 'a' },
        { a: 'b', b: 'a' },
        { a: 'c', b: 'b' },
      ],
      schema: [
        { name: 'a', type: 'string' },
        { name: 'b', type: 'string' },
      ],
    });
    grid.order('a', 'desc');
    grid.setFilter('b', 'a');
    done(
      assertIf(
        grid.viewData[0].a !== 'b',
        'expected to see sort by a desc then b asc',
      ),
    );
  });
}
