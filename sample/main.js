/*jslint browser: true, unparam: true*/
/*globals canvasDatagrid: false */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    // function for creating sample data (ignore this)
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
    // beginning of the sample page
    var parentNode,
        grid,
        sampleData,
        rows = 1000,
        schema;
    // create sample data.  Argument passed here is the number of sample rows to generate
    sampleData = createRandomSampleData(rows);
    // create a sample schema by looking at the sample data headers
    schema = Object.keys(sampleData[0]).map(function (col) {
        return {
            // hide one of the columns
            hidden: /causae/.test(col),
            // name the columns to link them to the data.  you can use `col.title` to show a human readable value.
            name: col,
            // set the default value of new rows that are added to the data, this can be a function or string.
            defaultValue: function (header) {
                return Date.now();
            }
        };
    });
    // create a node to add the grid to
    parentNode = document.createElement('div');
    // give it some arbitrary css width, any will work, including the defaults
    parentNode.style.width = '90%';
    // add it to the body
    document.body.appendChild(parentNode);
    // make the body look dark and brooding
    document.body.style.background = 'black';
    // add some space around the sides to show this object can play nicely on a real web page.
    document.body.style.padding = '7px 0 50px 7px';
    // set the height of the object relative to the height of the window
    function resize() {
        parentNode.style.height = window.innerHeight - 100 + 'px';
    }
    resize();
    // bind setting the height to the window's resize event
    window.addEventListener('resize', resize);
    // create grid
    grid = canvasDatagrid({
        // shows the arrows to the top left of the row numbers, allows the user to dispatch the expandtree event with a click
        tree: true,
        // name of this specific instance, optional, used to store size preferences in the browser's local store.
        name: 'sample',
        // the node to add this grid to
        parentNode: parentNode,
        
    });
    // set the data, this can be done during instantiation as well
    grid.data = sampleData;
    // set the schema, this is optional, but allows you to describe how you want your data edited, ordered, filtered, etc..
    grid.schema = schema;
    // set the default width of a column in the schema
    grid.schema[0].width = 400;
    // set the values of the data.  Setting values this way will not redraw the grid, you must call draw() to see changes.
    function setWelcomeMessage() {
        grid.data[0].Elend = 'Welcome to canvas-dataGrid samples!';
        grid.data[1].Elend = 'View the source of this page to see';
        grid.data[2].Elend = 'how the cells and context menus were altered';
        grid.data[3].Elend = 'in this example.';
        grid.data[0].eam = 'Click here to toggle a grid in a cell';
        grid.data[1].eam = 'Click here to toggle a grid in a row';
        grid.data[2].eam = 'Click here to toggle debug info';
        grid.data[3].eam = 'Click here to toggle performance info';
        grid.data[4].eam = 'Click here to add 10000 rows at ' + rows + ' rows now';
    }
    setWelcomeMessage();
    // change the appearance of cells based on their values
    grid.addEventListener('rendercell', function (ctx, cell) {
        if (cell.selected || cell.active) { return; }
        if (cell.header.name === 'Elit' && cell.style !== 'headerCell') {
            ctx.fillStyle = 'lightgreen';
        }
        if (cell.rowIndex === 1 && cell.columnIndex === 2) {
            ctx.fillStyle = 'lightyellow';
        }
        if (cell.rowIndex === 2 && cell.columnIndex === 2) {
            ctx.strokeStyle = 'red';
        }
        if (/Elend/.test(cell.value) && cell.style !== 'headerCell') {
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'pink';
        }
    });
    // when the expand tree button is clicked this function runs
    function expandTree(grid, data, rowIndex) {
        // this is the data for the inner grid
        grid.data = createRandomSampleData(1000);
        grid.attributes.tree = true;
        // give this inner grid the same expand tree function allowing for infinite trees in the demo
        grid.addEventListener('expandtree', expandTree);
    }
    // bind the above function
    grid.addEventListener('expandtree', expandTree);
    // check what was clicked on, change the contents of cells, expand trees, set cell grids
    grid.addEventListener('click', function (e, cell, menuItems, menuElement) {
        grid.data[4].Elend = 'Clicked value -> ' + (typeof cell.value === 'string' ? cell.value : 'Object');
        grid.draw();
        if (/toggle a grid in a cell/.test(cell.value)) {
            if (Array.isArray(grid.data[6][grid.schema[0].name])) {
                grid.data[6][grid.schema[0].name] = 'blah';
            } else {
                grid.data[6][grid.schema[0].name] = createRandomSampleData(1000);
            }
            grid.draw();
        } else if (/toggle a grid in a row/.test(cell.value)) {
            grid.toggleTree(1);
        } else if (/toggle debug info/.test(cell.value)) {
            grid.attributes.debug = !grid.attributes.debug;
        } else if (/toggle performance info/.test(cell.value)) {
            grid.attributes.showPerformance = !grid.attributes.showPerformance;
        } else if (/add 10000 rows/.test(cell.value)) {
            rows += 10000;
            grid.data = createRandomSampleData(rows);
            setWelcomeMessage();
        }
    });
    // show information about the selection dimensions
    grid.addEventListener('selectionchanged', function (data, matrix, bounds) {
        console.log(JSON.stringify(bounds));
    });
    // create a sample context menu
    grid.addEventListener('contextmenu', function (e, cell, menuItems, contextMenu) {
        // basic "check the cell the user right clicked on" menu item.
        menuItems.push({
            title: 'Check out ' + cell.value,
            click: function (e) {
                alert('Yup, it\'s ' + cell.value);
            }
        });
        // more complex "interact with the context menu and don't close while I do it" menu item.
        // notice the "checkbox.onclick = function (e) { e.stopPropagation(); };" to prevent the menu from closing on click.
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
    // redraw the grid with the grid.data values that have been changed
    grid.draw();
    // assign this grid instance to the global scope so people can play with it on the console.
    window.grid = grid;
});