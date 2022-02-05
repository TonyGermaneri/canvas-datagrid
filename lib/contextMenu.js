/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false, Event: false*/
'use strict';

export default function (self) {
  var zIndexTop, hoverScrollTimeout, autoCompleteContext;
  function applyContextItemStyle(contextItemContainer) {
    self.createInlineStyle(
      contextItemContainer,
      'canvas-datagrid-context-menu-item' + (self.mobile ? '-mobile' : ''),
    );
    contextItemContainer.addEventListener('mouseover', function () {
      self.createInlineStyle(
        contextItemContainer,
        'canvas-datagrid-context-menu-item:hover',
      );
    });
    contextItemContainer.addEventListener('mouseout', function () {
      self.createInlineStyle(
        contextItemContainer,
        'canvas-datagrid-context-menu-item',
      );
    });
  }
  function createContextMenu(ev, pos, items, parentContextMenu) {
    var container = document.createElement('div'),
      upArrow = document.createElement('div'),
      downArrow = document.createElement('div'),
      children = [],
      selectedIndex = -1,
      intf = {},
      rect;
    if (!Array.isArray(items)) {
      throw new Error('createContextMenu expects an array.');
    }
    function createItems() {
      items.forEach(function (item) {
        var contextItemContainer = document.createElement('div'),
          childMenuArrow;
        function removeChildContext(e) {
          if (
            e.relatedTarget === container ||
            item.contextMenu.container === e.relatedTarget ||
            childMenuArrow === e.relatedTarget ||
            contextItemContainer === e.relatedTarget ||
            item.contextMenu.container.contains(e.relatedTarget)
          ) {
            return;
          }
          item.contextMenu.dispose();
          children.splice(children.indexOf(item.contextMenu), 1);
          item.contextMenu = undefined;
          contextItemContainer.removeEventListener(
            'mouseout',
            removeChildContext,
          );
          container.removeEventListener('mouseout', removeChildContext);
          contextItemContainer.setAttribute('contextOpen', '0');
          contextItemContainer.setAttribute('opening', '0');
        }
        function contextAddCallback(items) {
          // check yet again if the user hasn't moved off
          if (
            contextItemContainer.getAttribute('opening') !== '1' ||
            contextItemContainer.getAttribute('contextOpen') === '1'
          ) {
            return;
          }
          var cPos = contextItemContainer.getBoundingClientRect();
          cPos = {
            left:
              cPos.left +
              self.style.childContextMenuMarginLeft +
              container.offsetWidth,
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
            i = item.items.apply(intf, [
              function (items) {
                contextAddCallback(items);
              },
            ]);
            if (i !== undefined && Array.isArray(i)) {
              contextAddCallback(i);
            }
            return;
          }
          contextAddCallback(item.items);
        }
        function addItem(item) {
          function addContent(content) {
            if (content === null) {
              return;
            }
            if (typeof content === 'function') {
              return addContent(content(ev));
            }
            if (typeof content === 'object') {
              contextItemContainer.appendChild(content);
              return;
            }
            applyContextItemStyle(contextItemContainer);
            contextItemContainer.innerHTML = content;
            return;
          }
          addContent(item.title);
          item.contextItemContainer = contextItemContainer;
          if (
            (item.items && item.items.length > 0) ||
            typeof item.items === 'function'
          ) {
            childMenuArrow = document.createElement('div');
            self.createInlineStyle(
              childMenuArrow,
              'canvas-datagrid-context-child-arrow',
            );
            childMenuArrow.innerHTML = self.style.childContextMenuArrowHTML;
            contextItemContainer.appendChild(childMenuArrow);
            contextItemContainer.addEventListener(
              'mouseover',
              createChildContext,
            );
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
        self.parentDOMNode.appendChild(upArrow);
      } else if (upArrow.parentNode) {
        upArrow.parentNode.removeChild(upArrow);
      }
      if (
        container.scrollTop >=
          container.scrollHeight - container.offsetHeight &&
        downArrow.parentNode
      ) {
        downArrow.parentNode.removeChild(downArrow);
      } else if (
        container.scrollHeight - container.offsetHeight > 0 &&
        !(
          container.scrollTop >=
          container.scrollHeight - container.offsetHeight
        )
      ) {
        self.parentDOMNode.appendChild(downArrow);
      }
    }
    function fade(element) {
      var opacity = 1;
      var timer = setInterval(function () {
        if (opacity <= 0.1) {
          clearInterval(timer);
          element.style.display = 'none';
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        }
        element.style.opacity = opacity;
        element.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
        opacity -= opacity * 0.1;
      }, self.attributes.animationDurationHideContextMenu * 0.1);
    }
    function unfade(element) {
      var opacity = 0.1;
      element.style.display = 'block';
      var timer = setInterval(function () {
        if (opacity >= 1) {
          clearInterval(timer);
        }
        element.style.opacity = opacity;
        element.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
        opacity += opacity * 0.1;
      }, self.attributes.animationDurationShowContextMenu * 0.1);
    }
    function startHoverScroll(type) {
      return function t() {
        var a = self.attributes.contextHoverScrollAmount;
        if (type === 'up' && container.scrollTop === 0) {
          return;
        }
        if (type === 'down' && container.scrollTop === container.scrollHeight) {
          return;
        }
        container.scrollTop += type === 'up' ? -a : a;
        hoverScrollTimeout = setTimeout(
          t,
          self.attributes.contextHoverScrollRateMs,
          type,
        );
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
      if (zIndexTop === undefined) {
        zIndexTop = self.style.contextMenuZIndex;
      }
      createItems();
      self.createInlineStyle(
        container,
        'canvas-datagrid-context-menu' + (self.mobile ? '-mobile' : ''),
      );
      loc.x = pos.left - s.left;
      loc.y = pos.top - s.top;
      loc.height = 0;
      zIndexTop += 1;
      container.style.opacity = 0;
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
        container.style.maxHeight =
          window.innerHeight -
          loc.y -
          self.style.autocompleteBottomMargin +
          'px';
        container.style.minWidth = pos.width + 'px';
        loc.y += pos.height;
      }
      if (self.mobile) {
        container.style.width = pos.width + 'px';
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
      unfade(container);
      rect = container.getBoundingClientRect();
      // TODO: fix !(parentContextMenu && parentContextMenu.inputDropdown) state (autocomplete)
      if (rect.bottom > window.innerHeight) {
        if (!(parentContextMenu && parentContextMenu.inputDropdown)) {
          loc.y -=
            rect.bottom +
            self.style.contextMenuWindowMargin -
            window.innerHeight;
        }
        if (loc.y < 0) {
          loc.y = self.style.contextMenuWindowMargin;
        }
        if (
          container.offsetHeight >
          window.innerHeight - self.style.contextMenuWindowMargin
        ) {
          container.style.height =
            window.innerHeight - self.style.contextMenuWindowMargin * 2 + 'px';
        }
      }
      if (rect.right > window.innerWidth) {
        loc.x -=
          rect.right - window.innerWidth + self.style.contextMenuWindowMargin;
      }
      if (loc.x < 0) {
        loc.x = self.style.contextMenuWindowMargin;
      }
      if (loc.y < 0) {
        loc.y = self.style.contextMenuWindowMargin;
      }
      container.style.left = loc.x + 'px';
      container.style.top = loc.y + 'px';
      rect = container.getBoundingClientRect();
      upArrow.style.top = rect.top + 'px';
      downArrow.style.top =
        rect.top + rect.height - downArrow.offsetHeight + 'px';
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
        fade(el);
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
            return self.createInlineStyle(
              item.contextItemContainer,
              'canvas-datagrid-context-menu-item:hover',
            );
          }
          self.createInlineStyle(
            item.contextItemContainer,
            'canvas-datagrid-context-menu-item',
          );
        });
      },
    });
    return intf;
  }
  function createFilterContextMenuItems(e) {
    var filterContainer = document.createElement('div'),
      filterLabel = document.createElement('div'),
      filterAutoCompleteButton = document.createElement('button'),
      filterInput = document.createElement('input'),
      n =
        e.cell && e.cell.header
          ? e.cell.header.title || e.cell.header.name
          : '',
      iRect;
    function checkRegExpErrorState() {
      filterInput.style.background = self.style.contextFilterInputBackground;
      filterInput.style.color = self.style.contextFilterInputColor;
      if (self.invalidFilterRegEx) {
        filterInput.style.background =
          self.style.contextFilterInvalidRegExpBackground;
        filterInput.style.color = self.style.contextFilterInvalidRegExpColor;
      }
    }
    function fillAutoComplete() {
      var count = 0;
      var items = {};
      var blanksItem = [];

      self.viewData.forEach(function (row) {
        var cellValue =
          row[e.cell.header.name] == null
            ? row[e.cell.header.name]
            : String(row[e.cell.header.name]).trim();
        var value = self.blankValues.includes(cellValue)
          ? self.attributes.blanksText
          : cellValue;

        if (items[value] || count > self.attributes.maxAutoCompleteItems) {
          return;
        }
        count += 1;
        items[value] = {
          title: self.formatters[e.cell.header.type || 'string']({
            cell: { value: value },
          }),
          click: function (e) {
            filterInput.value = value;
            e.stopPropagation();
            filterInput.dispatchEvent(new Event('keyup'));
            self.disposeAutocomplete();
            return;
          },
        };
      });

      if (Object.keys(items).indexOf(self.attributes.blanksText) !== -1) {
        blanksItem.push(items[self.attributes.blanksText]);
        delete items[self.attributes.blanksText];
      }

      return blanksItem.concat(
        Object.keys(items).map(function (key) {
          return items[key];
        }),
      );
    }

    function createAutoCompleteContext(ev) {
      if (ev && ['ArrowDown', 'ArrowUp', 'Enter', 'Tab'].includes(ev.key)) {
        return;
      }

      var autoCompleteItems = fillAutoComplete();

      iRect = filterInput.getBoundingClientRect();
      if (autoCompleteContext) {
        autoCompleteContext.dispose();
        autoCompleteContext = undefined;
      }
      autoCompleteContext = createContextMenu(
        e,
        {
          left: iRect.left,
          top: iRect.top,
          right: iRect.right,
          bottom: iRect.bottom,
          height: iRect.height,
          width: iRect.width,
        },
        autoCompleteItems,
        { inputDropdown: true },
      );
      autoCompleteContext.selectedIndex = 0;
    }
    self.createInlineStyle(filterLabel, 'canvas-datagrid-context-menu-label');
    self.createInlineStyle(
      filterAutoCompleteButton,
      'canvas-datagrid-context-menu-filter-button',
    );
    self.createInlineStyle(
      filterInput,
      'canvas-datagrid-context-menu-filter-input',
    );
    checkRegExpErrorState();
    filterInput.onclick = self.disposeAutocomplete;
    filterInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        autoCompleteContext.selectedIndex += 1;
      }

      if (e.key === 'ArrowUp') {
        autoCompleteContext.selectedIndex -= 1;
      }

      if (e.key === 'Enter') {
        autoCompleteContext.clickIndex(autoCompleteContext.selectedIndex);
        self.disposeContextMenu();
      }

      if (e.key === 'Tab') {
        autoCompleteContext.clickIndex(autoCompleteContext.selectedIndex);
        e.preventDefault();
      }

      if (e.key === 'Escape') {
        self.disposeContextMenu();
      }
    });
    filterInput.addEventListener('keyup', function () {
      self.setFilter(e.cell.header.name, filterInput.value);
    });
    filterInput.addEventListener('keyup', createAutoCompleteContext);
    ['focus', 'blur', 'keydown', 'keyup', 'change'].forEach(function (en) {
      filterInput.addEventListener(en, checkRegExpErrorState);
    });
    filterInput.value = e.cell.header
      ? self.columnFilters[e.cell.header.name] || ''
      : '';
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
      title: filterContainer,
    });
    if (Object.keys(self.columnFilters).length) {
      Object.keys(self.columnFilters).forEach(function (cf) {
        var h = self.getHeaderByName(cf);
        e.items.push({
          title: self.attributes.removeFilterOptionText.replace(
            /%s/g,
            h.title || h.name,
          ),
          click: function removeFilterClick(e) {
            e.preventDefault();
            self.setFilter(cf, '');
            self.controlInput.focus();
          },
        });
      });
    }
  }

  /**
   * Return a tuple if the user selected contiguous columns, otherwise `null`.
   * Info: Because the user may reorder the columns,
   * the schemaIndex of the first item may be greater than the schemaIndex of the second item,
   * but the columnIndex of the firs item must less than the columnIndex of the second item.
   * @param {any[]} schema from `self.getSchema()`
   * @returns {any[]} column schemas tuple (each schema has an additional field `schemaIndex`)
   */
  function getSelectedContiguousColumns(ev, schema) {
    const memoKey = '__contiguousColumns';
    if (Array.isArray(ev[memoKey]) || ev[memoKey] === null) return ev[memoKey];
    ev[memoKey] = null;

    if (!Array.isArray(self.selections) || self.selections.length === 0) return;
    const selection = self.selections[0];
    if (!selection || selection.length === 0) return;
    for (let rowIndex = 0; rowIndex < self.viewData.length; rowIndex++) {
      const row = self.viewData[rowIndex];
      if (!row) continue;
      const compare = self.selections[rowIndex];
      if (!compare) return;
      if (compare.length !== selection.length) return;
      for (let i = 0; i < selection.length; i++)
        if (selection[i] !== compare[i]) return;
    }
    selection.sort((a, b) => a - b);

    /** @type {number[][]} */
    const ranges = [];
    let begin = selection[0];
    let end = selection[0];
    for (let i = 1; i < selection.length; i++) {
      const orderIndex = selection[i];
      if (orderIndex === end + 1) {
        end = orderIndex;
        continue;
      }
      ranges.push([begin, end]);
      begin = orderIndex;
      end = orderIndex;
    }
    ranges.push([begin, end]);

    const currentOrderIndex = ev.cell.columnIndex;
    const matchedRange = ranges.find(
      (range) =>
        currentOrderIndex >= range[0] &&
        currentOrderIndex <= range[1] &&
        range[0] !== range[1],
    );
    if (!matchedRange) return;

    /** @type {number[]} orders[index] => columnIndex */
    const orders = self.orders.columns;
    if (!Array.isArray(orders)) return;

    const matchedSchema = matchedRange.map((orderIndex) => {
      const schemaIndex = orders[orderIndex];
      const thisSchema = schema[schemaIndex];
      return Object.assign({}, thisSchema, { orderIndex });
    });
    if (matchedSchema.findIndex((it) => !it) >= 0) return;
    return (ev[memoKey] = matchedSchema);
  }
  /**
   * @param {boolean} [allowOnlyOneRow]
   * @returns {number[]} a rowIndex tuple. It can contains one row index or two row indexes.
   */
  function getSelectedContiguousRows(allowOnlyOneRow) {
    let range = [];
    let prev = -2;
    let ok = true;
    self.selections.forEach(function (row, index) {
      if (!ok) return;
      if (prev < -1) {
        prev = index;
        range[0] = index;
        return;
      }
      if (index !== prev + 1 || !row || row.length === 0) {
        ok = false;
        return;
      }
      prev = index;
      range[1] = index;
    });
    if (ok) {
      if (range.length === 1) return allowOnlyOneRow ? range : null;
      return range;
    }
  }
  function addDefaultContextMenuItem(e) {
    const schema = self.getSchema();
    /**
     * A map between columnIndex and column data
     * @type {Map<string,any>}
     */
    let columns;
    const getColumnsMap = () => {
      if (!columns)
        columns = new Map(schema.map((_col) => [_col.columnIndex, _col]));
      return columns;
    };
    const isSorting =
      self.orderings.columns && self.orderings.columns.length > 0;

    const isNormalCell =
      !(
        e.cell.isBackground ||
        e.cell.isColumnHeaderCellCap ||
        e.cell.isScrollBar ||
        e.cell.isCorner ||
        e.cell.isRowHeader
      ) && e.cell.header;
    if (self.attributes.showFilter && isNormalCell) {
      createFilterContextMenuItems(e);
    }
    if (
      self.attributes.showCopy &&
      self.selections.reduce(function (p, r) {
        return p + r.length;
      }, 0) > 0
    ) {
      e.items.push({
        title: self.attributes.copyText,
        click: function () {
          document.execCommand('copy');
          self.disposeContextMenu();
          self.controlInput.focus();
        },
      });
    }
    if (self.attributes.showPaste && self.clipBoardData) {
      e.items.push({
        title: self.attributes.pasteText,
        click: function () {
          self.paste(self.clipBoardData, e.cell.columnIndex, e.cell.rowIndex);
          self.draw();
        },
      });
    }
    if (self.attributes.showColumnSelector) {
      e.items.push({
        title: self.attributes.columnSelectorText,
        items: function () {
          var d = [];
          self.getSchema().forEach(function (column) {
            function toggleColumnVisibility(e) {
              column.hidden = !column.hidden;
              self.dispatchEvent('togglecolumn', {
                column: column,
                hidden: column.hidden,
              });
              e.preventDefault();
              self.stopPropagation(e);
              self.disposeContextMenu();
              self.resize(true);
              self.setStorageData();
            }
            var el = document.createElement('div');
            applyContextItemStyle(el);
            el.addEventListener('touchstart', toggleColumnVisibility);
            el.addEventListener('click', toggleColumnVisibility);
            el.innerHTML =
              (column.hidden
                ? self.attributes.columnSelectorHiddenText
                : self.attributes.columnSelectorVisibleText) +
              (column.title || column.name);
            d.push({
              title: el,
            });
          });
          return d;
        },
      });
      if (e.cell && e.cell.header && e.cell.columnIndex > -1) {
        // This variable represents the order index because of the following codes from `draw.js`:
        //     columnIndex: columnOrderIndex,
        const columnOrderIndex = e.cell.columnIndex;
        const columnIndex = self.orders.columns[columnOrderIndex];

        const contiguousColumns = getSelectedContiguousColumns(e, schema);
        let title = '';
        if (contiguousColumns) {
          title = contiguousColumns
            .map((col) => col.title || col.name)
            .join('-');
        } else {
          const column = schema[columnIndex];
          if (column) title = column.title || column.name;
        }
        e.items.push({
          title: self.attributes.hideColumnText.replace(/%s/gi, title),
          click: function (ev) {
            ev.preventDefault();
            self.stopPropagation(ev);
            self.disposeContextMenu();
            if (contiguousColumns) {
              self.hideColumns(
                contiguousColumns[0].orderIndex,
                contiguousColumns[1].orderIndex,
              );
            } else {
              self.hideColumns(columnOrderIndex);
            }
          },
        });
      }
    }
    if (
      self.attributes.saveAppearance &&
      self.attributes.showClearSettingsOption &&
      (Object.keys(self.sizes.rows).length > 0 ||
        Object.keys(self.sizes.columns).length > 0)
    ) {
      e.items.push({
        title: self.attributes.clearSettingsOptionText,
        click: function (e) {
          e.preventDefault();
          self.sizes.rows = {};
          self.sizes.columns = {};
          self.createRowOrders();
          self.createColumnOrders();
          self.storedSettings = undefined;
          self.dispatchEvent('resizecolumn', {
            columnWidth: self.style.cellWidth,
          });
          self.dispatchEvent('resizerow', {
            cellHeight: self.style.cellHeight,
          });
          self.setStorageData();
          self.resize(true);
          self.disposeContextMenu();
          self.controlInput.focus();
        },
      });
    }
    if (
      self.attributes.allowSorting &&
      self.attributes.showOrderByOption &&
      isNormalCell
    ) {
      e.items.push({
        title: self.attributes.showOrderByOptionTextAsc.replace(
          '%s',
          e.cell.header.title || e.cell.header.name,
        ),
        click: function (ev) {
          ev.preventDefault();
          self.order(e.cell.header.name, 'asc');
          self.controlInput.focus();
        },
      });
      e.items.push({
        title: self.attributes.showOrderByOptionTextDesc.replace(
          '%s',
          e.cell.header.title || e.cell.header.name,
        ),
        click: function (ev) {
          ev.preventDefault();
          self.order(e.cell.header.name, 'desc');
          self.disposeContextMenu();
          self.controlInput.focus();
        },
      });
    }

    //#region hide rows
    const canHideRows = !isSorting && e.cell.isRowHeader && e.cell.header;
    if (canHideRows) {
      const range = getSelectedContiguousRows(true);
      if (range) {
        const boundRowIndexes = range.map((viewRowIndex) =>
          self.getBoundRowIndexFromViewRowIndex(viewRowIndex),
        );
        let title;
        if (boundRowIndexes.length === 1) {
          if (typeof boundRowIndexes[0] === 'number')
            title = boundRowIndexes[0] + 1;
          else title = range[0] + 1;

          title = self.attributes.showHideRow.replace('%s', title);
          // hide one row
          e.items.push({
            title,
            click: function (ev) {
              ev.preventDefault();
              self.hideRows(boundRowIndexes[0], boundRowIndexes[0]);
            },
          });
        } else if (boundRowIndexes[0] <= boundRowIndexes[1]) {
          title = boundRowIndexes
            .map((it, index) => {
              if (typeof it === 'number') return it + 1;
              return range[index] + 1;
            })
            .join('-');
          title = self.attributes.showHideRows.replace('%s', title);
          // hide rows
          e.items.push({
            title,
            click: function (ev) {
              ev.preventDefault();
              self.hideRows(boundRowIndexes[0], boundRowIndexes[1]);
            },
          });
        }
      }
    }
    //#endregion hide rows

    //#region group/ungroup columns
    const groupAreaHeight = self.getColumnGroupAreaHeight();
    const groupAreaWidth = self.getRowGroupAreaWidth();
    const setCollapseStateForAllGroups = (allGroups, collapsed) => {
      if (allGroups.length === 0) return;
      for (let i = 0; i < allGroups.length; i++) {
        const groups = allGroups[i];
        for (let j = 0; j < groups.length; j++) {
          const group = groups[j];
          group.collapsed = collapsed;
        }
      }
      self.refresh();
    };
    if (e.pos && e.pos.y < groupAreaHeight) {
      e.items.push({
        title: self.attributes.showRemoveAllGroupColumns,
        click: function (ev) {
          ev.preventDefault();
          self.groupedColumns = [];
          self.refresh();
        },
      });
      e.items.push({
        title: self.attributes.showExpandAllGroupColumns,
        click: function (ev) {
          ev.preventDefault();
          setCollapseStateForAllGroups(self.groupedColumns, false);
        },
      });
      e.items.push({
        title: self.attributes.showCollapseAllGroupColumns,
        click: function (ev) {
          ev.preventDefault();
          setCollapseStateForAllGroups(self.groupedColumns, true);
        },
      });
    }
    if (e.pos && e.pos.x < groupAreaWidth) {
      e.items.push({
        title: self.attributes.showRemoveAllGroupRows,
        click: function (ev) {
          ev.preventDefault();
          self.groupedRows = [];
          self.refresh();
        },
      });
      e.items.push({
        title: self.attributes.showExpandAllGroupRows,
        click: function (ev) {
          ev.preventDefault();
          setCollapseStateForAllGroups(self.groupedRows, false);
        },
      });
      e.items.push({
        title: self.attributes.showCollapseAllGroupRows,
        click: function (ev) {
          ev.preventDefault();
          setCollapseStateForAllGroups(self.groupedRows, true);
        },
      });
    }

    const canGroupByColumns =
      self.attributes.allowGroupingColumns &&
      e.cell.isColumnHeader &&
      e.cell.header &&
      e.cell.header.index > 0;
    const canUngroupColumns =
      self.attributes.allowGroupingColumns && e.cell.isColumnHeader;
    const canGroupByRows =
      !isSorting &&
      self.attributes.allowGroupingRows &&
      e.cell.isRowHeader &&
      e.cell.header;
    const canUngroupRows =
      self.attributes.allowGroupingRows && e.cell.isRowHeader;

    if (canGroupByColumns) {
      /** @type {number[]} */
      const groupIndexes = [];
      /** @type {number} */
      const headerIndex = e.cell.header.index;
      let col = headerIndex;
      for (; col >= 0; col--) {
        if (!self.isColumnSelected(col)) break;
        groupIndexes[0] = col;
      }
      for (col = headerIndex; ; col++) {
        if (!self.isColumnSelected(col)) break;
        groupIndexes[1] = col;
      }
      if (
        col !== headerIndex &&
        groupIndexes.length === 2 &&
        groupIndexes[1] > groupIndexes[0] &&
        self.isNewGroupRangeValid(
          self.groupedColumns,
          groupIndexes[0],
          groupIndexes[1],
        )
      ) {
        const columns = getColumnsMap();
        const groupTitles = [];
        const groupNames = [];
        for (let i = 0; i < groupIndexes.length; i++) {
          const columnIndex = groupIndexes[i];
          const column = columns.get(columnIndex);
          if (column) {
            groupNames.push(column.name);
            groupTitles.push(column.title || column.name || column.index);
          }
        }
        if (groupNames[0] && groupNames[1]) {
          // show group options
          e.items.push({
            title: self.attributes.showGroupColumns.replace(
              '%s',
              groupTitles[0] + '-' + groupTitles[1],
            ),
            click: function (ev) {
              ev.preventDefault();
              self.groupColumns(groupNames[0], groupNames[1]);
              self.controlInput.focus();
            },
          });
        }
      }
    }
    if (canUngroupColumns) {
      const columnIndex = e.cell.columnIndex;
      const groups = self.getGroupsColumnBelongsTo(columnIndex);
      const columns = getColumnsMap();
      for (let i = 0; i < groups.length; i++) {
        const { from, to } = groups[i];
        const cell0 = columns.get(from);
        const cell1 = columns.get(to);
        if (cell0 && cell1) {
          const formatArgs =
            (cell0.title || cell0.name || cell0.index) +
            '-' +
            (cell1.title || cell1.name || cell1.index);
          e.items.push({
            title: self.attributes.showRemoveGroupColumns.replace(
              '%s',
              formatArgs,
            ),
            click: function (ev) {
              ev.preventDefault();
              self.removeGroupColumns(cell0.name, cell1.name);
              self.controlInput.focus();
            },
          });
        } else {
          console.warn(`Cannot find column ${from} or column ${to}`);
        }
      }
    }
    if (canGroupByRows) {
      const range = getSelectedContiguousRows(false) || [];
      const rangeTitle = range
        .map((rowIndex) => {
          const index = self.getBoundRowIndexFromViewRowIndex(rowIndex);
          if (typeof index === 'number') return index + 1;
          return rowIndex + 1;
        })
        .join('-');
      if (
        range.length === 2 &&
        self.isNewGroupRangeValid(self.groupedRows, range[0], range[1])
      ) {
        e.items.push({
          title: self.attributes.showGroupRows.replace('%s', rangeTitle),
          click: function (ev) {
            ev.preventDefault();
            self.groupRows(range[0], range[1]);
          },
        });
      }
    }
    if (canUngroupRows) {
      const rowIndex = e.cell.rowIndex;
      const groups = self.getGroupsRowBelongsTo(rowIndex);
      for (let i = 0; i < groups.length; i++) {
        const { from, to } = groups[i];
        const rangeTitle = [from, to]
          .map((rowIndex) => {
            const index = self.getBoundRowIndexFromViewRowIndex(rowIndex);
            if (typeof index === 'number') return index + 1;
            return rowIndex + 1;
          })
          .join('-');
        e.items.push({
          title: self.attributes.showRemoveGroupRows.replace('%s', rangeTitle),
          click: function (ev) {
            ev.preventDefault();
            self.removeGroupRows(from, to);
            self.controlInput.focus();
          },
        });
      }
    }
    //#endregion group/ungroup columns
  }
  self.disposeAutocomplete = function () {
    if (autoCompleteContext) {
      autoCompleteContext.dispose();
      autoCompleteContext = undefined;
    }
  };
  self.disposeContextMenu = function (event) {
    document.removeEventListener('click', self.disposeContextMenu);
    zIndexTop = self.style.contextMenuZIndex;
    self.disposeAutocomplete();
    if (self.contextMenu) {
      self.contextMenu.dispose();
    }
    self.contextMenu = undefined;
    if (event) {
      self.canvas.focus();
      self.mousedown(event);
      self.mouseup(event);
    }
  };
  self.contextmenuEvent = function (e, overridePos) {
    if (!self.hasFocus && e.target !== self.canvas) {
      return;
    }
    // don't create context menu for parents if current position is located in child grid
    const children = Object.keys(self.childGrids);
    for (let i = 0; i < children.length; i++) {
      const childGrid = self.childGrids[children[i]];
      const parentNode = childGrid && childGrid.parentNode;
      if (!parentNode) continue;
      const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = parentNode;
      if ((e.x >= offsetLeft && e.x <= offsetLeft + offsetWidth) === false)
        continue;
      if ((e.y >= offsetTop && e.y <= offsetTop + offsetHeight) === false)
        continue;
      return; // in child grid
    }
    // don't create context menu for child if current position is located in parent grid
    if (self.isChildGrid && self.parentNode) {
      //#region check is current child grid closed
      const childGridsOfParent = self.parentGrid && self.parentGrid.childGrids;
      if (!childGridsOfParent || !Array.isArray(childGridsOfParent)) return;
      const matchedMe = childGridsOfParent.find((grid) => {
        const nodeA = grid.parentNode;
        const nodeB = self.parentNode;
        return (
          nodeA.offsetTop == nodeB.offsetTop &&
          nodeA.offsetLeft === nodeB.offsetLeft
        );
      });
      if (!matchedMe) return;
      //#endregion

      let x0 = self.parentNode.offsetLeft;
      let x1 = self.parentNode.offsetLeft + self.parentNode.offsetWidth;
      let y0 = self.parentNode.offsetTop;
      let y1 = self.parentNode.offsetTop + self.parentNode.offsetHeight;
      let node = self.parentNode.parentNode;
      while (node) {
        const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = node;
        if (offsetLeft > x0) x0 = offsetLeft;
        if (offsetTop > y0) y0 = offsetTop;
        const newX1 = offsetLeft + offsetWidth;
        const newY1 = offsetTop + offsetHeight;
        if (newX1 < x1) x1 = newX1;
        if (newY1 < y1) y1 = newY1;
        if (node.nodeType !== 'canvas-datagrid-tree') break;
        node = node.parentNode;
      }
      if ((e.x >= x0 && e.x <= x1 && e.y >= y0 && e.y <= y1) === false) return;
    }
    function createDisposeEvent() {
      requestAnimationFrame(function () {
        document.addEventListener('click', self.disposeContextMenu);
        document.removeEventListener('mouseup', createDisposeEvent);
      });
    }
    var contextPosition,
      items = [],
      pos = overridePos || self.getLayerPos(e),
      ev = {
        NativeEvent: e,
        cell: self.getCellAt(pos.x, pos.y),
        pos,
        items: items,
      };
    if (!ev.cell.isGrid) {
      addDefaultContextMenuItem(ev);
    }
    if (e.type !== 'mousedown' && self.dispatchEvent('contextmenu', ev)) {
      return;
    }
    if (!ev.cell.isGrid) {
      if (self.contextMenu) {
        self.disposeContextMenu();
      }
      contextPosition = {
        left:
          pos.x +
          pos.rect.left +
          self.style.contextMenuMarginLeft +
          self.canvasOffsetLeft,
        top:
          pos.y +
          pos.rect.top +
          self.style.contextMenuMarginTop +
          self.canvasOffsetTop,
        right: ev.cell.width + ev.cell.x + pos.rect.left,
        bottom: ev.cell.height + ev.cell.y + pos.rect.top,
        height: ev.cell.height,
        width: ev.cell.width,
      };
      if (self.mobile) {
        contextPosition.left = self.style.mobileContextMenuMargin + 'px';
        contextPosition.width =
          self.width - self.style.mobileContextMenuMargin * 2 + 'px';
      }
      if (e.type == 'mousedown') {
        contextPosition.top += self.style.filterButtonMenuOffsetTop;
      }
      self.contextMenu = createContextMenu(ev, contextPosition, items);
      if (e.type == 'mousedown') {
        document.addEventListener('mouseup', createDisposeEvent);
      } else {
        createDisposeEvent();
      }
      e.preventDefault();
    }
  };
  return;
}
