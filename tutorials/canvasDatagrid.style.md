Setting Styles
--------------

Styles can be set during instantiation.

    var grid = canvasDatagrid({
            style: {
                backgroundColor: 'red'
            }
        });

Styles can be set after instantiation.

    grid.style.backgroundColor = 'red';

When using the web component, styles can be set as above, but also using standard CSS.

When using standard CSS, style names are hyphenated, lower case, and prefixed with `--cdg-`.

    <canvas-datagrid style="--cdg-background-color: red;">[{"my": "data"}]</canvas-datagrid>

When using the web component you can also use CSS classes and selectors as you would a native HTML element.
    
    <style>
        .my-grid {
            --cdg-background-color: red;
        }
    </style>

    <canvas-datagrid class="my-grid">[{"my": "data"}]</canvas-datagrid>

You can build your own styles using the <a href="https://tonygermaneri.github.io/canvas-datagrid/tutorials/styleBuilder.html">Style Builder</a>.
