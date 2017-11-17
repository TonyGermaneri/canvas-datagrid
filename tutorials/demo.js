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
        },
        dataSets = [
            ['Institute of Museum and Library Services - Museum Universe Data File FY 2015 Q3', 'https://data.imls.gov/api/views/ku5e-zr2b/rows.json?accessType=DOWNLOAD'],
            ['Main Libraries, Branches, and Bookmobiles: FY 2014 Public Libraries Survey', 'https://data.imls.gov/api/views/ucdn-7aur/rows.json?accessType=DOWNLOAD'],
            ['NCHS - Leading Causes of Death: United States', 'https://data.cdc.gov/api/views/bi63-dtpu/rows.json?accessType=DOWNLOAD'],
            ['State of Connecticut - SAT School Participation and Performance: 2012-2013', 'https://data.ct.gov/api/views/kbxi-4ia7/rows.json?accessType=DOWNLOAD'],
            ['Nutrition, Physical Activity, and Obesity - Behavioral Risk Factor Surveillance System', 'https://chronicdata.cdc.gov/api/views/hn4x-zwk7/rows.json?accessType=DOWNLOAD'],
            ['City of Los Angeles 2010 Census Populations by Zip Code', 'http://localhost/tutorials/demo.html?q=https://data.lacity.org/api/views/nxs9-385f/rows.json?accessType=DOWNLOAD'],
            ['Youth Tobacco Survey', 'https://chronicdata.cdc.gov/api/views/4juz-x2tp/rows.json?accessType=DOWNLOAD'],
            ['Most Popular Baby Names by Sex and Mother\'s Ethnic Group, New York City', 'https://data.cityofnewyork.us/api/views/25th-nujf/rows.json?accessType=DOWNLOAD'],
            ['Deaths in 122 U.S. cities - 1962-2016. 122 Cities Mortality Reporting System', 'https://data.cdc.gov/api/views/mr8w-325u/rows.json?accessType=DOWNLOAD'],
            ['Nutrition, Physical Activity, and Obesity - National Immunization Survey (Breastfeeding)', 'https://chronicdata.cdc.gov/api/views/8hxn-cvik/rows.json?accessType=DOWNLOAD'],
            ['Nutrition, Physical Activity, and Obesity - Women, Infant, and Child', 'https://chronicdata.cdc.gov/api/views/735e-byxc/rows.json?accessType=DOWNLOAD'],
            ['NYC Social Media Usage', 'https://data.cityofnewyork.us/api/views/5b3a-rs48/rows.json?accessType=DOWNLOAD'],
            ['New York City Leading Causes of Death', 'https://data.cityofnewyork.us/api/views/jb7j-dtam/rows.json?accessType=DOWNLOAD'],
            ['New York State - Index, Violent, Property, and Firearm Rates By County: Beginning 1990', 'https://data.ny.gov/api/views/34dd-6g2j/rows.json?accessType=DOWNLOAD'],
            ['U.S. Chronic Disease Indicators (CDI) (250mb+)', 'https://chronicdata.cdc.gov/api/views/g4ie-h725/rows.json?accessType=DOWNLOAD'],
        ];
    function isNoiseData(name) {
        // get rid of fields that we don't care about
        return ['sid', 'id', 'position', 'created_at',
                    'created_meta', 'updated_at',
                    'updated_meta', 'meta', 'GeoLocation',
                    'LOCATION', 'Location 1', 'Location 2',
                    'Location 3', 'Location 4', 'WEBURL'].indexOf(name) !== -1;
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
    function initGrid() {
        var grid = canvasDatagrid({
                parentNode: document.getElementById('grid'),
                borderDragBehavior: 'move',
                allowMovingSelection: true,
                columnHeaderClickBehavior: 'select',
                allowFreezingRows: true,
                allowFreezingColumns: true,
                allowRowReordering: true,
                tree: false,
                debug: false,
                showPerformance: false
            });
        function loadDataSet(url) {
            var xhr = new XMLHttpRequest();
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
        grid.addEventListener('contextmenu', function (e) {
            e.items.push({
                title: 'More data sets from Data.gov',
                items: dataSets.map(function (u) {
                    return {
                        title: u[0],
                        click: function () {
                            loadDataSet(u[1]);
                        }
                    };
                })
            });
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
            e.items.push({
                title: 'Toggle debugging info',
                click: function () { grid.attributes.debug = !grid.attributes.debug; }
            });
            e.items.push({
                title: 'Toggle performance info',
                click: function () { grid.attributes.showPerformance = !grid.attributes.showPerformance; }
            });
            e.items.push({
                title: 'Get other JSON URLs from Data.gov<br>&nbsp;&nbsp;&nbsp;&nbsp;then set to this page\'s q querystring parameter',
                click: function () { window.open('https://catalog.data.gov/dataset?res_format=JSON&_res_format_limit=0&_bureauCode_limit=0', 'datagov'); }
            });
        });
        if (searchUrl.length > 3) {
            // work encoded or not, for lazy people who can't be bothered encoding stuff
            loadDataSet(/%3A/.test(searchUrl) ? decodeURIComponent(searchUrl) : searchUrl);
        } else {
            loadDataSet('https://data.cityofchicago.org/api/views/xzkq-xp2w/rows.json?accessType=DOWNLOAD');
            // inner join
            // https://data.cityofchicago.org/api/views/pasx-mnuv/rows.json?accessType=DOWNLOAD
        }
    }
    initGrid();
}
if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', demo);
} else {
    setTimeout(function () {
        'use strict';
        demo();
    }, 500);
}
