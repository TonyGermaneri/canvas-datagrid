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
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
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
  function addDefaultContextMenuItem(e) {
    var isNormalCell =
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
        e.items.push({
          title: self.attributes.hideColumnText.replace(
            /%s/gi,
            e.cell.header.title || e.cell.header.name,
          ),
          click: function (ev) {
            self.getSchema()[e.cell.columnIndex].hidden = true;
            ev.preventDefault();
            self.stopPropagation(ev);
            self.disposeContextMenu();
            self.setStorageData();
            setTimeout(function () {
              self.resize(true);
            }, 10);
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
    if (
      self.attributes.allowGroupingColumns &&
      e.cell.isColumnHeader &&
      e.cell.header && e.cell.header.index > 0
    ) {
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
      if (col !== headerIndex && groupIndexes.length === 2 && groupIndexes[1] > groupIndexes[0]) {
        const schema = self.getSchema();
        const columns = new Map(schema.map(_col =>
          [_col.columnIndex, _col]
        ));
        const groupTitles = [];
        const groupNames = [];
        for (let i = 0; i < groupIndexes.length; i++) {
          const columnIndex = groupIndexes[i];
          const column = columns.get(columnIndex)
          if (column) {
            groupNames.push(column.name);
            groupTitles.push(column.title || column.name || column.index);
          }
        }
        if (groupNames[0] && groupNames[1]) {
          // show group options
          e.items.push({
            title: self.attributes.showGroupColums.replace(
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
    } // end of grouping columns

  }
  //#endregion addDefaultContextMenuItem
  self.disposeAutocomplete = function () {
    if (autoCompleteContext) {
      autoCompleteContext.dispose();
      autoCompleteContext = undefined;
    }
  };
  self.disposeContextMenu = function () {
    document.removeEventListener('click', self.disposeContextMenu);
    zIndexTop = self.style.contextMenuZIndex;
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
    function createDiposeEvent() {
      requestAnimationFrame(function () {
        document.addEventListener('click', self.disposeContextMenu);
        document.removeEventListener('mouseup', createDiposeEvent);
      });
    }
    var contextPosition,
      items = [],
      pos = overridePos || self.getLayerPos(e),
      ev = {
        NativeEvent: e,
        cell: self.getCellAt(pos.x, pos.y),
        items: items,
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
      self.contextMenu = createContextMenu(ev, contextPosition, items);
      document.addEventListener('mouseup', createDiposeEvent);
      e.preventDefault();
    }
  };
  return;
}
