/*jslint browser: true, unparam: true*/
/*globals canvasDatagrid: false */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    function createRandomSampleData(rows) {
        var x, data = [], d, i, c,
            r = 'Elend, eam, animal omittam an, has in, explicari principes. Elit, causae eleifend mea cu. No sed adipisci accusata, ei mea everti melius periculis. Ei quot audire pericula mea, qui ubique offendit no. Sint mazim mandamus duo ei. Sumo maiestatis id has, at animal reprehendunt definitionem cum, mei ne adhuc theophrastus.';
        c = r.split(' ').map(function (i) { return i.trim(); });
        r = r.split(',').map(function (i) { return i.trim(); });
        for (x = 0; x < rows; x += 1) {
            d = {};
            for (i = 0; i < r.length; i += 1) {
                d[r[i]] = c[Math.floor(Math.random() * 1000) % (c.length - 1)];
            }
            data.push(d);
        }
        return data;
    }
    var parentNode,
        grid,
        sampleData = createRandomSampleData(Math.pow(10, 5)),
        schema = Object.keys(sampleData[0]).map(function (col) {
            return {
                hidden: col === 'Elit',
                name: col,
                defaultValue: function (header) {
                    return Date.now();
                }
            };
        });
    parentNode = document.createElement('div');
    parentNode.style.width = '90%';
    document.body.appendChild(parentNode);
    document.body.style.background = 'black';
    document.body.style.padding = '25px';
    function resize() {
        parentNode.style.height = window.innerHeight - 100 + 'px';
    }
    resize();
    window.addEventListener('resize', resize);
    // create grid
    grid = canvasDatagrid({
        tree: true,
        name: 'sample',
        parentNode: parentNode,
        showPerformance: true
    });
    grid.data = sampleData;
    grid.schema = schema;
    grid.schema[0].width = 400;
    grid.data[0].Elend = 'Welcome to canvas-dataGrid samples!';
    grid.data[1].Elend = 'View the source of this page to see';
    grid.data[2].Elend = 'how the cells and context menus were altered';
    grid.data[3].Elend = 'in this example.';
    grid.data[2].eam = createRandomSampleData(400);
    grid.addEventListener('rendercell', function (ctx, cell) {
        if (cell.selected || cell.active) { return; }
        if (cell.header.name === 'Elit' && cell.style !== 'headerCell') {
            ctx.fillStyle = 'lightgreen';
        }
        if (cell.rowIndex === 1 && cell.columnIndex === 0) {
            ctx.fillStyle = 'lightyellow';
        }
        if (cell.rowIndex === 2 && cell.columnIndex === 0) {
            ctx.strokeStyle = 'red';
        }
        if (/Elend/.test(cell.value) && cell.style !== 'headerCell') {
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'pink';
        }
    });
    function expandTree(grid, data, rowIndex) {
        grid.data = createRandomSampleData(50);
        grid.attributes.tree = true;
        grid.addEventListener('expandtree', expandTree);
    }
    grid.addEventListener('expandtree', expandTree);
    grid.addEventListener('click', function (e, cell, menuItems, menuElement) {
        grid.data[4].Elend = 'Clicked value -> ' + (typeof cell.value === 'string' ? cell.value : 'Object');
        grid.draw();
    });
    grid.addEventListener('selectionchanged', function (data, matrix, bounds) {
        console.log(JSON.stringify(bounds));
    });
    grid.addEventListener('contextmenu', function (e, cell, menuItems, contextMenu) {
        menuItems.push({
            title: 'Check out ' + cell.value,
            click: function (e) {
                alert('Yup, it\'s ' + cell.value);
            }
        });
        var complexMenuElement = document.createElement('div'),
            checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        complexMenuElement.innerHTML = 'Sample ';
        complexMenuElement.appendChild(checkbox);
        menuItems.push({
            title: complexMenuElement
        });
        checkbox.onclick = function (e) { e.stopPropagation(); };
    });
    grid.draw();
    window.grid = grid;
});