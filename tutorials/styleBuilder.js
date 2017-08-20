/*jslint browser: true, unparam: true, evil: true*/
/*globals Event: true, canvasDatagrid: false, ace: false, requestAnimationFrame: false, alert: false */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    var shortStyle = {
            name: "New Style",
            accent: "#DC3522",
            text: "#D9CB9E",
            select: "#374140",
            cell: "#2A2C2B",
            background: "#1E1E20"
        },
        container = document.createElement('div'),
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
        newButton = document.createElement('button'),
        saveButton = document.createElement('button'),
        deleteButton = document.createElement('button'),
        styleLibSelect = document.createElement('select'),
        help = document.createElement('button'),
        titleCanvas = document.createElement('canvas'),
        ctx = titleCanvas.getContext('2d'),
        code,
        table = document.createElement('table'),
        sLength = Object.keys(grid.style).length,
        colorInputs = {},
        fontSize = 60,
        titleCanvasHeight = 75,
        titleCanvasWidth = 430,
        storageKey = 'canvas-datagrid-user-style-library',
        tdls = {},
        inputs = {};
    function createDialog() {
        var modal = document.createElement('div'),
            dialog = document.createElement('div'),
            message = document.createElement('div'),
            body = document.createElement('div'),
            cancelButton = document.createElement('button'),
            okButton = document.createElement('button');
        modal.className = 'style-maker-modal';
        dialog.className = 'style-maker-dialog';
        okButton.innerHTML = 'Ok';
        cancelButton.innerHTML = 'Cancel';
        dialog.appendChild(message);
        dialog.appendChild(body);
        dialog.appendChild(cancelButton);
        dialog.appendChild(okButton);
        modal.appendChild(dialog);
        cancelButton.onclick = function () {
            document.body.removeChild(modal);
        };
        document.body.appendChild(modal);
        dialog.body = body;
        dialog.okButton = okButton;
        dialog.cancelButton = cancelButton;
        dialog.modal = modal;
        dialog.message = message;
        dialog.close = function () {
            modal.remove();
        };
        [message, modal, cancelButton, okButton, body, dialog, modal].forEach(function (el) {
            el.remove = function () {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
                return dialog;
            };
        });
        return dialog;
    }
    function showHelp() {
        var dialog = createDialog();
        dialog.okButton.onclick = dialog.close;
        dialog.cancelButton.remove();
        dialog.message.className = 'style-maker-help-message';
        dialog.message.innerHTML =
            '<h1>Canvas Datagrid Style Builder</h1>'
            + '<h2>Selecting Colors</h2>'
            + '<p>You can select colors by clicking on elements in the grid, or '
            + 'selecting them from the style property list.  Hovering over '
            + 'elements in the grid will highlight them in the property list'
            + ' and vice versa.  Some elements cannot be hovered/clicked on, '
            + 'for example activeCellBorder.  You\'ll need to select these colors'
            + ' from the property list manually.  Some elements cannot be seen in the '
            + 'example, such as cellHoverColor.  You\'ll need to interact with the sample '
            + 'grid to see the color after setting it.  If you cannot see a color '
            + 'in the example grid even after interacting with the grid, please report it as a bug.</p>'
            + '<h2>Creating, saving, importing, exporting, and deleting </h2>'
            + '<p>You can create new styles by clicking "New..." and selecting a 5 color style and clicking the "Create Style" button.</p>'
            + '<p>You can save your styles.  They will be saved to your browser\'s local store'
            + ' and will be available to other canvas datagrid instances you encounter'
            + ' with with this browser.  You cannot overwrite default styles.</p>'
            + '<p>You can export your styles by clicking the "Export To Clipboard" button.'
            + '  The style will be saved to your clipboard as JSON text.</p>'
            + '<p>You can import your styles as JSON.  You cannot overwrite default styles.  '
            + 'Click "Import..." and paste'
            + ' your JSON style in the text area then click the "Import" button.'
            + '  You can import full styles, or truncated 5 color styles.  You can see'
            + ' the truncated style format by clicking the import button.  You can see'
            + ' the full style format by clicking the "Export To Clipboard" button.</p>'
            + '<p>You can delete styles by selecting them in the drop down menu, then clicking delete.'
            + '  You can only delete styles that you have saved.  You cannot delete default styles.</p>';
    }
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
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, titleCanvas.width, 300);
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
            var ignoreKey = key.indexOf('FontFamilyHeight') !== -1;
            if (ignoreKey) { return s; }
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
    function pickColor(getColor, onchange) {
        return function () {
            var v = getColor(), i = document.createElement('input');
            function c() { onchange(i); }
            i.value = v;
            i.type = 'color';
            i.style.position = 'absolute';
            i.style.top = '-100px';
            i.style.left = '-100px';
            document.body.appendChild(i);
            i.focus();
            if (/rgb/.test(v)) {
                i.value = rgbToHex(v);
            } else {
                i.value = v;
            }
            i.addEventListener('input', c);
            i.addEventListener('change', c);
            i.click();
        };
    }
    function fillStyle(el) {
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
            a = e.cell.active ? 'active' : '',
            aKey = a + s + 'BackgroundColor',
            cKey = a + s + 'Color',
            oKey = a + s + 'BorderColor';
        //TODO: add a lot more logic in here in selecting the relevant styles on click
        e.preventDefault();
        if (!s || /tree-grid/.test(e.cell.style)) { return; }
        clearPropHighlight();
        selectedKey = aKey;
        if (/resize/.test(e.cell.dragContext)) {
            selectedKey = oKey;
        }
        if (e.cell.isRowHeader) {
            if (e.cell.text && e.x - e.cell.x - e.cell.text.width - (this.style.treeArrowWidth / 2) < 0) {
                selectedKey = 'treeArrowColor';
            }
        }
        if (e.cell.text && e.x - e.cell.x - e.cell.text.width + (e.cell.isRowHeader ? this.style.treeArrowWidth / 2 : 0) < 0) {
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
        if (!tdls[selectedKey]) { return; }
        tdls[selectedKey].classList.add('style-maker-prop-highlight');
    }
    function focusStyleInput(e) {
        if (!inputs[selectedKey]) { return; }
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
        grid.selectArea({top: 11, left: 1, right: 2, bottom: 13}, true);
        grid.addEventListener('mousemove', selectStyleInput);
        grid.addEventListener('click', focusStyleInput);
        // prevent our friend from talking us down from the ledge
        grid.addEventListener('mousedown', preventDefault);
        grid.addEventListener('mouseup', preventDefault);
    }
    function getStyleFromShortStyle(style) {
        // if this is a 5 or 6 key template, use template sea wolf replace
        var t = JSON.parse(JSON.stringify(window.defaultStyleLibrary['sea wolf']));
        Object.keys(t).forEach(function (key) {
            if (t[key] && t[key].replace) {
                t[key] = t[key]
                    .replace(/#DC3522/i, style.accent)
                    .replace(/#D9CB9E/i, style.text)
                    .replace(/#374140/i, style.select)
                    .replace(/#2A2C2B/i, style.cell)
                    .replace(/#1E1E20/i, style.background);
            }
        });
        return t;
    }
    function createProps(keyReg, negList) {
        return function (key) {
            if ((negList && keyReg.test(key))
                    || (!negList && !keyReg.test(key)) || key.indexOf(('FontFamilyHeight')) !== -1) { return; }
            var tr = document.createElement('tr'),
                tdi = document.createElement('td'),
                tdl = document.createElement('td'),
                tdc = document.createElement('td'),
                input = document.createElement('input'),
                label = document.createElement('label');
            function pickerCallback(i) {
                inputs[key].value = i.value;
                tdc.style.background = i.value;
                apply();
            }
            function getColorKey() {
                return grid.style[key];
            }
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
            input.addEventListener('copy', function (e) {
                e.stopPropagation();
            });
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
                tdl.addEventListener('click', pickColor(getColorKey, pickerCallback));
                tdc.addEventListener('click', pickColor(getColorKey, pickerCallback));
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
        if (Object.keys(window.defaultStyleLibrary).indexOf(inputs.name) !== -1) {
            alert('Cannot overwrite a default style, change style name.');
            return;
        }
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
        fillStyle(styleLibSelect);
        styleLibSelect.value = inputs.name.value;
        drawTitleCanvas();
    };
    deleteButton.onclick = function () {
        if (Object.keys(window.defaultStyleLibrary).indexOf(inputs.name) !== -1) {
            alert('Cannot delete a default style.');
            return;
        }
        if (!window.styleLibrary[styleLibSelect.value]) {
            alert('Style does not exist');
            return;
        }
        delete window.styleLibrary[styleLibSelect.value];
        styleLibSelect.selectedIndex = styleLibSelect.selectedIndex - 1;
        grid.style = window.styleLibrary[styleLibSelect.value];
        localStorage.setItem(storageKey, JSON.stringify(window.styleLibrary));
        fillStyle(styleLibSelect);
        drawTitleCanvas();
        styleLibSelect.value = grid.style.name;
        styleLibSelect.dispatchEvent(new Event('change'));
    };
    loadStyle.onclick = function () {
        var textarea = document.createElement('textarea'),
            dialog = createDialog();
        dialog.message.innerHTML = 'Paste style JSON below, then click Import.';
        dialog.body.appendChild(textarea);
        dialog.okButton.innerHTML = 'Import';
        textarea.value = JSON.stringify(shortStyle, null, '\t');
        textarea.select();
        textarea.className = 'style-maker-import-textarea';
        textarea.addEventListener('copy', function (e) {
            e.stopPropagation();
        });
        dialog.okButton.onclick = function () {
            var style;
            try {
                style = JSON.parse(textarea.value);
            } catch (e) {
                dialog.message.innerHTML = '<span style="color: yellow;">Parse error.  Input must be valid JSON. Check console for specific error.</span>';
                throw e;
            }
            if ([5, 6].indexOf(Object.keys(style).length) !== -1
                    && style.accent !== undefined) {
                // if this is a 5 or 6 key template, use template sea wolf replace
                style = getStyleFromShortStyle({
                    name: style.name || 'New Style'
                });
            }
            dialog.cancelButton.dispatchEvent(new Event('click'));
            Object.keys(grid.style).forEach(function (key) {
                grid.style[key] = style[key] || window.styleLibrary.default[key];
                inputs[key].value = grid.style[key];
            });
            saveButton.dispatchEvent(new Event('click'));
            drawTitleCanvas();
        };
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
    newButton.onclick = function () {
        var sTitle = document.createElement('span'),
            sStyle = {},
            name = document.createElement('input'),
            dialog = createDialog();
        dialog.cancelButton.remove();
        dialog.message.innerHTML = 'To get started, select a name and 5 colors.<br><br>';
        sTitle.innerHTML = 'Name&nbsp;&nbsp;';
        name.value = 'New Style';
        dialog.appendChild(sTitle);
        dialog.appendChild(name);
        dialog.appendChild(document.createElement('br'));
        Object.keys(shortStyle).forEach(function (key) {
            if (key === 'name') { return; }
            var c = document.createElement('div'),
                title = document.createElement('div'),
                cInput = document.createElement('input'),
                cBox = document.createElement('div');
            c.className = 'style-maker-new-color-container';
            title.className = 'style-maker-new-color-title';
            cBox.className = 'style-maker-new-color-box';
            cInput.className = 'style-maker-new-color-input';
            cBox.style.background = shortStyle[key];
            sStyle[key] = shortStyle[key];
            cBox.onclick = pickColor(function () { return cBox.style.backgroundColor; },
                function (i) {
                    cBox.style.backgroundColor = i.value;
                    sStyle[key] = i.value;
                    cInput.value = i.value;
                });
            cInput.value = shortStyle[key];
            title.innerHTML = key;
            c.appendChild(cBox);
            c.appendChild(cInput);
            c.appendChild(title);
            dialog.appendChild(c);
        });
        dialog.appendChild(dialog.cancelButton);
        dialog.appendChild(dialog.okButton);
        dialog.okButton.innerHTML = 'Create Style';
        dialog.okButton.onclick = function () {
            grid.style = getStyleFromShortStyle(sStyle);
            grid.style.name = name.value;
            Object.keys(grid.style).forEach(function (key) {
                if (key.indexOf('FontFamilyHeight') !== -1) { return; }
                inputs[key].value = grid.style[key];
                if (/Color|Style/i.test(key)) {
                    colorInputs[key].style.background = grid.style[key];
                }
            });
            drawTitleCanvas();
            dialog.close();
        };
    };
    function init() {
        container.appendChild(titleCanvas);
        container.appendChild(styleLibSelect);
        container.appendChild(newButton);
        container.appendChild(saveButton);
        container.appendChild(copyCode);
        container.appendChild(loadStyle);
        container.appendChild(deleteButton);
        container.appendChild(help);
        container.appendChild(props);
        help.onclick = showHelp;
        window.styleLibrary.default = code;
        fillStyle(styleLibSelect);
        styleLibSelect.value = 'default';
        Object.keys(grid.style).sort().forEach(createProps(/^name$/));
        Object.keys(grid.style).sort().forEach(createProps(/Color|Style/));
        Object.keys(grid.style).sort().forEach(createProps(/Color|Style|^name$/, true));
        container.className = 'style-maker';
        props.className = 'style-maker-props';
        props.appendChild(table);
        document.body.appendChild(container);
        copyCode.innerHTML = 'Export To Clipboard';
        newButton.innerHTML = 'New...';
        loadStyle.innerHTML = 'Import...';
        saveButton.innerHTML = 'Save';
        deleteButton.innerHTML = 'Delete';
        help.innerHTML = '?';
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
