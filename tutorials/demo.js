/*jslint browser: true*/
/*globals canvasDatagrid: false*/
var data;
function demo() {
    'use strict';
    var searchUrl = window.location.search.substring(3),
        typeMap = {
            'text': 'string',
            'money': 'number',
            'number': 'number'
        };
    function isNoiseData(name) {
        // get rid of fields that we don't care about
        return ['sid', 'id', 'position', 'created_at',
                    'created_meta', 'updated_at',
                    'updated_meta', 'meta'].indexOf(name) !== -1;
    }
    function parseOpenData(openData) {
        var data, schema = [];
        openData.meta.view.columns.forEach(function (column) {
            if (isNoiseData(column.name)) {
                column.hidden = true;
            }
            column.type = typeMap[column.dataTypeName] || 'string';
            if (/full or part-time/i.test(column.name)) {
                column.enum = [['F', 'F'], ['P', 'P']];
            }
            if (/salary or hourly/i.test(column.name)) {
                column.enum = [['Salary', 'Salary'], ['Hourly', 'Hourly']];
            }
            schema.push(column);
        });
        data = openData.data.map(function (row) {
            var r = {};
            schema.forEach(function (column, index) {
                r[column.name] = row[index];
            });
            return r;
        });
        return {
            data: data,
            schema: schema
        };
    }
    function loadDataSet(url) {
        var xhr = new XMLHttpRequest(),
            grid = canvasDatagrid({
                parentNode: document.getElementById('grid'),
                borderDragBehavior: 'move',
                allowMovingSelection: true,
                columnHeaderClickBehavior: 'select',
                allowFreezingRows: true,
                allowFreezingColumns: true,
                allowRowReordering: true,
                tree: false,
                debug: false
            });
        grid.addEventListener('contextmenu', function (e) {
            e.items.push({
                title: 'View page source',
                click: function () { window.open('https://github.com/TonyGermaneri/canvas-datagrid/blob/master/tutorials/demo.html', 'src'); }
            });
            e.items.push({
                title: 'View JS module',
                click: function () { window.open('https://github.com/TonyGermaneri/canvas-datagrid/blob/master/tutorials/demo.js', 'src'); }
            });
            e.items.push({
                title: 'Go to main canvas-datagrid GitHub page',
                click: function () { window.open('https://github.com/TonyGermaneri/canvas-datagrid', 'src'); }
            });
        });
        xhr.addEventListener('progress', function (e) {
            grid.data = [{ status: 'Loading data: ' + e.loaded + ' of ' + (e.total || 'unknown') + ' bytes...'}];
        });
        xhr.addEventListener('load', function (e) {
            grid.data = [{ status: 'Loading data ' + e.loaded + '...'}];
            var openData = parseOpenData(JSON.parse(this.responseText));
            grid.schema = openData.schema;
            grid.data = openData.data;
        });
        xhr.open('GET', url);
        xhr.send();
    }
    if (searchUrl.length > 3) {
        // work encoded or not, for lazy people who can't be bothered encoding stuff
        loadDataSet(/%3A/.test(searchUrl) ? decodeURIComponent(searchUrl) : searchUrl);
    } else {
        loadDataSet('https://data.cityofchicago.org/api/views/xzkq-xp2w/rows.json?accessType=DOWNLOAD');
        // inner join
        // https://data.cityofchicago.org/api/views/pasx-mnuv/rows.json?accessType=DOWNLOAD
    }
}
if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', demo);
} else {
    setTimeout(function () {
        'use strict';
        demo();
    }, 500);
}
