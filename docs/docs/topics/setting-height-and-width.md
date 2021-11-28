---
title: Setting height and width
---

Limiting the size of the canvas-datagrid element is the best way to improve performance.

canvas-datagrid by default is set to `grid.style.height: auto` and `grid.style.width: auto`.
This means the canvas-datagrid element expands to the height and width of the rows and columns contained within.
If you have many rows or columns you will want to limit the height and width of the element by setting
`grid.style.height` and `grid.style.width` to something besides `auto`. Try `100%` or `300px`.

When set to a value other than auto a virtual scroll box will be drawn onto the canvas
constraining the size and allowing the user to scroll around the columns and rows.

Currently `max-width`, `max-height`, `min-width` and `min-height` are not supported and will do nothing, but support is planned.
