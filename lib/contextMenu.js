/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([], function () {
    'use strict';
    return function (self) {
        self.contextmenu = function (e, overridePos) {
            if (!self.hasFocus) {
                return;
            }
            if (self.contextMenu) {
                e.preventDefault();
                return self.disposeContextMenu();
            }
            var oPreventDefault = e.preventDefault,
                pos,
                loc = {},
                contextObject,
                filterContainer,
                filterLabel,
                filterInput,
                columnFilter,
                menuItems;
            pos = overridePos || self.getLayerPos(e);
            contextObject = self.getCellAt(pos.x, pos.y);
            if (contextObject.grid !== undefined) {
                return;
            }
            if (!contextObject.header) { e.preventDefault(); return; }
            columnFilter = self.columnFilters[contextObject.header.name] || '';
            filterContainer = document.createElement('div');
            filterLabel = document.createElement('div');
            filterLabel.className = 'canvas-datagrid-context-menu-label';
            filterInput = document.createElement('input');
            filterLabel.innerHTML = self.attributes.filterOptionText + ' ' + contextObject.header.name;
            filterContainer.appendChild(filterLabel);
            filterContainer.appendChild(filterInput);
            self.contextMenu = document.createElement('div');
            self.contextMenu.className = 'canvas-datagrid-context-menu';
            self.contextMenu.style.cursor = 'pointer';
            self.contextMenu.style.position = 'absolute';
            self.contextMenu.style.zIndex = '3';
            filterInput.value = columnFilter;
            menuItems = [];
            if (self.attributes.showFilter) {
                menuItems.push({
                    title: filterContainer
                });
                if (Object.keys(self.columnFilters).length) {
                    Object.keys(self.columnFilters).forEach(function (cf) {
                        menuItems.push({
                            title: self.attributes.removeFilterOptionText.replace(/%s/g, cf),
                            click: function removeFilterClick() {
                                e.preventDefault();
                                self.setFilter(cf, '');
                                self.disposeContextMenu();
                                self.controlInput.focus();
                            }
                        });
                    });
                }
            }
            if (self.attributes.showCopy
                    && self.selections.reduce(function (p, r) {
                        return p + r.length;
                    }, 0) > 0) {
                menuItems.push({
                    title: self.attributes.copyText,
                    click: function () {
                        document.execCommand('copy');
                        self.disposeContextMenu();
                        self.controlInput.focus();
                    }
                });
            }
            if (self.attributes.saveAppearance && self.attributes.showClearSettingsOption
                    && (Object.keys(self.sizes.rows).length > 0
                        || Object.keys(self.sizes.columns).length > 0)) {
                menuItems.push({
                    title: self.attributes.clearSettingsOptionText,
                    click: function (e) {
                        e.preventDefault();
                        self.sizes.rows = {};
                        self.sizes.columns = {};
                        self.createRowOrders();
                        self.createColumnOrders();
                        self.storedSettings = undefined;
                        self.dispatchEvent('resizecolumn', {columnWidth: self.style.columnWidth});
                        self.dispatchEvent('resizerow', {cellHeight: self.style.cellHeight});
                        self.setStorageData();
                        self.resize(true);
                        self.disposeContextMenu();
                        self.controlInput.focus();
                    }
                });
            }
            if (self.attributes.allowSorting && self.attributes.showOrderByOption) {
                menuItems.push({
                    title: self.attributes.showOrderByOptionTextAsc.replace('%s', contextObject.header.name),
                    click: function (e) {
                        e.preventDefault();
                        self.order(contextObject.header.name, 'asc');
                        self.disposeContextMenu();
                        self.controlInput.focus();
                    }
                });
                menuItems.push({
                    title: self.attributes.showOrderByOptionTextDesc.replace('%s', contextObject.header.name),
                    click: function (e) {
                        e.preventDefault();
                        self.order(contextObject.header.name, 'desc');
                        self.disposeContextMenu();
                        self.controlInput.focus();
                    }
                });
            }
            if (self.dispatchEvent('contextmenu', {NativeEvent: e, cell: contextObject, items: menuItems, contextMenu: self.contextMenu})) { return; }
            if (!menuItems.length) {
                return;
            }
            menuItems.forEach(function (item) {
                var row = document.createElement('div');
                self.contextMenu.appendChild(row);
                if (typeof item.title === 'string') {
                    row.className = 'canvas-datagrid-context-menu-item';
                    row.innerHTML = item.title;
                } else {
                    row.appendChild(item.title);
                }
                if (item.click) {
                    row.addEventListener('click', function contextClickProxy(e) {
                        item.click.apply(this, [e, contextObject, self.disposeContextMenu]);
                        e.preventDefault();
                        e.stopPropagation();
                        self.controlInput.focus();
                    });
                }
            });
            filterInput.addEventListener('dblclick', self.stopPropagation);
            filterInput.addEventListener('click', self.stopPropagation);
            filterInput.addEventListener('mousedown', self.stopPropagation);
            filterInput.addEventListener('keyup', function filterKeyUp() {
                self.setFilter(contextObject.header.name, filterInput.value);
                requestAnimationFrame(function filterRequestAnimationFrame() {
                    filterInput.classList.remove(self.invalidSearchExpClass);
                    if (self.invalidFilterRegEx) {
                        filterInput.classList.add(self.invalidSearchExpClass);
                    }
                });
            });
            document.body.addEventListener('click', self.disposeContextMenu);
            document.body.appendChild(self.contextMenu);
            loc.x = pos.x + self.style.contextMenuMarginLeft + self.canvasOffsetLeft;
            loc.y = pos.y + self.style.contextMenuMarginTop + self.canvasOffsetTop;
            if (loc.x + self.contextMenu.offsetWidth > document.documentElement.clientWidth) {
                loc.x = document.documentElement.clientWidth - self.contextMenu.offsetWidth;
            }
            if (loc.y + self.contextMenu.offsetHeight > document.documentElement.clientHeight) {
                loc.y = document.documentElement.clientHeight - self.contextMenu.offsetHeight;
            }
            self.contextMenu.style.left = loc.x + 'px';
            self.contextMenu.style.top = loc.y + 'px';
            oPreventDefault.apply(e);
        };
        /**
         * Removes the context menu if it is present.
         * @memberof canvasDataGrid#
         * @method
         */
        self.disposeContextMenu = function (e) {
            //TODO: there are most likely some bugs around removing the context menu.  Can't use grid on first click sometimes
            function disp() {
                self.contextMenu = undefined;
                self.canvas.cursor = 'pointer';
                document.body.removeEventListener('click', self.disposeContextMenu);
                document.body.removeEventListener('mouseup', disp);
                document.body.removeEventListener('mousedown', disp);
                document.body.removeEventListener('touchstart', disp);
                document.body.removeEventListener('touchend', disp);
            }
            if (!e || (self.contextMenu
                                && self.contextMenu.parentNode
                                && !self.contextMenu.contains(e.target))) {
                self.contextMenu.parentNode.removeChild(self.contextMenu);
                document.body.addEventListener('mouseup', disp);
                document.body.addEventListener('mousedown', disp);
                document.body.addEventListener('touchstart', disp);
                document.body.addEventListener('touchend', disp);
            }
        };
        return;
    };
});
