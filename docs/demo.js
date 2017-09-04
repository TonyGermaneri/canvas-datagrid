/*jslint browser: true*/
/*globals canvasDatagrid: false*/
var data;
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    var searchUrl = window.location.search.substring(3);
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
        document.body.innerHTML = '';
        var xhr = new XMLHttpRequest(),
            grid = canvasDatagrid({
                parentNode: document.body,
                globalRowResize: true,
                scrollPointerLock: true
            });
        xhr.addEventListener('progress', function (e) {
            grid.data = [{ status: 'Loading data: ' + e.loaded + ' of ' + e.total + ' bytes...'}];
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
    }
});
