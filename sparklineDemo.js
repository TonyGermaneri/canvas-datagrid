/*jslint browser: true*/
/*globals canvasDatagrid: false*/
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    function plotSparklineChart(cell, ctx) {
        if (!cell.value) { return; }
        var g,
            gb,
            x = 0,
            d = (cell.value[0] - cell.value[1]).toFixed(2),
            m = Math.max.apply(null, cell.value),
            a = cell.value.reduce(function (ac, c) { return ac + c; }, 0) / cell.value.length,
            i = Math.min.apply(null, cell.value),
            w = cell.width / cell.value.length,
            ar = (d > 0 ? '\u25BC' : '\u25B2'),
            r = cell.height / (m - (m * 0.1));
        function line(n, c) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = c;
            ctx.moveTo(cell.x, cell.y + (n * r));
            ctx.lineTo(cell.x + cell.width, cell.y + (n * r));
            ctx.stroke();
        }
        ctx.save();
        gb = ctx.createLinearGradient((cell.x + cell.width) / 2, cell.y, (cell.x + cell.width) / 2, cell.y + cell.height);
        gb.addColorStop(0, '#0C4B73');
        gb.addColorStop(1, (cell.selected || cell.active) ? '#B3C3CC' : '#041724');
        ctx.fillStyle = gb;
        ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
        ctx.beginPath();
        ctx.moveTo(cell.x, cell.y + cell.height);
        cell.value.forEach(function (d) {
            var cx = cell.x + w + x,
                cy = cell.y + (d * r);
            ctx.lineTo(cx, cy);
            if (d === i || d === m) {
                ctx.fillStyle = d === m ? 'green' : 'red';
                ctx.fillRect(cx - 2, cy - 2, 5, 5);
            }
            x += w;
        });
        ctx.lineTo(cell.x + cell.width, cell.y + cell.height);
        g = ctx.createLinearGradient((cell.x + cell.width) / 2, cell.y, (cell.x + cell.width) / 2, cell.y + cell.height);
        g.addColorStop(0, '#0F5C8C');
        g.addColorStop(1, '#499ABA');
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = '#0B466B';
        ctx.stroke();
        line(a, d >= 0 ? 'green' : 'red');
        cell.parentGrid.data[cell.rowIndex].col1 = (d === 0 ? ' ' : ar) + ' Diff: ' + d
            + 'Avg:' + a.toFixed(2) + '\nMin: ' + i.toFixed(2) + '\nMax: ' + m.toFixed(2);
        ctx.restore();
    }
    function createRandomSeq(size, r) {
        r = r || [];
        while (r.length < size) {
            r.push(Math.random());
        }
        return r;
    }
    // create a new grid
    var grid = canvasDatagrid({
        parentNode: document.getElementById('grid'),
        schema: [
            {name: 'col1', width: 330},
            {name: 'col2', width: 300},
            {name: 'col3', width: 300}
        ]
    });
    grid.sizes.rows[2] = 200;
    grid.sizes.columns[1] = 600;
    grid.sizes.columns[2] = 400;
    grid.addEventListener('formattext', function (e) {
        if (e.cell.columnIndex < 1) { return; }
        e.preventDefault();
        e.cell.text = { lines: [{value: e.cell.value }] };
    });
    grid.style.height = '100%';
    grid.style.width = '100%';
    grid.addEventListener('contextmenu', function (e) {
        e.items.push({
            title: 'View page source',
            click: function () { window.open('https://github.com/TonyGermaneri/canvas-datagrid/blob/master/tutorials/sparklineDemo.html', 'src'); }
        });
        e.items.push({
            title: 'View JS module',
            click: function () { window.open('https://github.com/TonyGermaneri/canvas-datagrid/blob/master/tutorials/sparklineDemo.js', 'src'); }
        });
        e.items.push({
            title: 'Go to main canvas-datagrid GitHub page',
            click: function () { window.open('https://github.com/TonyGermaneri/canvas-datagrid', 'src'); }
        });
    });
    grid.addEventListener('beforebeginedit', function (e) {
        e.preventDefault();
    });
    grid.addEventListener('beforerendercell', function (e) {
        if (/col2|col3/.test(e.header.name) && !e.cell.isHeader) {
            e.cell.isGrid = false;
        }
    });
    grid.addEventListener('rendertext', function (e) {
        if (/col2|col3/.test(e.header.name) && !e.cell.isHeader) {
            e.preventDefault();
        }
        if (!e.cell.isHeader && e.cell.value && e.cell.value.substring) {
            e.ctx.fillStyle = /Diff: -/.test(e.cell.value) ? '#499A3D' : '#A1230F';
        }
    });
    grid.addEventListener('afterrendercell', function (e) {
        if (/col2|col3/.test(e.header.name) && !e.cell.isHeader) {
            plotSparklineChart(e.cell, e.ctx);
            e.preventDefault();
        }
    });
    grid.data = (function () {
        var d = [], x = 0;
        while (x < 2000) {
            d.push({col1: 'Avg: 0.50\nMin: 0\nMax: 0.99', col2: createRandomSeq(80), col3: createRandomSeq(100)});
            x += 1;
        }
        return d;
    }());
    function getData(fill) {
        var a, x = grid.scrollIndexRect.top;
        while (x < grid.scrollIndexRect.bottom + 2) {
            if (fill || grid.isCellVisible(1, x)) {
                a = grid.data[x].col2;
                a.shift();
                a.push(Math.random());
                a = grid.data[x].col3;
                a.shift();
                a.push(Math.random());
            }
            x += 1;
        }
        grid.draw();
        pollData();
    }
    function pollData() {
        setTimeout(getData, 50);
    }
    getData(true);
});