/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false, Event: false*/
define([], function () {
    'use strict';
    return function (self) {
        var zIndexTop = 2, hoverScrollTimeout, autoCompleteContext;
        function createContextMenu(ev, pos, items, parentContextMenu) {
            var container = document.createElement('div'),
                upArrow = document.createElement('div'),
                downArrow = document.createElement('div'),
                children = [],
                selectedIndex = -1,
                intf = {},
                rect;
            if (!Array.isArray(items)) { throw new Error('createContextMenu expects an array.'); }
            function createItems() {
                items.forEach(function (item) {
                    var contextItemContainer = document.createElement('div'),
                        childMenuArrow;
                    function removeChildContext(e) {
                        if (e.relatedTarget === container
                                || item.contextMenu.container === e.relatedTarget
                                || childMenuArrow === e.relatedTarget
                                || (contextItemContainer === e.relatedTarget)
                                ) { return; }
                        item.contextMenu.dispose();
                        children.splice(children.indexOf(item.contextMenu), 1);
                        item.contextMenu = undefined;
                        contextItemContainer.removeEventListener('mouseout', removeChildContext);
                        container.removeEventListener('mouseout', removeChildContext);
                        contextItemContainer.setAttribute('contextOpen', '0');
                        contextItemContainer.setAttribute('opening', '0');
                    }
                    function contextAddCallback(items) {
                        // check yet again if the user hasn't moved off
                        if (contextItemContainer.getAttribute('opening') !== '1' ||
                                contextItemContainer.getAttribute('contextOpen') === '1') {
                            return;
                        }
                        var cPos = contextItemContainer.getBoundingClientRect();
                        cPos = {
                            left: cPos.left + self.style.childContextMenuMarginLeft + container.offsetWidth,
                            top: cPos.top + self.style.childContextMenuMarginTop,
                            bottom: cPos.bottom,
                            right: cPos.right,
                        };
                        item.contextMenu = createContextMenu(ev, cPos, items, intf);
                        contextItemContainer.setAttribute('contextOpen', '1');
                        contextItemContainer.addEventListener('mouseout', removeChildContext);
                        container.addEventListener('mouseout', removeChildContext);
                        children.push(item.contextMenu);
                    }
                    function createChildContext() {
                        var i;
                        if (contextItemContainer.getAttribute('contextOpen') === '1') {
                            return;
                        }
                        contextItemContainer.setAttribute('opening', '1');
                        if (typeof item.items === 'function') {
                            i  = item.items.apply(intf, [function (items) {
                                contextAddCallback(items);
                            }]);
                            if (i !== undefined && Array.isArray(i)) {
                                contextAddCallback(i);
                            }
                            return;
                        }
                        contextAddCallback(item.items);
                    }
                    function addItem(item) {
                        function addContent(content) {
                            if (typeof content === 'function') {
                                return addContent(content(ev));
                            }
                            if (typeof content === 'object') {
                                contextItemContainer.appendChild(content);
                                return;
                            }
                            self.createInlineStyle(contextItemContainer, 'canvas-datagrid-context-menu-item');
                            contextItemContainer.addEventListener('mouseover', function () {
                                self.createInlineStyle(contextItemContainer, 'canvas-datagrid-context-menu-item:hover');
                            });
                            contextItemContainer.addEventListener('mouseout', function () {
                                self.createInlineStyle(contextItemContainer, 'canvas-datagrid-context-menu-item');
                            });
                            contextItemContainer.innerHTML = content;
                            return;
                        }
                        addContent(item.title);
                        item.contextItemContainer = contextItemContainer;
                        if (item.items && item.items.length > 0) {
                            childMenuArrow = document.createElement('div');
                            self.createInlineStyle(childMenuArrow, 'canvas-datagrid-context-child-arrow');
                            childMenuArrow.innerHTML = self.style.childContextMenuArrowHTML;
                            contextItemContainer.appendChild(childMenuArrow);
                            contextItemContainer.addEventListener('mouseover', createChildContext);
                            contextItemContainer.addEventListener('mouseout', function () {
                                contextItemContainer.setAttribute('opening', '0');
                            });
                        }
                        if (item.click) {
                            contextItemContainer.addEventListener('click', function (ev) {
                                item.click.apply(self, [ev]);
                            });
                        }
                    }
                    addItem(item);
                    container.appendChild(contextItemContainer);
                });
            }
            function clickIndex(idx) {
                items[idx].contextItemContainer.dispatchEvent(new Event('click'));
            }
            function checkArrowVisibility() {
                if (container.scrollTop > 0) {
                    document.body.appendChild(upArrow);
                } else if (upArrow.parentNode) {
                    upArrow.parentNode.removeChild(upArrow);
                }
                if (container.scrollTop >= container.scrollHeight - container.offsetHeight && downArrow.parentNode) {
                    downArrow.parentNode.removeChild(downArrow);
                } else if (container.scrollHeight - container.offsetHeight > 0
                        && !(container.scrollTop >= container.scrollHeight - container.offsetHeight)) {
                    document.body.appendChild(downArrow);
                }
            }
            function startHoverScroll(type) {
                return function t() {
                    var a = self.attributes.contextHoverScrollAmount;
                    if (type === 'up' && container.scrollTop === 0) { return; }
                    if (type === 'down' && container.scrollTop === container.scrollHeight) { return; }
                    container.scrollTop += (type === 'up' ? -a : a);
                    hoverScrollTimeout = setTimeout(t, self.attributes.contextHoverScrollRateMs, type);
                };
            }
            function endHoverScroll(type) {
                return function () {
                    clearTimeout(hoverScrollTimeout);
                };
            }
            function init() {
                var loc = {},
                    s = self.scrollOffset(self.canvas);
                createItems();
                self.createInlineStyle(container, 'canvas-datagrid-context-menu');
                loc.x = pos.left - s.left;
                loc.y = pos.top - s.top;
                loc.height = 0;
                zIndexTop += 1;
                container.style.position = 'absolute';
                upArrow.style.color = self.style.contextMenuArrowColor;
                downArrow.style.color = self.style.contextMenuArrowColor;
                [upArrow, downArrow].forEach(function (el) {
                    el.style.textAlign = 'center';
                    el.style.position = 'absolute';
                    el.style.zIndex = zIndexTop + 1;
                });
                container.style.zIndex = zIndexTop;
                if (parentContextMenu && parentContextMenu.inputDropdown) {
                    container.style.maxHeight = window.innerHeight - loc.y - self.style.autocompleteBottomMargin + 'px';
                    container.style.minWidth = pos.width + 'px';
                    loc.y += pos.height;
                }
                container.style.left = loc.x + 'px';
                container.style.top = loc.y + 'px';
                container.addEventListener('scroll', checkArrowVisibility);
                container.addEventListener('wheel', function (e) {
                    if (self.hasFocus) {
                        container.scrollTop += e.deltaY;
                        container.scrollLeft += e.deltaX;
                    }
                    checkArrowVisibility();
                });
                upArrow.innerHTML = self.style.contextMenuArrowUpHTML;
                downArrow.innerHTML = self.style.contextMenuArrowDownHTML;
                container.appendChild(upArrow);
                document.body.appendChild(downArrow);
                document.body.appendChild(container);
                rect = container.getBoundingClientRect();
                if (rect.bottom > window.innerHeight && !(parentContextMenu && parentContextMenu.inputDropdown)) {
                    loc.y = window.innerHeight - container.offsetHeight;
                    if (loc.y < 0) { loc.y = 0; }
                    if (container.offsetHeight > window.innerHeight) {
                        container.style.height = window.innerHeight - self.style.contextMenuWindowMargin + 'px';
                    }
                }
                if (rect.right > window.innerWidth) {
                    if (parentContextMenu) {
                        loc.x = parentContextMenu.container.offsetLeft - container.offsetWidth;
                    } else {
                        loc.x = window.innerWidth - container.offsetWidth;
                    }
                }
                container.style.left = loc.x + 'px';
                container.style.top = loc.y + 'px';
                rect = container.getBoundingClientRect();
                upArrow.style.top = rect.top + 'px';
                downArrow.style.top = rect.top + rect.height - downArrow.offsetHeight + 'px';
                upArrow.style.left = rect.left + 'px';
                downArrow.style.left = rect.left + 'px';
                downArrow.style.width = container.offsetWidth + 'px';
                upArrow.style.width = container.offsetWidth + 'px';
                downArrow.addEventListener('mouseover', startHoverScroll('down'));
                downArrow.addEventListener('mouseout', endHoverScroll('down'));
                upArrow.addEventListener('mouseover', startHoverScroll('up'));
                upArrow.addEventListener('mouseout', endHoverScroll('up'));
                checkArrowVisibility();
            }
            intf.parentGrid = self.intf;
            intf.parentContextMenu = parentContextMenu;
            intf.container = container;
            init();
            intf.clickIndex = clickIndex;
            intf.rect = rect;
            intf.items = items;
            intf.upArrow = upArrow;
            intf.downArrow = downArrow;
            intf.dispose = function () {
                clearTimeout(hoverScrollTimeout);
                children.forEach(function (c) {
                    c.dispose();
                });
                [downArrow, upArrow, container].forEach(function (el) {
                    if (el.parentNode) { el.parentNode.removeChild(el); }
                });
            };
            Object.defineProperty(intf, 'selectedIndex', {
                get: function () {
                    return selectedIndex;
                },
                set: function (value) {
                    if (typeof value !== 'number' || isNaN(value || !isFinite(value))) {
                        throw new Error('Context menu selected index must be a sane number.');
                    }
                    selectedIndex = value;
                    if (selectedIndex > items.length - 1) {
                        selectedIndex = items.length - 1;
                    }
                    if (selectedIndex < 0) {
                        selectedIndex = 0;
                    }
                    items.forEach(function (item, index) {
                        if (index === selectedIndex) {
                            return self.createInlineStyle(item.contextItemContainer, 'canvas-datagrid-context-menu-item:hover');
                        }
                        self.createInlineStyle(item.contextItemContainer, 'canvas-datagrid-context-menu-item');
                    });
                }
            });
            return intf;
        }
        function createFilterContextMenuItems(e) {
            var filterContainer = document.createElement('div'),
                filterLabel = document.createElement('div'),
                filterAutoCompleteButton = document.createElement('button'),
                filterInput = document.createElement('input'),
                n = e.cell && e.cell.header ? e.cell.header.title || e.cell.header.name : '',
                autoCompleteItems,
                iRect;
            function fillAutoComplete() {
                autoCompleteItems = {};
                self.data.forEach(function (row) {
                    var value = row[e.cell.header.name];
                    if (autoCompleteItems[value]) { return; }
                    autoCompleteItems[value] = {
                        title: self.formatters[e.cell.header.type || 'string']({ cell: { value: value }}),
                        click: function (e) {
                            filterInput.value = value;
                            e.stopPropagation();
                            filterInput.dispatchEvent(new Event('keyup'));
                            self.disposeAutocomplete();
                            return;
                        }
                    };
                });
                autoCompleteItems = Object.keys(autoCompleteItems).map(function (key) {
                    return autoCompleteItems[key];
                });
            }
            function createAutoCompleteContext(ev) {
                if (ev && [40, 38, 13, 9, 27].indexOf(ev.keyCode) !== -1) { return; }
                fillAutoComplete();
                iRect = filterInput.getBoundingClientRect();
                if (autoCompleteContext) {
                    autoCompleteContext.dispose();
                    autoCompleteContext = undefined;
                }
                autoCompleteContext = createContextMenu(e, {
                    left: iRect.left,
                    top: iRect.top,
                    right: iRect.right,
                    bottom: iRect.bottom,
                    height: iRect.height,
                    width: iRect.width
                }, autoCompleteItems, {inputDropdown: true});
                autoCompleteContext.selectedIndex = 0;
            }
            self.createInlineStyle(filterLabel, 'canvas-datagrid-context-menu-label');
            self.createInlineStyle(filterAutoCompleteButton, 'canvas-datagrid-context-menu-filter-button');
            self.createInlineStyle(filterInput, 'canvas-datagrid-context-menu-filter-input');
            filterInput.onclick = self.disposeAutocomplete;
            filterInput.addEventListener('keydown', function (e) {
                //down
                if (e.keyCode === 40) {
                    autoCompleteContext.selectedIndex += 1;
                }
                //up
                if (e.keyCode === 38) {
                    autoCompleteContext.selectedIndex -= 1;
                }
                //enter
                if (e.keyCode === 13) {
                    autoCompleteContext.clickIndex(autoCompleteContext.selectedIndex);
                    self.disposeContextMenu();
                }
                //tab
                if (e.keyCode === 9) {
                    autoCompleteContext.clickIndex(autoCompleteContext.selectedIndex);
                    e.preventDefault();
                }
                //esc
                if (e.keyCode === 27) {
                    self.disposeContextMenu();
                }
            });
            filterInput.addEventListener('keyup', function () {
                self.setFilter(e.cell.header.name, filterInput.value);
            });
            filterInput.addEventListener('keyup', createAutoCompleteContext);
            filterInput.value = e.cell.header ? self.columnFilters[e.cell.header.name] || '' : '';
            filterLabel.innerHTML = self.attributes.filterOptionText.replace(/%s/g, n);
            filterAutoCompleteButton.onclick = function () {
                if (autoCompleteContext) {
                    return self.disposeAutocomplete();
                }
                createAutoCompleteContext();
            };
            filterAutoCompleteButton.innerHTML = self.style.contextFilterButtonHTML;
            filterContainer.addEventListener('click', function (e) {
                return e.stopPropagation();
            });
            filterContainer.appendChild(filterLabel);
            filterContainer.appendChild(filterInput);
            filterContainer.appendChild(filterAutoCompleteButton);
            e.items.push({
                title: filterContainer
            });
            if (Object.keys(self.columnFilters).length) {
                Object.keys(self.columnFilters).forEach(function (cf) {
                    var h = self.getHeaderByName(cf);
                    e.items.push({
                        title: self.attributes.removeFilterOptionText.replace(/%s/g, h.title || h.name),
                        click: function removeFilterClick(e) {
                            e.preventDefault();
                            self.setFilter(cf, '');
                            self.controlInput.focus();
                        }
                    });
                });
            }
        }
        function addDefaultContextMenuItem(e) {
            var isNormalCell = !(e.cell.isBackground || e.cell.isHeaderCellCap
                    || e.cell.isScrollBar || e.cell.isCorner || e.cell.isRowHeader)
                    && e.cell.header;
            if (self.attributes.showFilter && isNormalCell) {
                createFilterContextMenuItems(e);
            }
            if (self.attributes.showCopy
                    && self.selections.reduce(function (p, r) {
                        return p + r.length;
                    }, 0) > 0) {
                e.items.push({
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
                e.items.push({
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
            if (self.attributes.allowSorting && self.attributes.showOrderByOption && isNormalCell) {
                e.items.push({
                    title: self.attributes.showOrderByOptionTextAsc.replace('%s', e.cell.header.title || e.cell.header.name),
                    click: function (ev) {
                        ev.preventDefault();
                        self.order(e.cell.header.name, 'asc');
                        self.controlInput.focus();
                    }
                });
                e.items.push({
                    title: self.attributes.showOrderByOptionTextDesc.replace('%s', e.cell.header.title || e.cell.header.name),
                    click: function (ev) {
                        ev.preventDefault();
                        self.order(e.cell.header.name, 'desc');
                        self.disposeContextMenu();
                        self.controlInput.focus();
                    }
                });
            }
        }
        self.disposeAutocomplete = function () {
            if (autoCompleteContext) {
                autoCompleteContext.dispose();
                autoCompleteContext = undefined;
            }
        };
        self.disposeContextMenu = function () {
            document.removeEventListener('click', self.disposeContextMenu);
            zIndexTop = 2;
            self.disposeAutocomplete();
            if (self.contextMenu) {
                self.contextMenu.dispose();
            }
            self.contextMenu = undefined;
        };
        self.contextmenuEvent = function (e, overridePos) {
            if (!self.hasFocus && e.target !== self.canvas) {
                return;
            }
            var items = [],
                pos = overridePos || self.getLayerPos(e, true),
                ev = {
                    NativeEvent: e,
                    cell: self.getCellAt(pos.x, pos.y),
                    items: items
                };
            if (!ev.cell.isGrid) {
                addDefaultContextMenuItem(ev);
            }
            if (self.dispatchEvent('contextmenu', ev)) {
                return;
            }
            if (!ev.cell.isGrid) {
                if (self.contextMenu) {
                    self.disposeContextMenu();
                }
                self.contextMenu = createContextMenu(ev, {
                    left: pos.x + pos.rect.left + self.style.contextMenuMarginLeft + self.canvasOffsetLeft,
                    top: pos.y + pos.rect.top + self.style.contextMenuMarginTop + self.canvasOffsetTop,
                    right: ev.cell.width + ev.cell.x + pos.rect.left,
                    bottom: ev.cell.height + ev.cell.y + pos.rect.top,
                    height: ev.cell.height,
                    width: ev.cell.width
                }, items);
                document.addEventListener('click', self.disposeContextMenu);
                e.preventDefault();
            }
        };
        return;
    };
});
