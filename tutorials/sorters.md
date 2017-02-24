Object that contains a list of sorting functions for sorting columns.

| Argument | Description |
|-----|------|
| columnName | Name of the column to be sorted. |
| direction | `asc` or `desc` for ascending or descending. |

Sorter function must return a sort function.
This function will be used in the [native sort method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

Example sorter:

    grid.sorters.number = function (columnName, direction) {
        var asc = direction === 'asc';
        return function (a, b) {
            if (asc) {
                return a[columnName] - b[columnName];
            }
            return b[columnName] - a[columnName];
        };
    };
