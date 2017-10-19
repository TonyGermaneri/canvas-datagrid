/*jslint browser: true*/
/*globals canvasDatagrid: false*/
/* this file is for developing in a sandbox on a local machine */
function g() {
    'use strict';
    // var grid = document.createElement('canvas-datagrid');
    // document.body.appendChild(grid);
    // localStorage.setItem('canvasDataGrid-blah', '{"sizes":{"rows":{},"columns":{"cornerCell":67.6953125,"localUrl":124.44444444599999}},"orders":{"rows":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549,550,551,552,553,554,555,556,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,575,576,577,578,579,580,581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,596,597,598,599,600,601,602,603,604,605,606,607,608,609,610,611,612,613,614,615,616,617,618,619,620,621,622,623,624,625,626,627,628,629,630,631,632,633,634,635,636,637,638,639,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,710,711,712,713,714,715,716,717,718,719,720,721,722],"columns":[1,0,2,4,3,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]},"orderBy":"_canvasDataGridUniqueId","orderDirection":"asc"}');
    // function plotSparklineChart(cell, ctx) {
    //     if (!cell.value) { return; }
    //     var g,
    //         gb,
    //         x = 0,
    //         m = Math.max.apply(null, cell.value),
    //         a = cell.value.reduce(function (ac, c) { return ac + c; }, 0) / cell.value.length,
    //         i = Math.min.apply(null, cell.value),
    //         w = cell.width / cell.value.length,
    //         r = cell.height / (m - (m * 0.1));
    //     function line(n, c) {
    //         ctx.beginPath();
    //         ctx.lineWidth = 1;
    //         ctx.strokeStyle = c;
    //         ctx.moveTo(cell.x, cell.y + (n * r));
    //         ctx.lineTo(cell.x + cell.width, cell.y + (n * r));
    //         ctx.stroke();
    //     }
    //     ctx.save();
    //     gb = ctx.createLinearGradient((cell.x + cell.width) / 2, cell.y, (cell.x + cell.width) / 2, cell.y + cell.height);
    //     gb.addColorStop(0, a > 0.5 ? '#0C4B73' : '#A1680F');
    //     gb.addColorStop(1, (cell.selected || cell.active) ? '#B3C3CC' : '#041724');
    //     ctx.fillStyle = gb;
    //     ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
    //     ctx.beginPath();
    //     ctx.moveTo(cell.x, cell.y + cell.height);
    //     cell.value.forEach(function (d) {
    //         var cx = cell.x + w + x,
    //             cy = cell.y + (d * r);
    //         ctx.lineTo(cx, cy);
    //         if (d === i || d === m) {
    //             ctx.fillStyle = d === m ? 'green' : 'red';
    //             ctx.fillRect(cx - 2, cy - 2, 5, 5);
    //         }
    //         x += w;
    //     });
    //     ctx.lineTo(cell.x + cell.width, cell.y + cell.height);
    //     g = ctx.createLinearGradient((cell.x + cell.width) / 2, cell.y, (cell.x + cell.width) / 2, cell.y + cell.height);
    //     g.addColorStop(0, '#0F5C8C');
    //     g.addColorStop(1, '#499ABA');
    //     ctx.fillStyle = g;
    //     ctx.fill();
    //     ctx.strokeStyle = '#0B466B';
    //     ctx.stroke();
    //     line(a, a > 0.5 ? 'green' : 'red');
    //     cell.parentGrid.data[cell.rowIndex].col1 = 'Avg:' + a.toFixed(2) + '\nMin: ' + i.toFixed(2) + '\nMax: ' + m.toFixed(2);
    //     ctx.restore();
    // }
    // function createRandomSeq(size, r) {
    //     r = r || [];
    //     while (r.length < size) {
    //         r.push(Math.random());
    //     }
    //     return r;
    // }
    // // create a new grid
    // var grid = canvasDatagrid({
    //     parentNode: document.body,
    //     schema: [
    //         {name: 'col1', width: 220},
    //         {name: 'col2', width: 150},
    //         {name: 'col3', width: 300}
    //     ]
    // });
    // grid.addEventListener('beforerendercell', function (e) {
    //     if (/col2|col3/.test(e.header.name) && !e.cell.isHeader) {
    //         e.cell.isGrid = false;
    //     }
    // });
    // grid.addEventListener('rendertext', function (e) {
    //     if (/col2|col3/.test(e.header.name) && !e.cell.isHeader) {
    //         e.preventDefault();
    //     }
    //     if (!e.cell.isHeader && e.cell.value && e.cell.value.substring) {
    //         e.ctx.fillStyle = parseFloat(e.cell.value.substring(4), 10) > 0.5 ? '#A1230F' : '#499A3D';
    //     }
    // });
    // grid.addEventListener('afterrendercell', function (e) {
    //     if (/col2|col3/.test(e.header.name) && !e.cell.isHeader) {
    //         plotSparklineChart(e.cell, e.ctx);
    //         e.preventDefault();
    //     }
    // });
    // grid.data = function () {
    //     var d = [], x = 0;
    //     while (x < 2000) {
    //         d.push({col1: '', col2: createRandomSeq(80), col3: createRandomSeq(100)});
    //         x += 1;
    //     }
    //     return d;
    // };
    // function getData(fill) {
    //     var a, x = grid.scrollIndexRect.top;
    //     while (x < grid.scrollIndexRect.bottom + 2) {
    //         if (fill || grid.isCellVisible(1, x)) {
    //             a = grid.data[x].col2;
    //             a.shift();
    //             a.push(Math.random());
    //             a = grid.data[x].col3;
    //             a.shift();
    //             a.push(Math.random());
    //         }
    //         x += 1;
    //     }
    //     grid.draw();
    //     pollData();
    // }
    // function pollData() {
    //     setTimeout(getData, 1000);
    // }
    // getData(true);





    // var grid = canvasDatagrid({parentNode: document.getElementById('grid')});
    // grid.attributes.debug = true;
    // grid.data = dat;
    // function dat() {
    //     var x,
    //         data = [],
    //         d,
    //         i,
    //         c,
    //         r = 'Elend, eam, animal omittam an, has in, explicari principes. Elit, causae eleifend mea cu. No sed adipisci accusata, ei mea everti melius periculis. Ei quot audire pericula mea, qui ubique offendit no. Sint mazim mandamus duo ei. Sumo maiestatis id has, at animal reprehendunt definitionem cum, mei ne adhuc theophrastus.';
    //     c = r.split(' ').map(function (i) { return i.trim(); });
    //     r = r.split(',').map(function (i) { return i.trim(); });
    //     for (x = 0; x < 10000; x += 1) {
    //         d = {};
    //         for (i = 0; i < r.length; i += 1) {
    //             d[r[i]] = c[Math.floor(Math.random() * 1000) % (c.length - 1)];
    //         }
    //         data.push(d);
    //     }
    //     return data;
    // }
    // grid.addEventListener('expandtree', function (e) {
    //     e.treeGrid.data = dat();
    // });
    // // // add the data to the grid
    // grid.data = dat();
    // grid.addEventListener('expandtree', function (e) {
    //     e.treeGrid.data = [{a: 'b', c: 'd', e: 'f', g: 'h'}];
    // });
    // grid.data = [{a: 'b', c: 'd', e: 'f', g: 'h'}];
    // grid.data = [
    //     {a: 'a', b: [{c: 'd'}]},
    //     {a: 'a', b: [{c: [
    //         {a: 'a', b: [{c: 'd'}]},
    //         {a: 'a', b: [{c: 'd'}]},
    //     ]}]},
    // ];
    // grid.data = [
    //     {'a': 0, 'b': 1, 'c': 2},
    //     {'a': 4, 'b': {'a': 0, 'b': 1, 'c': 2}, 'c': 6},
    //     {'a': 7, 'b': 8, 'c': 9}
    // ];
    // grid.addEventListener('expandtree', function (e) {
    //     e.treeGrid.data = [
    //         {'a': 0, 'b': 1, 'c': 2},
    //         {'a': 4, 'b': {'a': 0, 'b': 1, 'c': 2}, 'c': 6},
    //         {'a': 7, 'b': 8, 'c': 9}
    //     ];
    // });
    //grid.data = [null, "32.84057112200048", "-86.63186076199969", null, false];





    // create a spreadsheet
    var grid = canvasDatagrid({
            borderDragBehavior: 'move',
            showPaste: true,
            parentNode: document.getElementById('grid'),
            allowRowReordering: true,
            scrollPointerLock: false,
            snapToRow: false,
            debug: true,
            showPerformance: true,
            allowFreezingRows: true,
            tree: false,
            allowFreezingColumns: true
        }),
        x,
        y,
        d = [],
        n;
    grid.style.columnWidth = 70;
    function colName(n) {
        var ordA = 'a'.charCodeAt(0),
            ordZ = 'z'.charCodeAt(0),
            len = ordZ - ordA + 1,
            s = '';
        while (n >= 0) {
            s = String.fromCharCode(n % len + ordA) + s;
            n = Math.floor(n / len) - 1;
        }
        return s;
    }
    for (x = 0; x < 10000; x += 1) {
        d[x] = {};
        for (y = 0; y < 60; y += 1) {
            n = colName(y).toUpperCase();
            d[x][n] = (x + 1) + ', ' + n;
        }
    }
    grid.attributes.columnHeaderClickBehavior = 'select';
    grid.style.columnHeaderCellHorizontalAlignment = 'center';
    grid.data = d;




    // var grid = canvasDatagrid({
    //     parentNode: document.getElementById('grid'),
    //     data: [
    //         {col1: 'foo', col2: 0, col3: 'a'},
    //         {col1: 'bar', col2: 1, col3: 'b'},
    //         {col1: 'baz', col2: 2, col3: 'c'}
    //     ]
    // });
    // grid.addEventListener('contextmenu', function (e) {
    //     e.items.push({
    //         title: 'Top level item',
    //         items: [
    //             {
    //                 title: 'Child item #1',
    //                 click: function (ev) {
    //                     grid.data[0].col1 = e.cell.value;
    //                     grid.draw();
    //                 }
    //             },
    //             {
    //                 title: 'Child item #2',
    //                 click: function (ev) {
    //                     grid.data[0].col1 = e.cell.value;
    //                     grid.draw();
    //                 }
    //             }
    //         ]
    //     });
    //     e.items.push({
    //         title: 'You have '
    //             + grid.selectedRows.filter(function (row) { return !!row; }).length
    //             + ' rows selected'
    //     });
    // });


    // function smallData() {
    //     return [
    //         {col1: 'foo', col2: 0, col3: 'a'},
    //         {col1: 'bar', col2: 1, col3: 'b'},
    //         {col1: 'baz', col2: 2, col3: 'c'}
    //     ];
    // }
    // var grid = canvasDatagrid({
    //     parentNode:  document.getElementById('grid'),
    //     data: smallData(),
    //     tree: true
    // });

}