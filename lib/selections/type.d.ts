/**
 * The descriptor for a cells range.
 * For example: `{row0: 1, col0: 1, row1: 2, col1: 2}` is a range with four cells.
 * And `{row0: 1, row1: 2}` is a range with two rows.
 * - For the cells block, four properties are required.
 * - For the rows, `row0` and `row1` are required.
 * - For the columns, `col0` and `col1` are required.
 */
type RangeDescriptor = {
  row0?: number;
  col0?: number;
  row1?: number;
  col1?: number;
};

/**
 * The descriptor for a selection
 * @see SelectionType
 */
type SelectionDescriptor = {
  type: number;
} & RangeDescriptor;
