/*jslint browser: true, unparam: true, todo: true*/
/*globals HTMLElement: false, Reflect: false, define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
'use strict';

export default function (self, ctor) {
  self.scale = 1;
  self.orders = {
    rows: [],
    columns: [],
  };
  self.appliedInlineStyles = {};
  self.cellGridAttributes = {};
  self.treeGridAttributes = {};
  self.visibleRowHeights = [];
  self.hasFocus = false;
  self.activeCell = {
    columnIndex: 0,
    rowIndex: 0,
  };
  self.innerHTML = '';
  self.storageName = 'canvasDataGrid';
  self.invalidSearchExpClass = 'canvas-datagrid-invalid-search-regExp';
  self.localStyleLibraryStorageKey = 'canvas-datagrid-user-style-library';
  self.dataType = 'application/x-canvas-datagrid';
  self.orderBy = null;
  self.orderDirection = 'asc';
  self.orderings = {
    columns: [],
    add: function (orderBy, orderDirection, sortFunction) {
      self.orderings.columns = self.orderings.columns.filter(function (col) {
        return col.orderBy !== orderBy;
      });
      self.orderings.columns.push({
        orderBy: orderBy,
        orderDirection: orderDirection,
        sortFunction: sortFunction,
      });
    },
    sort: function () {
      console.warn(
        'grid.orderings.sort has been deprecated. Please use grid.refresh().',
      );

      self.orderings.columns.forEach(function (col) {
        self.viewData.sort(col.sortFunction(col.orderBy, col.orderDirection));
      });
    },
  };
  self.columnFilters = {};
  self.filters = {};
  self.frozenRow = 0;
  self.frozenColumn = 0;
  self.ellipsisCache = {};
  self.scrollCache = { x: [], y: [] };
  self.scrollBox = {};
  self.visibleRows = [];
  self.visibleCells = [];
  self.sizes = {
    rows: {},
    columns: {},
    trees: {},
  };
  self.currentFilter = function () {
    return true;
  };
  self.selections = [];
  self.hovers = {};
  self.attributes = {};
  self.style = {};
  self.formatters = {};
  self.sorters = {};
  self.parsers = {};
  self.schemaHashes = {};
  self.events = {};
  self.changes = [];
  self.scrollIndexTop = 0;
  self.scrollPixelTop = 0;
  self.scrollIndexLeft = 0;
  self.scrollPixelLeft = 0;
  self.childGrids = {};
  self.openChildren = {};
  self.scrollModes = [
    'vertical-scroll-box',
    'vertical-scroll-top',
    'vertical-scroll-bottom',
    'horizontal-scroll-box',
    'horizontal-scroll-right',
    'horizontal-scroll-left',
  ];
  self.componentL1Events = {};
  self.eventNames = [
    'afterdraw',
    'afterrendercell',
    'attributechanged',
    'beforebeginedit',
    'beforecreatecellgrid',
    'beforedraw',
    'beforeendedit',
    'beforerendercell',
    'beforerendercellgrid',
    'beginedit',
    'cellmouseout',
    'cellmouseover',
    'click',
    'collapsetree',
    'contextmenu',
    'copy',
    'datachanged',
    'dblclick',
    'endedit',
    'expandtree',
    'formatcellvalue',
    'keydown',
    'keypress',
    'keyup',
    'mousedown',
    'mousemove',
    'mouseup',
    'newrow',
    'ordercolumn',
    'rendercell',
    'rendercellgrid',
    'renderorderbyarrow',
    'rendertext',
    'rendertreearrow',
    'reorder',
    'reordering',
    'resize',
    'resizecolumn',
    'resizerow',
    'schemachanged',
    'scroll',
    'selectionchanged',
    'stylechanged',
    'touchcancel',
    'touchend',
    'touchmove',
    'touchstart',
    'wheel',
  ];
  self.mouse = { x: 0, y: 0 };
  self.getSelectedData = function (expandToRow) {
    const selectedData = [];
    const schema = self.getSchema();
    const viewDataLength = self.viewData.length;

    if (viewDataLength === 0) {
      return [];
    }

    // self.selections is a sparse array, so `viewRowIndex` here
    // will equal the row index as where it's rendered,
    // not as where it is in the original data array.
    self.selections.forEach(function (row, viewRowIndex) {
      if (!row) {
        return;
      }

      if (viewRowIndex === viewDataLength) {
        return;
      }

      if (row.length === 0) {
        selectedData[viewRowIndex] = null;
        return;
      }

      selectedData[viewRowIndex] = {};

      row.forEach(function (col) {
        if (col === -1 || !schema[col]) {
          return;
        }

        const orderedIndex = self.orders.columns[col];

        if (!expandToRow && schema[orderedIndex].hidden) {
          return;
        }

        if (self.viewData[viewRowIndex]) {
          selectedData[viewRowIndex][schema[orderedIndex].name] =
            self.viewData[viewRowIndex][schema[orderedIndex].name];
        }
      });
    });

    return selectedData;
  };
  self.getBoundRowIndexFromViewRowIndex = function (viewRowIndex) {
    if (self.boundRowIndexMap && self.boundRowIndexMap.has(viewRowIndex)) {
      return self.boundRowIndexMap.get(viewRowIndex);
    }

    return undefined;
  };
  self.getColumnHeaderCellHeight = function () {
    if (!self.attributes.showColumnHeaders) {
      return 0;
    }
    return (
      (self.sizes.rows[-1] || self.style.columnHeaderCellHeight) * self.scale
    );
  };
  self.getRowHeaderCellWidth = function () {
    if (!self.attributes.showRowHeaders) {
      return 0;
    }
    return (
      (self.sizes.columns[-1] || self.style.rowHeaderCellWidth) * self.scale
    );
  };
  self.setStorageData = function () {
    if (!self.attributes.saveAppearance || !self.attributes.name) {
      return;
    }
    var visibility = {};
    self.getSchema().forEach(function (column) {
      visibility[column.name] = !column.hidden;
    });
    localStorage.setItem(
      self.storageName + '-' + self.attributes.name,
      JSON.stringify({
        sizes: {
          rows: self.sizes.rows,
          columns: self.sizes.columns,
        },
        orders: {
          rows: self.orders.rows,
          columns: self.orders.columns,
        },
        orderBy: self.orderBy,
        orderDirection: self.orderDirection,
        visibility: visibility,
      }),
    );
  };
  self.getSchema = function () {
    return self.schema || self.tempSchema || [];
  };
  function fillArray(low, high) {
    var i = [],
      x;
    for (x = low; x <= high; x += 1) {
      i[x] = x;
    }
    return i;
  }
  self.createColumnOrders = function () {
    var s = self.getSchema();
    self.orders.columns = fillArray(0, s.length - 1);
  };
  self.createRowOrders = function () {
    self.orders.rows = fillArray(0, self.originalData.length - 1);
  };
  self.getVisibleSchema = function () {
    return self.getSchema().filter(function (col) {
      return !col.hidden;
    });
  };
  self.applyDefaultValue = function (row, header) {
    var d = header.defaultValue || '';
    if (typeof d === 'function') {
      d = d.apply(self.intf, [header]);
    }
    row[header.name] = d;
  };
  self.createNewRowData = function () {
    self.newRow = {};
    self.getSchema().forEach(function forEachHeader(header) {
      self.applyDefaultValue(self.newRow, header);
    });
  };
  self.getSchemaNameHash = function (key) {
    var n = 0;
    while (self.schemaHashes[key]) {
      n += 1;
      key = key + n;
    }
    return key;
  };
  self.filter = function (type) {
    var f = self.filters[type];
    if (!f && type !== undefined) {
      console.warn(
        'Cannot find filter for type %s, falling back to substring match.',
        type,
      );
      f = self.filters.string;
    }
    return f;
  };
  self.getFilteredAndSortedViewData = function (originalData) {
    // We make a copy of originalData here in order be able to
    // filter and sort rows without modifying the original array.
    // Each row is turned into a (row, rowIndex) tuple
    // so that when we apply filters, we can refer back to the
    // row's original row number in originalData. This becomes
    // useful when emitting cell events.
    let newViewData = originalData.map((row, originalRowIndex) => [
      row,
      originalRowIndex,
    ]);

    // Apply filtering
    for (const [headerName, filterText] of Object.entries(self.columnFilters)) {
      const header = self.getHeaderByName(headerName);

      if (!header) {
        continue;
      }

      const currentFilterFunction =
        header.filter || self.filter(header.type || 'string');

      newViewData = newViewData.filter(function ([row]) {
        const cellValue = row[headerName];
        const shouldIncludeRow = currentFilterFunction(cellValue, filterText);

        return shouldIncludeRow;
      });
    }

    // Apply sorting
    for (const column of self.orderings.columns) {
      const sortFn = column.sortFunction(column.orderBy, column.orderDirection);

      newViewData.sort(([rowA], [rowB]) => sortFn(rowA, rowB));
    }

    return {
      viewData: newViewData.map(([row]) => row),
      boundRowIndexMap: new Map(
        newViewData.map(([_row, originalRowIndex], viewRowIndex) => [
          viewRowIndex,
          originalRowIndex,
        ]),
      ),
    };
  };
  self.refresh = function () {
    const { viewData, boundRowIndexMap } = self.getFilteredAndSortedViewData(
      self.originalData,
    );

    self.viewData = viewData;
    self.boundRowIndexMap = boundRowIndexMap;

    self.resize();
    self.draw(true);
  };
  self.getBestGuessDataType = function (columnName, data) {
    var t,
      x,
      l = data.length;
    for (x = 0; x < l; x += 1) {
      if (
        data[x] !== undefined &&
        data[x] !== null &&
        [null, undefined].indexOf(data[x][columnName]) !== -1
      ) {
        t = typeof data[x];
        return t === 'object' ? 'string' : t;
      }
    }
    return 'string';
  };
  self.drawChildGrids = function () {
    Object.keys(self.childGrids).forEach(function (gridKey) {
      self.childGrids[gridKey].draw();
    });
  };
  self.resizeChildGrids = function () {
    Object.keys(self.childGrids).forEach(function (gridKey) {
      self.childGrids[gridKey].resize();
    });
  };
  self.autoScrollZone = function (e, x, y, ctrl) {
    var setTimer,
      rowHeaderCellWidth = self.getRowHeaderCellWidth(),
      columnHeaderCellHeight = self.getColumnHeaderCellHeight();
    if (y !== -1) {
      if (
        x > self.width - self.attributes.selectionScrollZone &&
        x < self.width
      ) {
        self.scrollBox.scrollLeft += self.attributes.selectionScrollIncrement;
        setTimer = true;
      }
      if (x - self.attributes.selectionScrollZone - rowHeaderCellWidth < 0) {
        self.scrollBox.scrollLeft -= self.attributes.selectionScrollIncrement;
        setTimer = true;
      }
    }
    if (y !== -1) {
      if (
        y > self.height - self.attributes.selectionScrollZone &&
        y < self.height
      ) {
        self.scrollBox.scrollTop += self.attributes.selectionScrollIncrement;
        setTimer = true;
      }
      if (
        y - self.attributes.selectionScrollZone - columnHeaderCellHeight <
        0
      ) {
        self.scrollBox.scrollTop -= self.attributes.selectionScrollIncrement;
        setTimer = true;
      }
    }
    if (
      setTimer &&
      !ctrl &&
      self.currentCell &&
      self.currentCell.columnIndex !== -1
    ) {
      self.scrollTimer = setTimeout(
        self.mousemove,
        self.attributes.scrollRepeatRate,
        e,
      );
    }
  };
  self.validateColumn = function (c, s) {
    if (!c.name) {
      throw new Error('A column must contain at least a name.');
    }
    if (
      s.filter(function (i) {
        return i.name === c.name;
      }).length > 0
    ) {
      throw new Error(
        'A column with the name ' +
          c.name +
          ' already exists and cannot be added again.',
      );
    }
    return true;
  };
  self.setDefaults = function (obj1, obj2, key, def) {
    obj1[key] = obj2[key] === undefined ? def : obj2[key];
  };
  self.setAttributes = function () {
    self.defaults.attributes.forEach(function eachAttribute(i) {
      self.setDefaults(self.attributes, self.args, i[0], i[1]);
    });
  };
  self.setStyle = function () {
    self.defaults.styles.forEach(function eachStyle(i) {
      self.setDefaults(self.style, self.args.style || {}, i[0], i[1]);
    });
  };
  self.autosize = function (colName) {
    self.getVisibleSchema().forEach(function (col, colIndex) {
      if (col.name === colName || colName === undefined) {
        self.sizes.columns[colIndex] = Math.max(
          self.findColumnMaxTextLength(col.name),
          self.style.minColumnWidth,
        );
      }
    });
    self.sizes.columns[-1] = self.findColumnMaxTextLength('cornerCell');
  };
  self.dispose = function () {
    if (!self.isChildGrid && self.canvas && self.canvas.parentNode) {
      self.canvas.parentNode.removeChild(self.canvas);
    }
    if (!self.isChildGrid) {
      document.body.removeChild(self.controlInput);
    }
    self.eventParent.removeEventListener('mouseup', self.mouseup, false);
    self.eventParent.removeEventListener('mousedown', self.mousedown, false);
    self.eventParent.removeEventListener('dblclick', self.dblclick, false);
    self.eventParent.removeEventListener('click', self.click, false);
    self.eventParent.removeEventListener('mousemove', self.mousemove);
    self.eventParent.removeEventListener('wheel', self.scrollWheel, false);
    self.canvas.removeEventListener('contextmenu', self.contextmenu, false);
    self.canvas.removeEventListener('copy', self.copy);
    self.controlInput.removeEventListener('copy', self.copy);
    self.controlInput.removeEventListener('cut', self.cut);
    self.controlInput.removeEventListener('paste', self.paste);
    self.controlInput.removeEventListener('keypress', self.keypress, false);
    self.controlInput.removeEventListener('keyup', self.keyup, false);
    self.controlInput.removeEventListener('keydown', self.keydown, false);
    window.removeEventListener('resize', self.resize);
    if (self.observer && self.observer.disconnect) {
      self.observer.disconnect();
    }
  };
  self.tryLoadStoredSettings = function () {
    var s;
    self.reloadStoredValues();
    if (
      self.storedSettings &&
      typeof self.storedSettings.orders === 'object' &&
      self.storedSettings.orders !== null
    ) {
      if (
        self.storedSettings.orders.rows.length >= (self.viewData || []).length
      ) {
        self.orders.rows = self.storedSettings.orders.rows;
      }
      s = self.getSchema();
      if (self.storedSettings.orders.columns.length === s.length) {
        self.orders.columns = self.storedSettings.orders.columns;
      }
      self.orderBy =
        self.storedSettings.orderBy === undefined
          ? s[0].name
          : self.storedSettings.orderBy;
      self.orderDirection =
        self.storedSettings.orderDirection === undefined
          ? 'asc'
          : self.storedSettings.orderDirection;
      if (
        self.storedSettings.orderBy !== undefined &&
        self.getHeaderByName(self.orderBy) &&
        self.orderDirection
      ) {
        self.order(self.orderBy, self.orderDirection);
      }
    }
  };
  self.getDomRoot = function () {
    return self.shadowRoot ? self.shadowRoot.host : self.parentNode;
  };
  self.getFontName = function (fontStyle) {
    return fontStyle.replace(/\d+\.?\d*px/, '');
  };
  self.getFontHeight = function (fontStyle) {
    return parseFloat(fontStyle, 10);
  };
  self.parseStyleValue = function (key) {
    if (/Font/.test(key)) {
      self.style[key + 'Height'] = self.getFontHeight(self.style[key]);
      self.style[key + 'Name'] = self.getFontName(self.style[key]);
      return;
    }
    // when inheriting styles from already instantiated grids, don't parse already parsed values.
    if (
      key === 'moveOverlayBorderSegments' &&
      typeof self.style[key] === 'string'
    ) {
      self.style[key] = self.style[key].split(',').map(function (i) {
        return parseInt(i, 10);
      });
    }
  };
  self.initProp = function (propName) {
    if (!self.args[propName]) {
      return;
    }
    Object.keys(self.args[propName]).forEach(function (key) {
      self[propName][key] = self.args[propName][key];
    });
  };
  self.getStyleProperty = function (key) {
    if (self.styleKeys.indexOf(key) === -1) {
      return self.parentNodeStyle[key];
    }
    return self.style[key];
  };
  self.setStyleProperty = function (key, value, supressDrawAndEvent) {
    var isDim =
      [
        'height',
        'width',
        'minHeight',
        'minWidth',
        'maxHeight',
        'maxWidth',
      ].indexOf(key) !== -1;
    if (self.styleKeys.indexOf(key) === -1) {
      self.parentNodeStyle[key] = value;
    } else {
      if (/-/.test(key)) {
        key = self.dehyphenateProperty(key);
      }
      self.style[key] = value;
      self.parseStyleValue(key);
    }
    if (isDim) {
      self.resize();
    }
    if (!supressDrawAndEvent) {
      self.draw(true);
      self.dispatchEvent('stylechanged', { name: 'style', value: value });
    }
  };
  self.reloadStoredValues = function () {
    if (self.attributes.name && self.attributes.saveAppearance) {
      try {
        self.storedSettings = localStorage.getItem(
          self.storageName + '-' + self.attributes.name,
        );
      } catch (e) {
        console.warn('Error loading stored values. ' + e.message);
        self.storedSettings = undefined;
      }
      if (self.storedSettings) {
        try {
          self.storedSettings = JSON.parse(self.storedSettings);
        } catch (e) {
          console.warn('could not read settings from localStore', e);
          self.storedSettings = undefined;
        }
      }
      if (self.storedSettings) {
        if (
          typeof self.storedSettings.sizes === 'object' &&
          self.storedSettings.sizes !== null
        ) {
          self.sizes.rows = self.storedSettings.sizes.rows;
          self.sizes.columns = self.storedSettings.sizes.columns;
          ['trees', 'columns', 'rows'].forEach(function (i) {
            if (!self.sizes[i]) {
              self.sizes[i] = {};
            }
          });
        }
        if (typeof self.storedSettings.visibility === 'object') {
          self.getSchema().forEach(function (column) {
            if (
              self.storedSettings.visibility &&
              self.storedSettings.visibility[column.name] !== undefined
            ) {
              column.hidden = !self.storedSettings.visibility[column.name];
            }
          });
        }
      }
    }
  };
  self.init = function () {
    if (self.initialized) {
      return;
    }
    function addStyleKeyIfNoneExists(key) {
      if (self.styleKeys.indexOf(key) === -1) {
        self.styleKeys.push(key);
      }
    }
    var publicStyleKeyIntf = {};
    self.setAttributes();
    self.setStyle();
    self.initScrollBox();
    self.setDom();
    self.nodeType = 'canvas-datagrid';
    self.ie = /Trident/.test(window.navigator.userAgent);
    self.edge = /Edge/.test(window.navigator.userAgent);
    self.webKit = /WebKit/.test(window.navigator.userAgent);
    self.moz = /Gecko/.test(window.navigator.userAgent);
    self.mobile = /Mobile/i.test(window.navigator.userAgent);
    self.blankValues = [undefined, null, ''];
    self.cursorGrab = 'grab';
    self.cursorGrabing = 'grabbing';
    self.cursorGrab = self.webKit ? '-webkit-grab' : self.cursorGrab;
    self.cursorGrabing = self.moz ? '-webkit-grabbing' : self.cursorGrabbing;
    self.pointerLockPosition = { x: 0, y: 0 };
    Object.keys(self.style).forEach(self.parseStyleValue);
    self.intf.moveSelection = self.moveSelection;
    self.intf.moveTo = self.moveTo;
    self.intf.addEventListener = self.addEventListener;
    self.intf.removeEventListener = self.removeEventListener;
    self.intf.dispatchEvent = self.dispatchEvent;
    /**
     * Releases grid resources and removes grid elements.
     * @memberof canvasDatagrid
     * @name dispose
     * @method
     */
    self.intf.dispose = self.dispose;
    /**
     * Appends the grid to another element later.  Not implemented.
     * @memberof canvasDatagrid
     * @name appendTo
     * @method
     * @param {number} el The element to append the grid to.
     */
    self.intf.appendTo = self.appendTo;
    self.intf.getVisibleCellByIndex = self.getVisibleCellByIndex;
    self.intf.filters = self.filters;
    self.intf.sorters = self.sorters;
    self.intf.autosize = self.autosize;
    self.intf.beginEditAt = self.beginEditAt;
    self.intf.endEdit = self.endEdit;
    self.intf.setActiveCell = self.setActiveCell;
    self.intf.forEachSelectedCell = self.forEachSelectedCell;
    self.intf.scrollIntoView = self.scrollIntoView;
    self.intf.clearChangeLog = self.clearChangeLog;
    self.intf.gotoCell = self.gotoCell;
    self.intf.gotoRow = self.gotoRow;
    self.intf.getHeaderByName = self.getHeaderByName;
    self.intf.findColumnScrollLeft = self.findColumnScrollLeft;
    self.intf.findRowScrollTop = self.findRowScrollTop;
    self.intf.fitColumnToValues = self.fitColumnToValues;
    self.intf.findColumnMaxTextLength = self.findColumnMaxTextLength;
    self.intf.disposeContextMenu = self.disposeContextMenu;
    self.intf.getCellAt = self.getCellAt;
    self.intf.isCellVisible = self.isCellVisible;
    self.intf.isRowVisible = self.isRowVisible;
    self.intf.isColumnVisible = self.isColumnVisible;
    self.intf.order = self.order;
    self.intf.draw = self.draw;
    self.intf.isComponent = self.isComponent;
    self.intf.selectArea = self.selectArea;
    self.intf.clipElement = self.clipElement;
    self.intf.getSchemaFromData = self.getSchemaFromData;
    self.intf.setFilter = self.setFilter;
    self.intf.selectRow = self.selectRow;
    self.intf.parentGrid = self.parentGrid;
    self.intf.toggleTree = self.toggleTree;
    self.intf.expandTree = self.expandTree;
    self.intf.collapseTree = self.collapseTree;
    self.intf.canvas = self.canvas;
    self.intf.context = self.ctx;
    self.intf.insertRow = self.insertRow;
    self.intf.deleteRow = self.deleteRow;
    self.intf.addRow = self.addRow;
    self.intf.insertColumn = self.insertColumn;
    self.intf.deleteColumn = self.deleteColumn;
    self.intf.addColumn = self.addColumn;
    self.intf.getClippingRect = self.getClippingRect;
    self.intf.setRowHeight = self.setRowHeight;
    self.intf.setColumnWidth = self.setColumnWidth;
    self.intf.resetColumnWidths = self.resetColumnWidths;
    self.intf.resetRowHeights = self.resetRowHeights;
    self.intf.resize = self.resize;
    self.intf.selectColumn = self.selectColumn;
    self.intf.selectRow = self.selectRow;
    self.intf.selectAll = self.selectAll;
    self.intf.selectNone = self.selectNone;
    self.intf.drawChildGrids = self.drawChildGrids;
    self.intf.assertPxColor = self.assertPxColor;
    self.intf.clearPxColorAssertions = self.clearPxColorAssertions;
    self.intf.integerToAlpha = self.integerToAlpha;
    self.intf.copy = self.copy;
    self.intf.paste = self.paste;
    self.intf.setStyleProperty = self.setStyleProperty;
    Object.defineProperty(self.intf, 'defaults', {
      get: function () {
        return {
          styles: self.defaults.styles.reduce(function (a, i) {
            a[i[0]] = i[1];
            return a;
          }, {}),
          attributes: self.defaults.attributes.reduce(function (a, i) {
            a[i[0]] = i[1];
            return a;
          }, {}),
        };
      },
    });
    self.styleKeys = Object.keys(self.intf.defaults.styles);
    self.styleKeys
      .map(function (i) {
        return self.hyphenateProperty(i, false);
      })
      .forEach(addStyleKeyIfNoneExists);
    self.styleKeys
      .map(function (i) {
        return self.hyphenateProperty(i, true);
      })
      .forEach(addStyleKeyIfNoneExists);
    self.DOMStyles = window.getComputedStyle(document.body, null);
    self.styleKeys.concat(Object.keys(self.DOMStyles)).forEach(function (key) {
      // unless this line is here, Object.keys() will not work on <instance>.style
      publicStyleKeyIntf[key] = undefined;
      Object.defineProperty(publicStyleKeyIntf, key, {
        get: function () {
          return self.getStyleProperty(key);
        },
        set: function (value) {
          if (self.initialized) {
            self.appliedInlineStyles[key] = value;
          }
          self.setStyleProperty(key, value);
        },
      });
    });
    Object.defineProperty(self.intf, 'shadowRoot', {
      get: function () {
        return self.shadowRoot;
      },
    });
    Object.defineProperty(self.intf, 'activeCell', {
      get: function () {
        return self.activeCell;
      },
    });
    Object.defineProperty(self.intf, 'hasFocus', {
      get: function () {
        return self.hasFocus;
      },
    });
    Object.defineProperty(self.intf, 'style', {
      get: function () {
        return publicStyleKeyIntf;
      },
      set: function (valueObject) {
        Object.keys(valueObject).forEach(function (key) {
          self.setStyleProperty(key, valueObject[key], true);
        });
        self.draw(true);
        self.dispatchEvent('stylechanged', {
          name: 'style',
          value: valueObject,
        });
      },
    });
    Object.defineProperty(self.intf, 'attributes', { value: {} });
    Object.keys(self.attributes).forEach(function (key) {
      Object.defineProperty(self.intf.attributes, key, {
        get: function () {
          return self.attributes[key];
        },
        set: function (value) {
          self.attributes[key] = value;
          if (key === 'name') {
            self.tryLoadStoredSettings();
          }
          self.draw(true);
          self.dispatchEvent('attributechanged', {
            name: key,
            value: value[key],
          });
        },
      });
    });
    self.filters.string = function (value, filterFor) {
      if (filterFor === self.attributes.blanksText) {
        return self.blankValues.includes(
          value == null ? value : String(value).trim(),
        );
      }

      value = String(value);
      var filterRegExp,
        regEnd = /\/(i|g|m)*$/,
        pattern = regEnd.exec(filterFor),
        flags = pattern ? pattern[0].substring(1) : '',
        flagLength = flags.length;
      self.invalidFilterRegEx = undefined;
      if (filterFor.substring(0, 1) === '/' && pattern) {
        try {
          filterRegExp = new RegExp(
            filterFor.substring(1, filterFor.length - (flagLength + 1)),
            flags,
          );
        } catch (e) {
          self.invalidFilterRegEx = e;
          return;
        }
        return filterRegExp.test(value);
      }
      return value.toString
        ? value
            .toString()
            .toLocaleUpperCase()
            .indexOf(filterFor.toLocaleUpperCase()) !== -1
        : false;
    };
    self.filters.number = function (value, filterFor) {
      if (filterFor === self.attributes.blanksText) {
        return self.blankValues.includes(
          value == null ? value : String(value).trim(),
        );
      }

      if (!filterFor) {
        return true;
      }
      return value === filterFor;
    };
    ['formatters', 'filters', 'sorters'].forEach(self.initProp);
    self.applyComponentStyle(false, self.intf);
    self.reloadStoredValues();
    if (self.args.data) {
      self.intf.data = self.args.data;
    }
    if (self.intf.innerText || self.intf.textContent) {
      if (self.intf.dataType === 'application/x-canvas-datagrid') {
        self.intf.dataType = 'application/json+x-canvas-datagrid';
      }
      self.intf.data = self.intf.innerText || self.intf.textContent;
    }
    if (self.args.schema) {
      self.intf.schema = self.args.schema;
    }
    if (self.isChildGrid || !self.isComponent) {
      requestAnimationFrame(function () {
        self.resize(true);
      });
    } else {
      self.resize(true);
    }
    self.initialized = true;
    return self;
  };
  /**
   * Removes focus from the grid.
   * @memberof canvasDatagrid
   * @name blur
   * @method
   */
  self.intf.blur = function (e) {
    self.hasFocus = false;
  };
  /**
   * Focuses on the grid.
   * @memberof canvasDatagrid
   * @name focus
   * @method
   */
  self.intf.focus = function () {
    self.hasFocus = true;
    self.controlInput.focus();
  };
  if (self.shadowRoot || self.isChildGrid) {
    Object.defineProperty(self.intf, 'height', {
      get: function () {
        if (self.shadowRoot) {
          return self.shadowRoot.height;
        }
        return self.parentNode.height;
      },
      set: function (value) {
        if (self.shadowRoot) {
          self.shadowRoot.height = value;
        } else {
          self.parentNode.height = value;
        }
        self.resize(true);
      },
    });
    Object.defineProperty(self.intf, 'width', {
      get: function () {
        if (self.shadowRoot) {
          return self.shadowRoot.width;
        }
        return self.parentNode.width;
      },
      set: function (value) {
        if (self.shadowRoot) {
          self.shadowRoot.width = value;
        } else {
          self.parentNode.width = value;
        }
        self.resize(true);
      },
    });
    Object.defineProperty(self.intf, 'parentNode', {
      get: function () {
        return self.parentNode;
      },
      set: function (value) {
        if (!self.isChildGrid) {
          throw new TypeError(
            'Cannot set property parentNode which has only a getter',
          );
        }
        self.parentNode = value;
      },
    });
  }
  Object.defineProperty(self.intf, 'visibleRowHeights', {
    get: function () {
      return self.visibleRowHeights;
    },
  });
  Object.defineProperty(self.intf, 'openChildren', {
    get: function () {
      return self.openChildren;
    },
  });
  Object.defineProperty(self.intf, 'childGrids', {
    get: function () {
      return Object.keys(self.childGrids).map(function (gridId) {
        return self.childGrids[gridId];
      });
    },
  });
  Object.defineProperty(self.intf, 'isChildGrid', {
    get: function () {
      return self.isChildGrid;
    },
  });
  Object.defineProperty(self, 'cursor', {
    get: function () {
      return self.parentNodeStyle.cursor;
    },
    set: function (value) {
      if (value === 'cell') {
        value = 'default';
      }
      if (self.currentCursor !== value) {
        self.parentNodeStyle.cursor = value;
        self.currentCursor = value;
      }
    },
  });
  Object.defineProperty(self.intf, 'orderDirection', {
    get: function () {
      return self.orderDirection;
    },
    set: function (value) {
      if (value !== 'desc') {
        value = 'asc';
      }
      self.orderDirection = value;
      self.order(self.orderBy, self.orderDirection);
    },
  });
  Object.defineProperty(self.intf, 'orderBy', {
    get: function () {
      return self.orderBy;
    },
    set: function (value) {
      if (
        self.getSchema().find(function (col) {
          return col.name === value;
        }) === undefined
      ) {
        throw new Error('Cannot sort by unknown column name.');
      }
      self.orderBy = value;
      self.order(self.orderBy, self.orderDirection);
    },
  });
  if (self.isComponent) {
    Object.defineProperty(self.intf, 'offsetHeight', {
      get: function () {
        return self.canvas.offsetHeight;
      },
    });
    Object.defineProperty(self.intf, 'offsetWidth', {
      get: function () {
        return self.canvas.offsetWidth;
      },
    });
  }
  Object.defineProperty(self.intf, 'scrollHeight', {
    get: function () {
      return self.scrollBox.scrollHeight;
    },
  });
  Object.defineProperty(self.intf, 'scrollWidth', {
    get: function () {
      return self.scrollBox.scrollWidth;
    },
  });
  Object.defineProperty(self.intf, 'scrollTop', {
    get: function () {
      return self.scrollBox.scrollTop;
    },
    set: function (value) {
      self.scrollBox.scrollTop = value;
    },
  });
  Object.defineProperty(self.intf, 'scrollLeft', {
    get: function () {
      return self.scrollBox.scrollLeft;
    },
    set: function (value) {
      self.scrollBox.scrollLeft = value;
    },
  });
  Object.defineProperty(self.intf, 'sizes', {
    get: function () {
      return self.sizes;
    },
  });
  Object.defineProperty(self.intf, 'parentDOMNode', {
    get: function () {
      return self.parentDOMNode;
    },
  });
  Object.defineProperty(self.intf, 'input', {
    get: function () {
      return self.input;
    },
  });
  Object.defineProperty(self.intf, 'controlInput', {
    get: function () {
      return self.controlInput;
    },
  });
  Object.defineProperty(self.intf, 'currentCell', {
    get: function () {
      return self.currentCell;
    },
  });
  Object.defineProperty(self.intf, 'visibleCells', {
    get: function () {
      return self.visibleCells;
    },
  });
  Object.defineProperty(self.intf, 'visibleRows', {
    get: function () {
      return self.visibleRows;
    },
  });
  Object.defineProperty(self.intf, 'selections', {
    get: function () {
      return self.selections;
    },
  });
  Object.defineProperty(self.intf, 'dragMode', {
    get: function () {
      return self.dragMode;
    },
  });
  Object.defineProperty(self.intf, 'changes', {
    get: function () {
      return self.changes;
    },
  });
  self.intf.formatters = self.formatters;
  Object.defineProperty(self.intf, 'dataType', {
    get: function () {
      return self.dataType;
    },
    set: function (value) {
      if (!self.parsers[value]) {
        throw new Error('No parser for MIME type ' + value);
      }
      self.dataType = value;
    },
  });
  self.eventNames.forEach(function (eventName) {
    Object.defineProperty(self.intf, 'on' + eventName, {
      get: function () {
        return self.componentL1Events[eventName];
      },
      set: function (value) {
        self.events[eventName] = [];
        self.componentL1Events[eventName] = value;
        if (!value) {
          return;
        }
        self.addEventListener(eventName, value);
      },
    });
  });
  Object.defineProperty(self.intf, 'frozenRow', {
    get: function () {
      return self.frozenRow;
    },
    set: function (val) {
      if (isNaN(val)) {
        throw new TypeError('Expected value for frozenRow to be a number.');
      }
      if (self.visibleRows.length < val) {
        throw new RangeError(
          'Cannot set a value larger than the number of visible rows.',
        );
      }
      self.frozenRow = val;
    },
  });
  Object.defineProperty(self.intf, 'frozenColumn', {
    get: function () {
      return self.frozenColumn;
    },
    set: function (val) {
      if (isNaN(val)) {
        throw new TypeError('Expected value for frozenRow to be a number.');
      }
      if (self.getVisibleSchema().length < val) {
        throw new RangeError(
          'Cannot set a value larger than the number of visible columns.',
        );
      }
      self.frozenColumn = val;
    },
  });
  Object.defineProperty(self.intf, 'scrollIndexRect', {
    get: function () {
      return {
        top: self.scrollIndexTop,
        right: self.scrollIndexRight,
        bottom: self.scrollIndexBottom,
        left: self.scrollIndexLeft,
      };
    },
  });
  Object.defineProperty(self.intf, 'scrollPixelRect', {
    get: function () {
      return {
        top: self.scrollPixelTop,
        right: self.scrollPixelRight,
        bottom: self.scrollPixelBottom,
        left: self.scrollPixelLeft,
      };
    },
  });
  Object.defineProperty(self.intf, 'rowOrder', {
    get: function () {
      return self.orders.rows;
    },
    set: function (val) {
      if (!Array.isArray(val)) {
        throw new TypeError('Value must be an array.');
      }
      if (!self.originalData || val.length < self.originalData.length) {
        throw new RangeError(
          'Array length must be equal to or greater than number of rows.',
        );
      }
      self.orders.rows = val;
    },
  });
  Object.defineProperty(self.intf, 'columnOrder', {
    get: function () {
      return self.orders.columns;
    },
    set: function (val) {
      if (!Array.isArray(val)) {
        throw new TypeError('Value must be an array.');
      }
      if (val.length < self.getSchema().length) {
        throw new RangeError(
          'Array length must be equal to or greater than number of columns.',
        );
      }
      self.orders.columns = val;
    },
  });
  Object.defineProperty(self.intf, 'selectionBounds', {
    get: function () {
      return self.getSelectionBounds();
    },
  });
  Object.defineProperty(self.intf, 'selectedRows', {
    get: function () {
      return self.getSelectedData(true);
    },
  });
  Object.defineProperty(self.intf, 'selectedCells', {
    get: function () {
      return self.getSelectedData();
    },
  });
  Object.defineProperty(self.intf, 'visibleSchema', {
    get: function () {
      return self.getVisibleSchema().map(function eachDataRow(col) {
        return col;
      });
    },
  });
  Object.defineProperty(self.intf, 'treeGridAttributes', {
    get: function () {
      return self.treeGridAttributes;
    },
    set: function setTreeGridAttributes(value) {
      self.treeGridAttributes = value;
    },
  });
  Object.defineProperty(self.intf, 'cellGridAttributes', {
    get: function () {
      return self.cellGridAttributes;
    },
    set: function setCellGridAttributes(value) {
      self.cellGridAttributes = value;
    },
  });
  Object.defineProperty(self.intf, 'ctx', {
    get: function () {
      return self.ctx;
    },
  });
  Object.defineProperty(self.intf, 'schema', {
    get: function schemaGetter() {
      return self.getSchema();
    },
    set: function schemaSetter(value) {
      if (value === undefined) {
        // Issue #89 - allow schema to be set to initialized state
        self.schema = undefined;
        self.tempSchema = undefined;
        self.dispatchEvent('schemachanged', { schema: undefined });
        return;
      }
      if (!Array.isArray(value) || typeof value[0] !== 'object') {
        throw new Error('Schema must be an array of objects.');
      }
      if (value[0].name === undefined) {
        throw new Error(
          'Expected schema to contain an object with at least a name property.',
        );
      }
      self.schema = value.map(function eachSchemaColumn(column, index) {
        column.width = column.width || self.style.cellWidth;
        column.filter = column.filter || self.filter(column.type);
        column.type = column.type || 'string';
        column.index = index;
        column.columnIndex = index;
        column.rowIndex = -1;
        return column;
      });
      self.tempSchema = undefined;
      self.createNewRowData();
      self.createColumnOrders();
      self.tryLoadStoredSettings();
      if (
        self.storedSettings &&
        typeof self.storedSettings.visibility === 'object'
      ) {
        self.schema.forEach(function hideEachSchemaColumn(column, index) {
          if (
            self.storedSettings &&
            self.storedSettings.visibility[column.name] !== undefined
          ) {
            column.hidden = !self.storedSettings.visibility[column.name];
          }
        });
      }
      self.resize(true);
      self.dispatchEvent('schemachanged', { schema: self.schema });
    },
  });
  /**
   * Gets an array of currently registered MIME types.
   * @memberof canvasDatagrid
   * @name getDataTypes
   * @method
   */
  self.intf.getTypes = function () {
    return Object.keys(self.parsers);
  };
  self.parseInnerHtml = function (data) {
    if (!data || /^ +$/.test(data)) {
      return [];
    }
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.warn(
        Error(
          'Cannot parse application/json+x-canvas-datagrid formated data. ' +
            e.message +
            '  \nNote: canvas-datagrid.innerHTML is for string data only.  ' +
            'Use the canvas-datagrid.data property to set object data.',
        ),
      );
    }
    return data;
  };
  self.parsers['application/json+x-canvas-datagrid'] = function (
    data,
    callback,
  ) {
    self.parsers['application/x-canvas-datagrid'](
      self.parseInnerHtml(data),
      function (data, schema) {
        return callback(data, schema);
      },
    );
  };
  self.parsers['application/x-canvas-datagrid'] = function (data, callback) {
    return callback(data);
  };
  self.intf.parsers = self.parsers;
  // send to dataType ETL function to extract from input data
  // and transform into native [{}, {}] format
  self.etl = function (data, callback) {
    if (!self.intf.parsers[self.dataType]) {
      throw new Error('Unsupported data type.');
    }
    self.intf.parsers[self.dataType](data, function (data, schema) {
      // set the unfiltered/sorted data array
      self.originalData = data;
      self.viewData = Array.from(self.originalData);

      if (Array.isArray(schema)) {
        self.schema = schema;
      }
      // Issue #89 - allow schema to be auto-created every time data is set
      if (self.attributes.autoGenerateSchema) {
        self.schema = self.getSchemaFromData(data);
      }
      if (!self.schema) {
        self.tempSchema = self.getSchemaFromData(data);
      }
      if (self.getSchema()) {
        self.createColumnOrders();
      }
      // apply filter, sort, etc to incoming dataset, set viewData:
      self.refresh();
      // empty data was set
      if (!self.schema && (self.originalData || []).length === 0) {
        self.tempSchema = [{ name: '' }];
      }
      self.fitColumnToValues('cornerCell', true);
      if (
        (self.tempSchema && !self.schema) ||
        self.attributes.autoGenerateSchema
      ) {
        self.createColumnOrders();
        self.dispatchEvent('schemachanged', { schema: self.tempSchema });
      }
      callback();
    });
  };
  Object.defineProperty(self.intf, 'viewData', {
    get: function () {
      return self.viewData;
    },
  });
  Object.defineProperty(self.intf, 'boundData', {
    get: function () {
      return self.originalData;
    },
  });
  Object.defineProperty(self.intf, 'data', {
    get: function dataGetter() {
      return self.originalData;
    },
    set: function dataSetter(value) {
      self.etl(value, function () {
        self.changes = [];
        self.createNewRowData();
        if (
          self.attributes.autoResizeColumns &&
          self.originalData.length > 0 &&
          self.storedSettings === undefined
        ) {
          self.autosize();
        }
        // set the header column to fit the numbers in it
        self.fitColumnToValues('cornerCell', true);
        self.createRowOrders();
        self.tryLoadStoredSettings();
        self.dispatchEvent('datachanged', { data: self.originalData });
        self.resize(true);
      });
    },
  });
  self.initScrollBox = function () {
    var sHeight = 0,
      sWidth = 0,
      scrollTop = 0,
      scrollLeft = 0,
      scrollHeight = 0,
      scrollWidth = 0,
      scrollBoxHeight = 20,
      scrollBoxWidth = 20;
    function setScrollTop(value, preventScrollEvent) {
      if (isNaN(value)) {
        throw new Error('ScrollTop value must be a number');
      }
      if (value < 0) {
        value = 0;
      }
      if (value > scrollHeight) {
        value = scrollHeight;
      }
      if (scrollHeight < 0) {
        value = 0;
      }
      scrollTop = value;
      if (!preventScrollEvent) {
        self.scroll();
      }
    }
    function setScrollLeft(value, preventScrollEvent) {
      if (isNaN(value)) {
        throw new Error('ScrollLeft value must be a number');
      }
      if (value < 0) {
        value = 0;
      }
      if (value > scrollWidth) {
        value = scrollWidth;
      }
      if (scrollWidth < 0) {
        value = 0;
      }
      scrollLeft = value;
      if (!preventScrollEvent) {
        self.scroll();
      }
    }
    self.scrollBox.toString = function () {
      return (
        '{"width": ' +
        scrollWidth.toFixed(2) +
        ', "height": ' +
        scrollHeight.toFixed(2) +
        ', "left": ' +
        scrollLeft.toFixed(2) +
        ', "top": ' +
        scrollTop.toFixed(2) +
        ', "widthRatio": ' +
        self.scrollBox.widthBoxRatio.toFixed(5) +
        ', "heightRatio": ' +
        self.scrollBox.heightBoxRatio.toFixed(5) +
        '}'
      );
    };
    self.scrollBox.scrollTo = function (x, y, supressDrawEvent) {
      setScrollLeft(x, true);
      setScrollTop(y, supressDrawEvent);
    };
    Object.defineProperty(self.scrollBox, 'scrollBoxHeight', {
      get: function () {
        return scrollBoxHeight;
      },
      set: function (value) {
        scrollBoxHeight = value;
      },
    });
    Object.defineProperty(self.scrollBox, 'scrollBoxWidth', {
      get: function () {
        return scrollBoxWidth;
      },
      set: function (value) {
        scrollBoxWidth = value;
      },
    });
    Object.defineProperty(self.scrollBox, 'height', {
      get: function () {
        return sHeight;
      },
      set: function (value) {
        sHeight = value;
      },
    });
    Object.defineProperty(self.scrollBox, 'width', {
      get: function () {
        return sWidth;
      },
      set: function (value) {
        sWidth = value;
      },
    });
    Object.defineProperty(self.scrollBox, 'scrollTop', {
      get: function () {
        return scrollTop;
      },
      set: setScrollTop,
    });
    Object.defineProperty(self.scrollBox, 'scrollLeft', {
      get: function () {
        return scrollLeft;
      },
      set: setScrollLeft,
    });
    Object.defineProperty(self.scrollBox, 'scrollHeight', {
      get: function () {
        return scrollHeight;
      },
      set: function (value) {
        if (scrollTop > value) {
          scrollTop = Math.max(value, 0);
        }
        scrollHeight = value;
      },
    });
    Object.defineProperty(self.scrollBox, 'scrollWidth', {
      get: function () {
        return scrollWidth;
      },
      set: function (value) {
        if (scrollLeft > value) {
          scrollLeft = Math.max(value, 0);
        }
        scrollWidth = value;
      },
    });
  };
  return;
}
