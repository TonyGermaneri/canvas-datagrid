/*jslint browser: true*/
/*globals canvasDatagrid: false*/

function demo() {
    'use strict';
    var grid, dataCache, scrollDebounce, loadingText = '\u21BB\u21BB\u21BB\u21BB\u21BB\u21BB\u21BB';
    function updateLocalCache(data, offset) {
        var d, x;
        if (dataCache === undefined) {
            dataCache = [];
            dataCache.length = 156800;
            for (x = 0; x < dataCache.length; x += 1) {
                dataCache[x] = {
                    id: x,
                    loaded: false,
                    question: loadingText,
                    answer: loadingText,
                    value: 0,
                    airDate: 0
                };
            }
            grid.data = dataCache;
            grid.schema[0].hidden = true;
            grid.schema[1].hidden = true;
        }
        for (x = 0; x < data.length; x += 1) {
            d = dataCache[x + offset];
            d.loaded = true;
            d.question = data[x].question;
            d.answer = data[x].answer;
            d.value = data[x].value;
            d.airDate = data[x].airDate;
        }
        grid.draw();
    }
    function dataAdapter(offset, rows, callback) {
        var url, xhr = new XMLHttpRequest();
        xhr.addEventListener('progress', function () {
            document.body.style.cursor = 'wait';
        });
        xhr.addEventListener('load', function () {
            var data = JSON.parse(this.responseText);
            document.body.style.cursor = 'auto';
            callback(data, offset, rows);
        });
        url = 'http://jservice.io/api/clues?offset=:offset'
            .replace(':offset', offset)
            .replace(':rows', rows);
        xhr.open('GET', url);
        xhr.send();
    }
    grid = canvasDatagrid({
        parentNode: document.getElementById('grid')
    });
    grid.addEventListener('scroll', function () {
        clearTimeout(scrollDebounce);
        scrollDebounce = setTimeout(function () {
            if (grid.data.filter(function (d, i) {
                    // grid.scrollIndexRect = {top: 111, right: 5, bottom: 146, left: 0}
                    return i > grid.scrollIndexRect.top && i < grid.scrollIndexRect.bottom && d.loaded === false;
                }).length > 0) {
                var offset = grid.scrollIndexRect.top,
                    rows = grid.scrollIndexRect.bottom - grid.scrollIndexRect.top;
                dataAdapter(offset, rows, updateLocalCache);
            }
        }, 300);
    });
    dataAdapter(0, 100, updateLocalCache);
}
document.addEventListener('DOMContentLoaded', demo);
