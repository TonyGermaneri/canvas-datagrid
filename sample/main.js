/*jslint browser: true, unparam: true*/
/*globals canvasDatagrid: false */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    function createRandomSampleData() {
        var rows = 99999, x, data = [], d, i, c,
            r = 'Elend, eam, animal omittam an, has in, explicari principes. Elit, causae eleifend mea cu. No sed adipisci accusata, ei mea everti melius periculis. Ei quot audire pericula mea, qui ubique offendit no. Sint mazim mandamus duo ei. Sumo maiestatis id has, at animal reprehendunt definitionem cum, mei ne adhuc theophrastus.';
        c = r.split(' ');
        r = r.split(',');
        for (x = 0; x < rows; x += 1) {
            d = {};
            for (i = 0; i < r.length; i += 1) {
                d[r[i]] = c[Math.floor(Math.random() * 1000) % (c.length - 1)];
            }
            data.push(d);
        }
        return data;
    }
    function createSampleData() {
        var x,
            data = [],
            rows = 99999,
            cols = ['Alpha', 'Beta', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'Indigo', 'Juliet', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Pappa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-Ray', 'Yak', 'Zulu'];
        function addRow(col, index) {
            data[x][col] = x + ':' + index;
        }
        for (x = 0; x < rows; x += 1) {
            data[x] = {};
            cols.forEach(addRow);
        }
        return data;
    }
    var parentNode,
        grid,
        sampleData = createSampleData();
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
    grid.addEventListener('rendercell', function (ctx, cell) {
        if (cell.selected || cell.active) { return; }
        if (cell.header.name === 'Beta' && cell.style !== 'headerCell') {
            ctx.fillStyle = 'lightgreen';
        }
        if (cell.rowIndex === 1 && cell.columnIndex === 0) {
            ctx.fillStyle = 'lightyellow';
        }
        if (cell.rowIndex === 1 && cell.columnIndex === 1) {
            ctx.strokeStyle = 'red';
        }
    });
    grid.addEventListener('click', function (e, cell, menuItems, menuElement) {
        grid.data[0].Alpha = 'Woah! ' + cell.value;
        grid.draw();
    });
    grid.addEventListener('selectionchanged', function (data, matrix, bounds) {
        console.log(JSON.stringify(matrix));
    });
    grid.addEventListener('contextmenu', function (e, cell, menuItems, contextMenu) {
        menuItems.push({
            title: 'Check out ' + cell.value,
            onclick: function (e) {
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