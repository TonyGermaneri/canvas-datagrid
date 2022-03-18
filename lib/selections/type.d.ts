/**
 * The descriptor for a cells range.
 * For example: `{startRow: 1, startCol: 1, endRow: 2, endColumn: 2}` is a range with four cells.
 * And `{startRow: 1, endRow: 2}` is a range with two rows.
 * - For the cells block, four properties are required.
 * - For the rows, `startRow` and `endRow` are required.
 * - For the columns, `startCol` and `endColumn` are required.
 */
type RangeDescriptor = {
  startRow?: number;
  startColumn?: number;
  endRow?: number;
  endColumn?: number;
};

/**
 * The descriptor for a selection
 * @see SelectionType
 */
type SelectionDescriptor = {
  type: number;
} & RangeDescriptor;

type ContextForSelectionAction = {
  rows?: number;
  columns?: number;
};

type RectangleObject = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type ClipboardInterface = {
  setData: (mimeType: string, data: any) => any;
};
