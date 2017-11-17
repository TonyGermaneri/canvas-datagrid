/*jslint browser: true*/
/*globals canvasDatagrid: false*/
function demo() {
    'use strict';
    var grid, dataCache, scrollDebounce, loadingText = 'Loading...';
    function intializeCache() {
        var x;
        dataCache = [];
        // the API does not return the number of records, but this is apparently the number
        // it's important to set the length of the data correctly
        // to allow the scroll box to be the correct height
        // if not, you can't reach the last record
        // Most APIs provide the total number of records in the set
        // this API does not, so it is hard coded here
        dataCache.length = 156800;
        for (x = 0; x < dataCache.length; x += 1) {
            // create empty "loading..." rows
            dataCache[x] = {
                id: x,
                loaded: false,
                category: loadingText,
                question: loadingText,
                answer: loadingText,
                value: 0,
                airdate: 0
            };
        }
        // set the stub data to the grid.  We'll mutate the data later as pages load
        grid.data = dataCache;
        // adjust the schema based on the key indexes
        // defined above (id, loaded, category, etc..) so it looks nice
        grid.schema[0].hidden = true;
        grid.schema[1].hidden = true;
        grid.schema[2].width = 150;
        grid.schema[3].width = 700;
        grid.schema[4].width = 250;
        grid.schema[5].width = 75;
        grid.schema[6].width = 100;
        // set the type of the number and date columns for good form
        // if this was a sortable table this would actually matter
        grid.schema[5].type = 'number';
        // we will use the date type to bind this column to a formatting function later
        grid.schema[6].type = 'date';
    }
    function updateLocalCache(data, offset) {
        var d, x;
        // merge data from remote into local cache data
        for (x = 0; x < data.length; x += 1) {
            d = dataCache[x + offset];
            d.loaded = true;
            d.category = data[x].category.title;
            d.question = data[x].question;
            d.answer = data[x].answer;
            d.value = data[x].value || 0;
            d.airdate = data[x].airdate;
        }
        // the grid cannot detect when the data has changed
        // so draw is called after data update
        grid.draw();
    }
    function dataAdapter(offset, rows, callback) {
        // THANKS TO http://jservice.io for providing this free service!!
        var url, xhr = new XMLHttpRequest();
        // bind an event to change the cursor to let the user know it's loading
        xhr.addEventListener('progress', function () {
            document.body.style.cursor = 'wait';
        });
        // onload, parse the object, change the cursor back and call the callback (updateLocalCache)
        xhr.addEventListener('load', function () {
            var data = JSON.parse(this.responseText);
            document.body.style.cursor = 'auto';
            callback(data, offset, rows);
        });
        // rows is not used by this API, other APIs usually define some sort of records per page
        url = 'https://jservice.io/api/clues?offset=:offset'
            .replace(':offset', offset)
            .replace(':rows', rows);
        xhr.open('GET', url);
        xhr.send();
    }
    // instantiate the grid 
    grid = canvasDatagrid();
    // format dates so they are easy to read
    // grid.formatters.<type> determine how data
    // of a certain type is formatted as it is drawn
    grid.formatters.date = function (e) {
        if (!e.value) { return ''; }
        var d = new Date(e.value);
        return d.getMonth() + '/' + d.getDay() + '/' + d.getFullYear();
    };
    // API does not support filtering, so remove the option from the context menu;
    grid.attributes.showFilter = false;
    // stick the grid in the <div id="grid"> element defined in the HTML doc
    document.getElementById('grid').appendChild(grid);
    // warn people reordering does not work in this free sample API
    // (but if it did, you could implement it here)
    grid.addEventListener('click', function (e) {
        if (e.cell.rowIndex === -1 && e.cell.columnIndex > -1) {
            alert('The free jservice.io API does not support ordering or filtering');
            e.preventDefault();
        }
    });
    // attach a scroll event to the grid, will fire when the scroll box changes
    grid.addEventListener('scroll', function () {
        // ensure we don't overwhelm the API with requests from quickly scrolling
        clearTimeout(scrollDebounce);
        scrollDebounce = setTimeout(function () {
            // check what part of the virtual canvas is visible by using grid.scrollIndexRect
            // then check the records in that set to see if they need to be fetched or if they
            // are already in the cache
            if (grid.data.filter(function (d, i) {
                    return i > grid.scrollIndexRect.top && i < grid.scrollIndexRect.bottom && d.loaded === false;
                }).length > 0) {
                var offset = grid.scrollIndexRect.top,
                    rows = grid.scrollIndexRect.bottom - grid.scrollIndexRect.top;
                dataAdapter(offset, rows, updateLocalCache);
            }
        }, 300);
    });
    // create rows of empty data the size of the data to later stick data into
    intializeCache();
    // grab the first page
    dataAdapter(0, 100, updateLocalCache);
}
document.addEventListener('DOMContentLoaded', demo);
