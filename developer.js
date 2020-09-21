document.addEventListener('DOMContentLoaded', function () {
    var parentNode = document.body;
    // create a new grid
    //var grid = document.createElement('canvas-datagrid');
    var grid = canvasDatagrid();
    grid.className = 'myGridStyle';
    grid.data = [
        {col1: 'foo', col2: 0, col3: 'a'},
        {col1: 'bar', col2: 1, col3: 'b'},
        {col1: 'baz', col2: 2, col3: 'c'}
    ];
    grid.style.width = '100%';
    grid.style.height = '100%';
    parentNode.appendChild(grid);
});