Web Component
=============

The grid can be instantiated as a web component.

```html
    <canvas-datagrid></canvas-datagrid>
```

To set data, add JSON between the open and close tags.


```html
        <canvas-datagrid>[
            {"col1": "row 1 column 1", "col2": "row 1 column 2", "col3": "row 1 column 3"},
            {"col1": "row 2 column 1", "col2": "row 2 column 2", "col3": "row 2 column 3"}
        ]</canvas-datagrid>
```

To set attributes, add attributes.  Attributes are not case sensitive when using HTML.  When using the same element in JavaScript however they are case sensitive.

```html
    <canvas-datagrid selectionmode='row'></canvas-datagrid>
```

Styles are declared as custom css properties prefixed with --cdg- and hyphenated rather than camelCase.
For example, the style "backgroundColor" is set with "--cdg-background-color".  The web component
works with classes, css cascading, and in-line styles just like any other HTML element.

Inline styles:

```html
        <canvas-datagrid style="--cdg-background-color: lightblue;">[
            {"col1": "row 1 column 1", "col2": "row 1 column 2", "col3": "row 1 column 3"},
            {"col1": "row 2 column 1", "col2": "row 2 column 2", "col3": "row 2 column 3"}
        ]</canvas-datagrid>
```

Class styles.

```html
        <style>
            .grid {
                --cdg-background-color: lightblue;
            }
        </style>
        <canvas-datagrid class="grid">[
            {"col1": "row 1 column 1", "col2": "row 1 column 2", "col3": "row 1 column 3"},
            {"col1": "row 2 column 1", "col2": "row 2 column 2", "col3": "row 2 column 3"}
        ]</canvas-datagrid>
```


You can still access the grid as you would expect and the interface for the web component instance is the same as the module loaded or globally scoped version.  The web component version has additional properties that come from inheriting the base HTTPElement class.

For further reading about web components see: https://www.webcomponents.org/

* When instantiating the grid using the Webpack loader or the global function canvasDatagrid, class support will not work.

