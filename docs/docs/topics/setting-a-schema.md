---
title: Setting a schema
---

Schema is optional. Schema is an array of header objects.
This documentation will use the term header and column interchangeably.
If no schema is provided one will be generated from the
data, in that case all data will be assumed to be string data.

Note: When data is generated from an 2D array (array of arrays vs. array of objects) the columns will be named A, B, C, D,... etc..

Each header object can have the following properties:

| Property     | Description                                                                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name         | The name of the column. This is used to match with data and is the only required property.                                                                                                                             |
| type         | The data type of this column                                                                                                                                                                                           |
| title        | What will be displayed to the user. If not present, name will be used.                                                                                                                                                 |
| width        | The default width in pixels of this column.                                                                                                                                                                            |
| hidden       | When true the column will be hidden.                                                                                                                                                                                   |
| filter       | The filter function to use to filter this column. If no function is provided, type will determine filer.                                                                                                               |
| formatter    | The formatter function used display this column. If no function is provided, type will determine formatter.                                                                                                            |
| defaultValue | The default value of this column for new rows. This is a function or a string. When a function is used, it takes the arguments `header` and `index` and must return a value for new default cell value in this column. |

Example schema:

```js
[
  {
    name: 'col1',
  },
  {
    name: 'col2',
  },
  {
    name: 'col3',
  },
];
```
