/*jslint browser: true, unparam: true, evil: true*/
/*globals Event: true, canvasDatagrid: false, ace: false, requestAnimationFrame: false, alert: false */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    var container = document.createElement('div'),
        grid = canvasDatagrid({
            parentNode: document.body,
            tree: true,
            name: 'style-maker'
        }),
        selectedKey,
        cTypes = {},
        props = document.createElement('div'),
        loadStyle = document.createElement('button'),
        copyCode = document.createElement('button'),
        saveButton = document.createElement('button'),
        deleteButton = document.createElement('button'),
        styleLibSelect = document.createElement('select'),
        titleCanvas = document.createElement('canvas'),
        ctx = titleCanvas.getContext('2d'),
        code,
        table = document.createElement('table'),
        sLength = Object.keys(grid.style).length,
        colorInputs = {},
        fontSize = 60,
        titleCanvasHeight = 75,
        titleCanvasWidth = 400,
        storageKey = 'canvas-datagrid-user-style-library',
        tdls = {},
        inputs = {};
    function preventDefault(e) {
        e.preventDefault();
    }
    function getStyleFromInputs() {
        var s = {};
        Object.keys(inputs).forEach(function (key) {
            s[key] = inputs[key].value;
        });
        return s;
    }
    function drawTitleCanvas() {
        var x = 0,
            y = 0,
            bWdith = 3,
            w,
            m,
            l,
            ty,
            fExp = 'px ' + inputs.activeCellFont.value.replace(/\d+px/, ''),
            keys = Object.keys(grid.style).filter(function (key) { return /Color|Style/.test(key); }),
            borders = keys.filter(function (key) { return (/border/i).test(key); }),
            notBorders = keys.filter(function (key) { return !/border/i.test(key); });
        l = ((titleCanvas.width / window.devicePixelRatio) - (borders.length * bWdith)) / notBorders.length;
        keys.forEach(function (key) {
            w = notBorders.indexOf(key) === -1 ? bWdith : l;
            ctx.fillStyle = grid.style[key];
            ctx.fillRect(x, y, w, 300);
            x += w;
        });
        ctx.font = fontSize + fExp;
        m = ctx.measureText(inputs.name.value.trim());
        while (m.width > titleCanvas.width) {
            fontSize -= 1;
            ctx.font = fontSize + fExp;
            m = ctx.measureText(inputs.name.value.trim());
        }
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'black';
        ty = 60;
        ctx.fillText(inputs.name.value, 3, ty);
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = inputs.activeCellSelectedBackgroundColor.value;
        ctx.fillText(inputs.name.value, 3, ty);
    }
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
    function rgbToHex(c) {
        c = c.replace(/rgba?|\)|\(| /g, '').split(',').map(function (i) { return parseInt(i, 10); });
        return "#" + componentToHex(c[0]) + componentToHex(c[1]) + componentToHex(c[2]);
    }
    function apply() {
        code = Object.keys(grid.style).reduce(function (s, key, index) {
            if (typeof grid.style[key] === 'number') {
                s += '    "' + key + '": ' + inputs[key].value;
            } else {
                s += '    "' + key + '": "' + inputs[key].value + '"';
            }
            if (index !== sLength - 1) {
                s += ',\n';
            }
            return s;
        }, '{\n') + '\n}';
        eval('grid.style = ' + code + ';');
        drawTitleCanvas();
        window.styleLibrary[inputs.name.value] = JSON.parse(code);
    }
    function pickColor(key) {
        return function () {
            var tdc = this, i = document.createElement('input');
            i.value = inputs[key].value;
            i.type = 'color';
            i.style.position = 'absolute';
            i.style.top = '-100px';
            i.style.left = '-100px';
            document.body.appendChild(i);
            i.focus();
            if (/rgb/.test(inputs[key].value)) {
                i.value = rgbToHex(inputs[key].value);
            } else {
                i.value = inputs[key].value;
            }
            function a() {
                inputs[key].value = i.value;
                tdc.style.background = i.value;
                apply();
            }
            i.addEventListener('input', a);
            i.addEventListener('change', a);
            i.click();
        };
    }
    function fillStyle() {
        styleLibSelect.innerHTML = '';
        var er, userLib = localStorage.getItem(storageKey);
        try {
            userLib = JSON.parse(userLib);
        } catch (e) {
            er = e;
            userLib = null;
        }
        if (!userLib) {
            if (er) {
                console.error('canvas-datagrid style-maker cannot import user library due to JSON parse error.  See next error message for parse error message.');
                console.error(er);
            }
            userLib = {};
        }
        Object.keys(userLib).forEach(function (key) {
            window.styleLibrary[key] = userLib[key];
        });
        Object.keys(window.styleLibrary).forEach(function (name) {
            var option = document.createElement('option');
            option.innerHTML = name;
            styleLibSelect.appendChild(option);
        });
        Object.keys(window.defaultStyleLibrary).forEach(function (name) {
            var option = document.createElement('option');
            option.innerHTML = name;
            styleLibSelect.appendChild(option);
        });
    }
    function hideStyleItem(key) {
        return function () {
            if (!/Color|Style/i.test(key)) { return; }
            grid.style[key] = inputs[key].value;
            drawTitleCanvas();
        };
    }
    function showStyleItem(key) {
        return function () {
            if (!/Color|Style/i.test(key)) { return; }
            grid.style[key] = '#00FF00';
            drawTitleCanvas();
            grid.draw();
        };
    }
    function clearPropHighlight() {
        Object.keys(inputs).forEach(function (key) {
            tdls[key].classList.remove('style-maker-prop-highlight');
        });
    }
    function selectStyleInput(e) {
        var s = e.cell.selected ? 'cellSelected' : e.cell.style,
            aKey = s + 'BackgroundColor',
            cKey = s + 'Color',
            oKey = s + 'BorderColor';
        //TODO: add a lot more logic in here in selecting the relevant styles on click
        console.log({style: e.cell.style, dragContext: e.cell.dragContext, context: e.cell.context});
        e.preventDefault();
        if (!s || /tree-grid/.test(e.cell.style)) { return; }
        clearPropHighlight();
        selectedKey = aKey;
        if (/resize/.test(e.cell.dragContext)) {
            selectedKey = oKey;
        }
        if (/rowHeader/.test(e.cell.style)) {
            if (e.cell.text && e.x - e.cell.x - e.cell.text.width - (this.style.treeArrowWidth / 2) < 0) {
                selectedKey = 'treeArrowColor';
            }
        }
        if (e.cell.text && e.x - e.cell.x - e.cell.text.width + (/rowHeader/.test(e.cell.style) ? this.style.treeArrowWidth / 2 : 0) < 0) {
            selectedKey = cKey;
        }
        if (/scroll/.test(e.cell.style)) {
            selectedKey = 'scrollBarBackgroundColor';
            if (/scroll-box/.test(e.cell.style)) {
                selectedKey = 'scrollBarBoxBackgroundColor';
            }
            if (/scroll-box-corner/.test(e.cell.style)) {
                selectedKey = 'scrollBarCornerBackgroundColor';
            }
        }
        inputs[selectedKey].focus();
        if (!tdls[selectedKey]) { return; }
        tdls[selectedKey].classList.add('style-maker-prop-highlight');
    }
    function focusStyleInput(e) {
        inputs[selectedKey].focus();
        colorInputs[selectedKey].dispatchEvent(new Event('click'));
        e.preventDefault();
    }
    function setupDemoGrid() {
        function createData(n) {
            var x, data = [], d, i, c,
                r = 'Elend, eam, animal omittam an, has in, explicari principes. Elit, causae eleifend mea cu. No sed adipisci accusata, ei mea everti melius periculis. Ei quot audire pericula mea, qui ubique offendit no. Sint mazim mandamus duo ei. Sumo maiestatis id has, at animal reprehendunt definitionem cum, mei ne adhuc theophrastus.';
            c = r.split(' ').map(function (i) { return i.trim(); });
            r = r.split(',').map(function (i) { return i.trim(); });
            for (x = 0; x < n; x += 1) {
                d = {};
                for (i = 0; i < r.length; i += 1) {
                    d[r[i]] = c[Math.floor(Math.random() * 1000) % (c.length - 1)];
                }
                data.push(d);
            }
            return data.concat(grid.data);
        }
        // add various sorts of data to the grid
        grid.data = createData(20);
        grid.attributes.allowRowResizeFromCell = true;
        grid.attributes.allowColumnResizeFromCell = true;
        grid.addEventListener('expandtree', function (e) {
            e.treeGrid.data = [
                {top: 0, left: 2, right: 8, bottom: 2},
                {top: 0, left: 3, right: 4, bottom: 22},
                {top: 0, left: 43, right: 5, bottom: 2},
                {top: 0, left: 6, right: 7, bottom: 3},
                {top: 0, left: 7, right: 71, bottom: 44}
            ];
            e.treeGrid.addEventListener('click', focusStyleInput);
            e.treeGrid.addEventListener('mousemove', selectStyleInput);
            e.treeGrid.addEventListener('mousedown', preventDefault);
            e.treeGrid.addEventListener('mouseup', preventDefault);
            e.treeGrid.attributes.allowRowResizeFromCell = true;
            e.treeGrid.attributes.allowColumnResizeFromCell = true;
            grid.addEventListener('stylechanged', function () {
                e.treeGrid.style = grid.style;
            });
        });
        // expand and select stuff to show as many colors as possible like a drunken peacock
        grid.expandTree(5);
        grid.selectArea({top: 0, left: 2, right: 8, bottom: 2});
        grid.addEventListener('mousemove', selectStyleInput);
        grid.addEventListener('click', focusStyleInput);
        // prevent our friend from talking us down from the ledge
        grid.addEventListener('mousedown', preventDefault);
        grid.addEventListener('mouseup', preventDefault);
    }
    function createProps(keyReg, negList) {
        return function (key) {
            if ((negList && keyReg.test(key)) || (!negList && !keyReg.test(key))) { return; }
            var tr = document.createElement('tr'),
                tdi = document.createElement('td'),
                tdl = document.createElement('td'),
                tdc = document.createElement('td'),
                input = document.createElement('input'),
                label = document.createElement('label');
            tr.classList.add('style-maker-tr');
            tdl.classList.add('style-maker-tdl');
            tdls[key] = tdl;
            tdl.classList.add('style-maker-tdl');
            tdc.classList.add('style-maker-tdc');
            input.classList.add('style-maker-input');
            input.classList.add('style-maker-input-' + cTypes[key]);
            label.classList.add('style-maker-label');
            label.classList.add('style-maker-label-' + cTypes[key]);
            label.innerHTML = key;
            input.value = grid.style[key];
            input.onchange = apply;
            inputs[key] = input;
            tdl.appendChild(label);
            tdi.appendChild(input);
            tdc.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;';
            tr.appendChild(tdl);
            tr.appendChild(tdi);
            tdl.addEventListener('mouseover', showStyleItem(key));
            tdl.addEventListener('mouseout', hideStyleItem(key));
            input.addEventListener('mouseover', showStyleItem(key));
            input.addEventListener('mouseout', hideStyleItem(key));
            if (/Color|Style/.test(key)) {
                colorInputs[key] = tdc;
                tr.appendChild(tdc);
                tdc.style.background = input.value;
                tdl.addEventListener('click', pickColor(key));
                tdc.addEventListener('click', pickColor(key));
                input.addEventListener('change', function () {
                    tdc.style.background = input.value;
                });
            } else {
                tdl.addEventListener('click', function () { input.focus(); });
            }
            if (key === 'name') {
                input.addEventListener('keyup', drawTitleCanvas);
            }
            table.appendChild(tr);
        };
    }
    styleLibSelect.onchange = function () {
        var l = window.styleLibrary[this.value] || window.defaultStyleLibrary[this.value];
        Object.keys(grid.style).forEach(function (key) {
            if (l && l[key] !== undefined) {
                inputs[key].value = l[key];
                if (colorInputs[key]) {
                    colorInputs[key].style.background = l[key];
                }
            }
        });
        apply();
    };
    saveButton.onclick = function () {
        if (inputs.name.value === 'default') { return; }
        var storedValues;
        try {
            storedValues = JSON.parse(localStorage.getItem(storageKey)) || {};
        } catch (e) {
            console.warn('could not save JSON when reading from local store, local data removed.');
            storedValues = {};
        }
        storedValues[inputs.name.value] = getStyleFromInputs();
        window.styleLibrary = storedValues;
        localStorage.setItem(storageKey, JSON.stringify(storedValues));
        fillStyle();
        styleLibSelect.value = inputs.name.value;
        drawTitleCanvas();
    };
    deleteButton.onclick = function () {
        if (styleLibSelect.value === 'default') { return; }
        delete window.styleLibrary[styleLibSelect.value];
        styleLibSelect.selectedIndex = styleLibSelect.selectedIndex - 1;
        grid.style = window.styleLibrary[styleLibSelect.value];
        localStorage.setItem(storageKey, JSON.stringify(window.styleLibrary));
        fillStyle();
        drawTitleCanvas();
        styleLibSelect.value = grid.style.name;
        styleLibSelect.dispatchEvent(new Event('change'));
    };
    loadStyle.onclick = function () {
        var modal = document.createElement('div'),
            dialog = document.createElement('div'),
            message = document.createElement('div'),
            textarea = document.createElement('textarea'),
            cancelButton = document.createElement('button'),
            importButton = document.createElement('button');
        modal.className = 'style-maker-modal';
        dialog.className = 'style-maker-dialog';
        textarea.className = 'style-maker-import-textarea';
        message.innerHTML = 'Paste style JSON below, then click Import.';
        importButton.innerHTML = 'Import';
        cancelButton.innerHTML = 'Cancel';
        dialog.appendChild(message);
        dialog.appendChild(textarea);
        dialog.appendChild(cancelButton);
        dialog.appendChild(importButton);
        modal.appendChild(dialog);
        cancelButton.onclick = function () {
            document.body.removeChild(modal);
        };
        importButton.onclick = function () {
            var style;
            try {
                style = JSON.parse(textarea.value);
            } catch (e) {
                message.innerHTML = '<span style="color: yellow;">Parse error.  Input must be valid JSON. Check console for specific error.</span>';
                throw e;
            }
            cancelButton.dispatchEvent(new Event('click'));
            Object.keys(grid.style).forEach(function (key) {
                grid.style[key] = style[key] || window.styleLibrary.default[key];
                inputs[key].value = grid.style[key];
            });
            saveButton.dispatchEvent(new Event('click'));
            drawTitleCanvas();
        };
        document.body.appendChild(modal);
    };
    document.addEventListener('copy', function (e) {
        if (!copyCode.clicked) { return; }
        e.clipboardData.setData('text/plain', code);
        e.preventDefault();
    });
    copyCode.onclick = function () {
        copyCode.clicked = true;
        document.execCommand('Copy');
        copyCode.clicked = false;
    };
    function init() {
        container.appendChild(titleCanvas);
        container.appendChild(styleLibSelect);
        container.appendChild(saveButton);
        container.appendChild(copyCode);
        container.appendChild(loadStyle);
        container.appendChild(deleteButton);
        container.appendChild(props);
        window.styleLibrary.default = code;
        fillStyle();
        styleLibSelect.value = 'default';
        Object.keys(grid.style).sort().forEach(createProps(/^name$/));
        Object.keys(grid.style).sort().forEach(createProps(/Color|Style/));
        Object.keys(grid.style).sort().forEach(createProps(/Color|Style|^name$/, true));
        container.className = 'style-maker';
        props.className = 'style-maker-props';
        props.appendChild(table);
        document.body.appendChild(container);
        copyCode.innerHTML = 'Export To Clipboard';
        loadStyle.innerHTML = 'Import...';
        saveButton.innerHTML = 'Save';
        deleteButton.innerHTML = 'Delete';
        titleCanvas.className = 'style-maker-title';
        titleCanvas.height = titleCanvasHeight * window.devicePixelRatio;
        titleCanvas.width = titleCanvasWidth * window.devicePixelRatio;
        titleCanvas.style.width = titleCanvasWidth + 'px';
        titleCanvas.style.height = titleCanvasHeight + 'px';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        setTimeout(function () {
            grid.childGrids[0].attributes.rowSelectionMode = true;
            grid.childGrids[0].selectArea({top: 0, left: 0, right: 4, bottom: 0});
        }, 50);
        setupDemoGrid();
        apply();
    }
    init();
});
