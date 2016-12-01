/*jslint browser: true, unparam: true*/
/*globals canvasDatagrid: false */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    function createRandomSampleData() {
        var rows = Math.pow(10, 6), x, data = [], d, i, c,
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
        sampleData = createRandomSampleData(),
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
    document.body.appendChild(parentNode);
    document.body.style.background = 'black';
    document.body.style.margin = '0';
    function resize() {
        parentNode.style.height = window.innerHeight + 'px';
        parentNode.style.width = window.innerWidth + 'px';
    }
    resize();
    window.addEventListener('resize', resize);
    // create grid
    grid = canvasDatagrid({
        name: 'sample',
        parentNode: parentNode,
        showPerformance: true
    });
    grid.data = sampleData;
    grid.schema = schema;
    grid.addEventListener('rendercell', function (ctx, cell) {
        if (cell.selected || cell.active) { return; }
        if (cell.header.name === 'Elit' && cell.style !== 'headerCell') {
            ctx.fillStyle = 'lightgreen';
        }
        if (cell.rowIndex === 1 && cell.columnIndex === 0) {
            ctx.fillStyle = 'lightyellow';
        }
        if (cell.rowIndex === 1 && cell.columnIndex === 1) {
            ctx.strokeStyle = 'red';
        }
        if (cell.value === 'Elend') {
            ctx.fillStyle = 'red';
        }
    });
    grid.addEventListener('click', function (e, cell, menuItems, menuElement) {
        grid.data[0].Alpha = 'Woah! ' + cell.value;
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
});