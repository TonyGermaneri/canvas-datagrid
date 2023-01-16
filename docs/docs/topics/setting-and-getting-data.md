---
title: Setting and getting data
---

Data is set according to the MIME type parser defined in grid.dataType. The default type parser is `application/x-canvas-datagrid`.

This format expects an array of objects or an array of arrays that strictly conform to a schema (i.e.: they all have the same properties or lengths).

Example `application/x-canvas-datagrid`

```js
[
  { col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3' },
  { col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3' },
];
```

or

```js
[
  ['row 1 column 1', 'row 1 column 2', 'row 1 column 3'],
  ['row 2 column 1', 'row 2 column 2', 'row 2 column 3'],
];
```

When getting data, no matter how it was set, it will be returned as `application/x-canvas-datagrid` (an array of objects).

For more information on using and creating custom parsers see: [parsers](https://canvas-datagrid.js.org/#parsers)

The table below lists ways to set data and the default parser used.

| Method                            | Parser                             |
| --------------------------------- | ---------------------------------- |
| data property                     | application/x-canvas-datagrid      |
| web component data attribute      | application/json+x-canvas-datagrid |
| web component innerHTML attribute | application/json+x-canvas-datagrid |

There are two built in parsers.

application/x-canvas-datagrid (Default)
application/json+x-canvas-datagrid

Note: When setting data via the web component innerHTML attribute, only string data can be passed.

Note: When you pass string data into the web component and the `grid.dataType` is set to the default: `application/x-canvas-datagrid` it will become set to `application/json+x-canvas-datagrid` to parse the string data. If `grid.dataType` was previously changed, the parser it was changed to will be used instead.
