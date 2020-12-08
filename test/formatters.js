import { assertPxColor, blocks, g, c } from './util.js';

export default function () {
  it('Should format values using formating functions', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: '' }],
      schema: [{ name: 'd', type: 's' }],
      formatters: {
        s: function () {
          return blocks;
        },
      },
    });
    assertPxColor(grid, 90, 32, c.black, done);
  });
}
