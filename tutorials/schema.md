Schema is optional.  Schema is an array of column objects.
If no schema is provided one will be generated from the
data, in that case all data will be assumed to be string data.

Each column object can have the following properties:

| Property | Description |
|-----|------|
| name | The name of the column.  This is used to match with data and is the only required property. |
| type | The data type of this column |
| title | What will be displayed to the user.  If not present, name will be used. |
| width | The default width in pixels of this column.|
| hidden | When true the column will be hidden. |
| filter | The filter function to use to filter this column.  If no function is provided, type will determine filer. |
| formatter | The formatter function used display this column.  If no function is provided, type will determine formatter.|
| defaultValue | The default value of this column for new rows.  This is a function that takes the arguments `header` and `index` and must return a value for new default cells in this column.|

Example schema:

    [
        {
            name: 'col1'
        },
        {
            name: 'col2'
        },
        {
            name: 'col3'
        }
    ]

