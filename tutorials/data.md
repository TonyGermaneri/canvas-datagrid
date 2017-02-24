This is how data is set in the grid.
Data must be an array of objects that conform to a schema.

    [
        {col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3'},
        {col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3'}
    ]

Data values can be any primitive type.  However if a cell value is another data array,
a child grid will be rendered into the cell.  This child grid is different than a
tree view grid and uses the `childGridAttributes` attribute for properties and styling.
