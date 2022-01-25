/*jslint browser: true, unparam: true, todo: true, plusplus: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
'use strict';

import isPrintableKeyEvent from 'is-printable-key-event';
import { isSupportedHtml, parseData } from './util';

export default function (self) {
  var wheeling;
  self.stopPropagation = function (e) {
    e.stopPropagation();
  };
  /**
   * Adds an event listener to the given event.
   * @memberof canvasDatagrid
   * @name addEventListener
   * @method
   * @param {string} ev The name of the event to subscribe to.
   * @param {function} fn The event procedure to execute when the event is raised.
   */
  self.addEventListener = function (ev, fn) {
    self.events[ev] = self.events[ev] || [];
    self.events[ev].unshift(fn);
  };
  /**
   * Removes the given listener function from the given event.  Must be an actual reference to the function that was bound.
   * @memberof canvasDatagrid
   * @name removeEventListener
   * @method
   * @param {string} ev The name of the event to unsubscribe from.
   * @param {function} fn The event procedure to execute when the event is raised.
   */
  self.removeEventListener = function (ev, fn) {
    (self.events[ev] || []).forEach(function removeEachListener(sfn, idx) {
      if (fn === sfn) {
        self.events[ev].splice(idx, 1);
      }
    });
  };
  /**
   * Fires the given event, passing an event object to the event subscribers.
   * @memberof canvasDatagrid
   * @name dispatchEvent
   * @method
   * @param {number} ev The name of the event to dispatch.
   * @param {number} e The event object.
   */
  self.dispatchEvent = function (ev, e) {
    e = ev.type ? ev : e || {};
    ev = ev.type || ev;
    var defaultPrevented;
    function preventDefault() {
      defaultPrevented = true;
    }
    if (!self.events[ev]) {
      return;
    }
    self.events[ev].forEach(function dispatchEachEvent(fn) {
      e.ctx = self.ctx;
      e.preventDefault = preventDefault;
      fn.apply(self.intf, [e]);
    });
    return defaultPrevented;
  };
  self.getRatio = function () {
    return Math.min(
      self.attributes.maxPixelRatio,
      (window.devicePixelRatio || 1) /
        (self.ctx.webkitBackingStorePixelRatio ||
          self.ctx.mozBackingStorePixelRatio ||
          self.ctx.msBackingStorePixelRatio ||
          self.ctx.oBackingStorePixelRatio ||
          self.ctx.backingStorePixelRatio ||
          1),
    );
  };
  self.resize = function (drawAfterResize) {
    if (!self.canvas) {
      return;
    }
    var x,
      v = {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        style: 'vertical-scroll-bar',
      },
      n = {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        style: 'horizontal-scroll-bar',
      },
      vb = {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        style: 'vertical-scroll-box',
      },
      nb = {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        style: 'horizontal-scroll-box',
      },
      co = {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        isCorner: true,
        isScrollBoxCorner: true,
        style: 'scroll-box-corner',
      },
      m = self.style.scrollBarBoxMargin * 2,
      b = self.style.scrollBarBorderWidth * 2,
      d = self.style.scrollBarBoxMargin * 0.5,
      sbw = self.style.scrollBarWidth + self.style.scrollBarBorderWidth * 2,
      ratio = self.getRatio(),
      bm = self.style.gridBorderCollapse === 'collapse' ? 1 : 2,
      cellBorder = self.style.cellBorderWidth * bm,
      columnHeaderCellBorder = self.style.columnHeaderCellBorderWidth * bm,
      dataHeight = 0,
      dataWidth = 0,
      dims,
      l = (self.viewData || []).length,
      columnHeaderCellHeight = self.getColumnHeaderCellHeight(),
      rowHeaderCellWidth = self.getRowHeaderCellWidth(),
      topGroupAreaHeight = self.getColumnGroupAreaHeight(),
      leftGroupAreaWidth = self.getRowGroupAreaWidth(),
      ch = self.style.cellHeight,
      s = self.getSchema();
    // sets actual DOM canvas element
    function checkScrollBoxVisibility() {
      self.scrollBox.horizontalBarVisible =
        (self.style.width !== 'auto' &&
          dataWidth > self.scrollBox.width &&
          self.style.overflowX !== 'hidden') ||
        self.style.overflowX === 'scroll';
      self.scrollBox.horizontalBoxVisible = dataWidth > self.scrollBox.width;
      self.scrollBox.verticalBarVisible =
        (self.style.height !== 'auto' &&
          dataHeight > self.scrollBox.height &&
          self.style.overflowY !== 'hidden') ||
        self.style.overflowY === 'scroll';
      self.scrollBox.verticalBoxVisible = dataHeight > self.scrollBox.height;
    }
    function setScrollBoxSize() {
      self.scrollBox.width =
        self.width - rowHeaderCellWidth - leftGroupAreaWidth;
      self.scrollBox.height =
        self.height - columnHeaderCellHeight - topGroupAreaHeight;
    }
    function setCanvasSize() {
      if (self.isChildGrid) {
        return;
      }
      dims = {
        // HACK +1 ? maybe it's a magic cell border?  Required to line up properly in auto height mode.
        height:
          columnHeaderCellHeight +
          topGroupAreaHeight +
          dataHeight +
          cellBorder +
          1,
        width: dataWidth + rowHeaderCellWidth + cellBorder + leftGroupAreaWidth,
      };
      ['width', 'height'].forEach(function (dim) {
        //TODO: support inherit
        if (
          ['auto', undefined].indexOf(self.style[dim]) !== -1 &&
          ['auto', undefined].indexOf(self.appliedInlineStyles[dim]) !== -1
        ) {
          self.parentNodeStyle[dim] = dims[dim] + 'px';
        } else if (
          ['auto', undefined].indexOf(self.style[dim]) == -1 &&
          ['auto', undefined].indexOf(self.appliedInlineStyles[dim]) == -1
        ) {
          self.parentNodeStyle[dim] = self.style[dim];
          if (self.isComponent) {
            self.canvas.style[dim] = self.style[dim];
          }
        }
      });
    }
    self.scrollCache.x = [];
    self.scrollCache.y = [];
    for (x = 0; x < l; x += 1) {
      self.scrollCache.y[x] = dataHeight;
      dataHeight +=
        ((self.sizes.rows[x] || ch) + (self.sizes.trees[x] || 0)) * self.scale +
        // HACK? if an expanded tree row is frozen it is necessary to add the tree row's height a second time.
        (self.frozenRow > x ? self.sizes.trees[x] || 0 : 0);
    }
    if (l > 1) {
      self.scrollCache.y[x] = dataHeight;
    }
    const collapsedColumnGroups = self.getCollapsedColumnGroups();
    const isColumnCollapsed = (columnIndex) =>
      collapsedColumnGroups.findIndex(
        (group) => columnIndex >= group.from && columnIndex <= group.to,
      ) >= 0;
    /** @type {number} it will be used in `reduceSchema` only  */
    let frozenWidth = 0;
    dataWidth =
      s.reduce(function reduceSchema(accumulator, column, columnIndex) {
        // intentional redefintion of column.  This causes scrollCache to be in the correct order
        const schemaIndex = self.orders.columns[columnIndex];
        const columnWidth = self.getColumnWidth(schemaIndex);
        column = s[schemaIndex];
        if (!column.hidden && !isColumnCollapsed(columnIndex))
          accumulator += columnWidth;
        if (columnIndex < self.frozenColumn) {
          self.scrollCache.x[columnIndex] = accumulator;
          frozenWidth = accumulator;
        } else {
          self.scrollCache.x[columnIndex] = Math.max(
            frozenWidth + columnWidth,
            accumulator,
          );
        }
        return accumulator;
      }, 0) || 0;
    if (self.attributes.showNewRow) {
      dataHeight += ch;
    }
    if (self.attributes.snapToRow) {
      dataHeight += self.style.cellHeight;
    }
    setCanvasSize();
    if (self.isChildGrid) {
      self.width = self.parentNode.offsetWidth;
      self.height = self.parentNode.offsetHeight;
    } else if (
      self.height !== self.canvas.offsetHeight ||
      self.width !== self.canvas.offsetWidth
    ) {
      self.height = self.canvas.offsetHeight;
      self.width = self.canvas.offsetWidth;
      self.canvasOffsetLeft = self.args.canvasOffsetLeft || 0;
      self.canvasOffsetTop = self.args.canvasOffsetTop || 0;
    }
    /// calculate scroll bar dimensions
    // non-controversial
    self.scrollBox.top =
      columnHeaderCellHeight + topGroupAreaHeight + columnHeaderCellBorder;
    self.scrollBox.left = rowHeaderCellWidth + leftGroupAreaWidth;
    // width and height of scroll box
    setScrollBoxSize();
    // is the data larger than the scroll box
    checkScrollBoxVisibility();
    // if the scroll box is visible, make room for it by expanding the size of the element
    // if the other dimension is set to auto
    if (self.scrollBox.horizontalBarVisible) {
      if (self.style.height === 'auto' && !self.isChildGrid) {
        self.height += sbw;
      }
      dataHeight += sbw;
      setCanvasSize();
      setScrollBoxSize();
      checkScrollBoxVisibility();
    }
    if (self.scrollBox.verticalBarVisible) {
      if (self.style.width === 'auto' && !self.isChildGrid) {
        self.width += sbw;
      }
      dataWidth += sbw;
      setCanvasSize();
      setScrollBoxSize();
      checkScrollBoxVisibility();
    }
    // set again after bar visibility checks
    setScrollBoxSize();
    self.scrollBox.scrollWidth = dataWidth - self.scrollBox.width;
    self.scrollBox.scrollHeight = dataHeight - self.scrollBox.height;
    if (self.frozenColumn > 0) {
      self.scrollBox.widthBoxRatio =
        (self.scrollBox.width - self.scrollCache.x[self.frozenColumn - 1]) /
        dataWidth;
    } else {
      self.scrollBox.widthBoxRatio = self.scrollBox.width / dataWidth;
    }
    self.scrollBox.scrollBoxWidth =
      self.scrollBox.width * self.scrollBox.widthBoxRatio -
      self.style.scrollBarWidth -
      b -
      d;
    // TODO: This heightBoxRatio number is terribly wrong.
    // They should be a result of the size of the grid/canvas?
    // it being off causes the scroll bar to "slide" under
    // the dragged mouse.
    // https://github.com/TonyGermaneri/canvas-datagrid/issues/97
    self.scrollBox.heightBoxRatio =
      (self.scrollBox.height -
        columnHeaderCellHeight -
        topGroupAreaHeight -
        self.scrollCache.y[self.frozenRow]) /
      dataHeight;
    self.scrollBox.scrollBoxHeight =
      self.scrollBox.height * self.scrollBox.heightBoxRatio -
      self.style.scrollBarWidth -
      b -
      d;
    self.scrollBox.scrollBoxWidth = Math.max(
      self.scrollBox.scrollBoxWidth,
      self.style.scrollBarBoxMinSize,
    );
    self.scrollBox.scrollBoxHeight = Math.max(
      self.scrollBox.scrollBoxHeight,
      self.style.scrollBarBoxMinSize,
    );
    // horizontal
    n.x += rowHeaderCellWidth;
    n.y += self.height - self.style.scrollBarWidth - d - topGroupAreaHeight;
    n.width =
      self.width -
      self.style.scrollBarWidth -
      rowHeaderCellWidth -
      leftGroupAreaWidth -
      d -
      m;
    n.height = self.style.scrollBarWidth + self.style.scrollBarBorderWidth + d;
    // horizontal box
    nb.y = n.y + self.style.scrollBarBoxMargin;
    nb.width = self.scrollBox.scrollBoxWidth;
    nb.height = self.style.scrollBarBoxWidth;
    // vertical
    v.x +=
      self.width -
      leftGroupAreaWidth -
      self.style.scrollBarWidth -
      self.style.scrollBarBorderWidth -
      d;
    v.y += columnHeaderCellHeight + self.scrollCache.y[self.frozenRow];
    v.width = self.style.scrollBarWidth + self.style.scrollBarBorderWidth + d;
    v.height =
      self.height -
      columnHeaderCellHeight -
      topGroupAreaHeight -
      self.style.scrollBarWidth -
      d -
      m;
    // vertical box
    vb.x = v.x + self.style.scrollBarBoxMargin;
    vb.y += self.scrollCache.y[self.frozenRow];
    vb.width = self.style.scrollBarBoxWidth;
    vb.height = self.scrollBox.scrollBoxHeight;
    // corner
    co.x = n.x + n.width + m;
    co.y = v.y + v.height + m;
    co.width = self.style.scrollBarWidth + self.style.scrollBarBorderWidth;
    co.height = self.style.scrollBarWidth + self.style.scrollBarBorderWidth;
    self.scrollBox.entities = {
      horizontalBar: n,
      horizontalBox: nb,
      verticalBar: v,
      verticalBox: vb,
      corner: co,
    };
    self.scrollBox.bar = {
      v: v,
      h: n,
    };
    self.scrollBox.box = {
      v: vb,
      h: nb,
    };
    /// calculate page and dom elements
    self.page = Math.max(
      1,
      self.visibleRows.length - 3 - self.attributes.pageUpDownOverlap,
    );
    // set canvas drawing related items
    if (!self.isChildGrid) {
      self.canvas.width = self.width * ratio;
      self.canvas.height = self.height * ratio;
      self.ctx.scale(ratio, ratio);
    }
    // resize any open dom elements (input/textarea)
    self.resizeEditInput();
    self.scroll(true);
    if (drawAfterResize) {
      self.draw(true);
    }
    self.dispatchEvent('resize', {});
    return true;
  };
  self.scroll = function (dontDraw) {
    var s = self.getSchema(),
      l = (self.viewData || []).length,
      ch = self.style.cellHeight;
    // go too far in leaps, then get focused
    self.scrollIndexTop = Math.floor(
      l * (self.scrollBox.scrollTop / self.scrollBox.scrollHeight) - 100,
    );
    self.scrollIndexTop = Math.max(self.scrollIndexTop, 0);
    self.scrollPixelTop = self.scrollCache.y[self.scrollIndexTop];
    // sometimes the grid is rendered but the height is zero
    if (self.scrollBox.scrollHeight === 0) {
      self.scrollIndexTop = 0;
    }
    self.scrollPixelTop = 0;
    self.scrollIndexLeft = self.frozenColumn;
    self.scrollPixelLeft = 0;
    while (
      self.scrollPixelTop < self.scrollBox.scrollTop &&
      self.scrollIndexTop < self.viewData.length
    ) {
      // start on index +1 since index 0 was used in "go too far" section above
      self.scrollIndexTop += 1;
      self.scrollPixelTop = self.scrollCache.y[self.scrollIndexTop];
    }
    while (
      self.scrollPixelLeft < self.scrollBox.scrollLeft + 1 &&
      self.scrollIndexLeft < s.length
    ) {
      self.scrollPixelLeft = self.scrollCache.x[self.scrollIndexLeft];
      self.scrollIndexLeft += 1;
    }
    if (s.length > 0) {
      self.scrollIndexLeft = Math.max(self.scrollIndexLeft - 1, 0);
      self.scrollPixelLeft -= self.getColumnWidth(
        self.orders.columns[self.scrollIndexLeft],
      );
    }
    if ((self.viewData || []).length > 0) {
      self.scrollIndexTop = Math.max(self.scrollIndexTop - 1, 0);
      self.scrollPixelTop = Math.max(
        self.scrollPixelTop -
          (self.viewData[self.scrollIndexTop]
            ? (self.sizes.rows[self.scrollIndexTop] || ch) +
              (self.sizes.trees[self.scrollIndexTop] || 0)
            : ch) *
            self.scale,
        0,
      );
    }
    self.ellipsisCache = {};
    if (!dontDraw) {
      self.draw(true);
    }
    //TODO: figure out why this has to be delayed for child grids
    //BUG: wheeling event on 3rd level hierarchy fails to move input box
    requestAnimationFrame(self.resizeEditInput);
    self.dispatchEvent('scroll', {
      top: self.scrollBox.scrollTop,
      left: self.scrollBox.scrollLeft,
    });
  };
  self.mousemove = function (e, overridePos) {
    if (self.contextMenu || self.input) {
      return;
    }

    // Cancel dragging action if user ventures outside grid
    if (self.draggingItem && e.which === 0) {
      self.stopFreezeMove(e);
      self.mouseup(e);
      return;
    }

    self.mouse = overridePos || self.getLayerPos(e);
    var ctrl =
        (e.ctrlKey || e.metaKey || self.attributes.persistantSelectionMode) &&
        !self.attributes.singleSelectionMode,
      i,
      s = self.getSchema(),
      dragBounds,
      sBounds,
      x = self.mouse.x,
      y = self.mouse.y,
      cell = self.getCellAt(x, y),
      delta,
      ev = { NativeEvent: e, cell: cell, x: x, y: y },
      previousCell = self.currentCell;
    clearTimeout(self.scrollTimer);
    if (!self.isInGrid({ x: x, y: y })) {
      self.hasFocus = false;
    }
    if (self.dispatchEvent('mousemove', ev)) {
      return;
    }
    if (cell && self.currentCell) {
      self.rowBoundaryCrossed = self.currentCell.rowIndex !== cell.rowIndex;
      self.columnBoundaryCrossed =
        self.currentCell.columnIndex !== cell.columnIndex;
      self.cellBoundaryCrossed =
        self.rowBoundaryCrossed || self.columnBoundaryCrossed;
      ['row', 'column', 'cell'].forEach(function (prefix) {
        if (self[prefix + 'BoundaryCrossed']) {
          ev.cell = previousCell;
          self.dispatchEvent(prefix + 'mouseout', ev);
          ev.cell = cell;
          self.dispatchEvent(prefix + 'mouseover', ev);
        }
      });
    }
    self.currentCell = cell;

    if (cell.context === 'cell' || cell.context === self.cursorGrab) {
      const indicator = self.getUnhideIndicator(self.mouse.x, self.mouse.y);
      if (indicator) {
        self.cursor = 'pointer';
        self.hovers = { unhideIndicator: indicator };
        self.draw();
        return;
      }
    }

    self.hovers = {};
    if (!self.draggingItem && cell) {
      self.dragItem = cell;
      self.dragMode = cell.dragContext;
      self.cursor = cell.context;
      if (cell.context === 'cell') {
        self.cursor = 'default';
        self.hovers = {
          rowIndex: cell.rowIndex,
          columnIndex: cell.columnIndex,
          onFilterButton: false,
          onCellTreeIcon: false,
        };
        if (
          cell.isFilterable &&
          x >
            cell.x +
              cell.width +
              self.canvasOffsetLeft -
              self.style.filterButtonWidth &&
          x < cell.x + cell.width + self.canvasOffsetLeft &&
          y >
            cell.y +
              cell.height +
              self.canvasOffsetTop -
              self.style.filterButtonHeight &&
          y < cell.y + cell.height + self.canvasOffsetTop
        ) {
          self.hovers.onFilterButton = true;
          self.draw();
        }
        if (cell.isRowTree || cell.isColumnTree) {
          const pc = cell.isRowTree
            ? self.cellTree.rows[cell.rowIndex].parentCount
            : 0;
          const rc = self.style.cellTreeIconWidth * self.scale,
            rx =
              cell.x +
              cell.paddingLeft +
              self.canvasOffsetLeft +
              self.style.cellTreeIconMarginLeft +
              pc * (rc + cell.paddingLeft),
            ry =
              cell.y +
              self.canvasOffsetTop +
              self.style.cellTreeIconMarginTop * self.scale;
          if (x >= rx && x <= rx + rc && y >= ry && y < ry + rc) {
            self.hovers.onCellTreeIcon = true;
            self.draw();
          }
        }
      }
      if (self.selecting || self.reorderObject) {
        delta = {
          x: Math.abs(self.dragStart.x - x),
          y: Math.abs(self.dragStart.y - y),
        };
        if (self.dragStartObject.columnIndex !== -1 && e.shiftKey) {
          self.dragStartObject = {
            rowIndex: self.activeCell.rowIndex,
            columnIndex: self.activeCell.columnIndex,
          };
        }
        dragBounds = {
          top: Math.min(self.dragStartObject.rowIndex, cell.rowIndex),
          left: Math.min(self.dragStartObject.columnIndex, cell.columnIndex),
          bottom: Math.max(self.dragStartObject.rowIndex, cell.rowIndex),
          right: Math.max(self.dragStartObject.columnIndex, cell.columnIndex),
        };
        if (self.dragStartObject.columnIndex === -1) {
          sBounds = self.getSelectionBounds();
          dragBounds.left = -1;
          dragBounds.right = s.length - 1;
          dragBounds.top = Math.min(sBounds.top, cell.rowIndex);
          dragBounds.bottom = Math.max(sBounds.bottom, cell.rowIndex);
          if (dragBounds.top < 0) dragBounds.top = 0;
        }

        if (self.dragStartObject.rowIndex === -1) {
          sBounds = self.getSelectionBounds();
          dragBounds.left =
            cell.columnIndex === undefined
              ? sBounds.left
              : Math.min(sBounds.left, cell.columnIndex);
          dragBounds.right =
            cell.columnIndex === undefined
              ? sBounds.right
              : Math.max(sBounds.right, cell.columnIndex);
          dragBounds.top = -1;
          dragBounds.bottom = self.viewData.length - 1;
          if (dragBounds.left < 0) dragBounds.left = 0;
        }

        if (
          self.dragStartObject.rowIndex !== cell.rowIndex ||
          self.dragStartObject.columnIndex !== cell.columnIndex
        ) {
          self.ignoreNextClick = true;
        }
        if (
          self.cellBoundaryCrossed ||
          (delta.x === 0 && delta.y === 0) ||
          self.attributes.selectionMode === 'row'
        ) {
          if (
            cell.rowIndex !== undefined &&
            (self.attributes.selectionMode === 'row' ||
              self.dragStartObject.columnIndex === -1) &&
            self.rowBoundaryCrossed
          ) {
            if (self.dragStartObject.rowIndex < cell.rowIndex) {
              dragBounds.top = self.dragStartObject.rowIndex;
              dragBounds.bottom = cell.rowIndex;
            } else {
              dragBounds.top = cell.rowIndex;
              dragBounds.bottom = self.dragStartObject.rowIndex;
            }
          } else if (
            cell.rowIndex !== undefined &&
            (self.attributes.selectionMode === 'column' ||
              self.dragStartObject.rowIndex === -1) &&
            self.columnBoundaryCrossed
          ) {
            if (self.dragStartObject.columnIndex < cell.columnIndex) {
              dragBounds.left = self.dragStartObject.columnIndex;
              dragBounds.right = cell.columnIndex;
            } else {
              dragBounds.left = cell.columnIndex;
              dragBounds.right = self.dragStartObject.columnIndex;
            }
          } else if (self.attributes.selectionMode !== 'row') {
            if (cell.hovered && self.hovers.onFilterButton) {
              if (cell.openedFilter) {
                cell.openedFilter = false;
                self.selectedFilterButton = {
                  columnIndex: -1,
                  rowIndex: -1,
                };
              } else {
                self.selectedFilterButton.rowIndex = cell.rowIndex;
                self.selectedFilterButton.columnIndex = cell.columnIndex;
                self.contextmenuEvent(e, {
                  x: cell.x + cell.width - self.style.filterButtonWidth,
                  y: cell.y + cell.height,
                  rect: { left: 0, top: 0 },
                });
              }
              self.draw();
              return;
            } else if (
              cell.hovered &&
              self.hovers.onCellTreeIcon &&
              e.type == 'mousedown'
            ) {
              self.toggleCollapseTree(cell.rowIndex, cell.columnIndex);
              return;
            } else {
              self.selectedFilterButton = {
                columnIndex: -1,
                rowIndex: -1,
              };
              if (self.hovers.onFilterButton) return;
              if (self.hovers.onCellTreeIcon) return;
              if (!self.dragAddToSelection && cell.rowIndex !== undefined) {
                if (
                  self.selections[cell.rowIndex] &&
                  self.selections[cell.rowIndex].indexOf(cell.columnIndex) !==
                    -1
                ) {
                  self.selections[cell.rowIndex].splice(
                    self.selections[cell.rowIndex].indexOf(cell.columnIndex),
                    1,
                  );
                }
              } else {
                self.selections[cell.rowIndex] =
                  self.selections[cell.rowIndex] || [];
                if (
                  self.selections[cell.rowIndex].indexOf(cell.columnIndex) ===
                  -1
                ) {
                  self.selections[cell.rowIndex].push(cell.columnIndex);
                  var event = {
                    selections: self.selections,
                    selectedData: self.getSelectedData(),
                    selectedCells: self.getSelectedCells(),
                    selectionBounds: self.getSelectionBounds(),
                  };
                  self.dispatchEvent('selectionchanged', event);
                }
              }
            }
          }
        }
        if (
          (!self.selectionBounds ||
            dragBounds.top !== self.selectionBounds.top ||
            dragBounds.left !== self.selectionBounds.left ||
            dragBounds.bottom !== self.selectionBounds.bottom ||
            dragBounds.right !== self.selectionBounds.right) &&
          !ctrl
        ) {
          if (!(cell.hovered && self.hovers.onFilterButton)) {
            self.selections = [];
          }
          if (dragBounds.top === -1) {
            dragBounds.top = 0;
          }
          sBounds = dragBounds;
          if (self.attributes.selectionMode === 'row') {
            for (i = sBounds.top; i <= sBounds.bottom; i += 1) {
              self.selectRow(i, true, null, true);
            }
          } else {
            self.selectArea(sBounds, true);
            if (sBounds.left == -1 && sBounds.top !== sBounds.bottom)
              self.isMultiRowsSelected = true;
          }
        }

        if (self.attributes.autoScrollOnMousemove) {
          var movedVertically = delta.y > self.attributes.autoScrollMargin;
          var movedHorizontally = delta.x > self.attributes.autoScrollMargin;

          if (movedVertically && !movedHorizontally)
            self.autoScrollZone(e, -1, y, ctrl);
          else if (movedHorizontally && !movedVertically)
            self.autoScrollZone(e, x, -1, ctrl);
          else if (movedHorizontally && movedVertically)
            self.autoScrollZone(e, x, y, ctrl);
        } else {
          self.autoScrollZone(e, x, y, ctrl);
        }
      }
    }
    const columnGroup = self.getColumnGroupAt(self.mouse.x, self.mouse.y);
    if (columnGroup) self.cursor = 'pointer';

    const rowGroup = self.getRowGroupAt(self.mouse.x, self.mouse.y);
    if (rowGroup) self.cursor = 'pointer';

    self.cellBoundaryCrossed = false;
    self.rowBoundaryCrossed = false;
    self.columnBoundaryCrossed = false;
    self.draw(true);
  };
  self.click = function (e, overridePos) {
    var i,
      startingBounds = JSON.stringify(self.getSelectionBounds()),
      ctrl =
        (e.ctrlKey || e.metaKey || self.attributes.persistantSelectionMode) &&
        !self.attributes.singleSelectionMode,
      pos = overridePos || self.getLayerPos(e);
    self.currentCell = self.getCellAt(pos.x, pos.y);
    if (self.currentCell.grid !== undefined) {
      return;
    }
    function checkSelectionChange() {
      var ev,
        sb = self.getSelectionBounds();

      if (startingBounds === JSON.stringify(sb)) {
        return;
      }
      ev = {
        selections: self.selections,
        selectionBounds: self.getSelectionBounds(),
        selectedCells: self.getSelectedCells(),
      };
      Object.defineProperty(ev, 'selectedData', {
        get: function () {
          return self.getSelectedData();
        },
      });
      self.dispatchEvent('selectionchanged', ev);
    }
    if (self.input) {
      self.endEdit();
    }
    if (self.ignoreNextClick) {
      self.ignoreNextClick = false;
      return;
    }
    i = self.currentCell;
    if (
      self.dispatchEvent('click', { NativeEvent: e, cell: self.currentCell })
    ) {
      return;
    }

    const unhideIndicator = self.getUnhideIndicator(pos.x, pos.y);
    if (unhideIndicator) {
      // WIP: unhideRows
      const { orderIndex0, orderIndex1 } = unhideIndicator;
      self.unhideColumns(orderIndex0, orderIndex1);
      self.refresh();
      return;
    }

    let group = self.getColumnGroupAt(pos.x, pos.y);
    if (!group) group = self.getRowGroupAt(pos.x, pos.y);
    if (group) {
      if (self.toggleGroup(group)) {
        self.setStorageData();
        self.refresh();
        return;
      }
    }

    if (!self.hasFocus) {
      return;
    }

    const leftOffset = self.getRowGroupAreaWidth();
    const topOffset = self.getColumnGroupAreaHeight();
    const xInGrid = pos.x - leftOffset;
    const yInGrid = pos.y - topOffset;
    if (
      ['rowHeaderCell', 'columnHeaderCell'].indexOf(self.currentCell.style) ===
        -1 &&
      !ctrl
    ) {
      if (!self.hovers.onFilterButton) {
        self.setActiveCell(i.columnIndex, i.rowIndex);
      }
    }
    if (self.currentCell.context === 'cell') {
      if (self.currentCell.style === 'cornerCell') {
        self.selectAll();
        self.draw();
        checkSelectionChange();
        return;
      }
      if (self.currentCell.style === 'columnHeaderCell') {
        if (self.attributes.columnHeaderClickBehavior === 'sort') {
          if (self.orderBy === i.header.name) {
            self.orderDirection =
              self.orderDirection === 'asc' ? 'desc' : 'asc';
          } else {
            self.orderDirection = 'asc';
          }
          self.order(i.header.name, self.orderDirection);
          checkSelectionChange();
          return;
        }
      }
      self.selections[i.rowIndex] = self.selections[i.rowIndex] || [];
      if (
        self.attributes.selectionMode === 'row' ||
        self.currentCell.style === 'rowHeaderCell'
      ) {
        if (
          self.currentCell.style === 'rowHeaderCell' &&
          self.attributes.tree &&
          xInGrid > 0 &&
          xInGrid - self.currentCell.x <
            self.style.treeArrowWidth +
              self.style.treeArrowMarginLeft +
              self.style.treeArrowMarginRight +
              self.style.treeArrowClickRadius &&
          yInGrid - self.currentCell.y <
            self.style.treeArrowHeight +
              self.style.treeArrowMarginTop +
              self.style.treeArrowClickRadius &&
          yInGrid > 0
        ) {
          self.toggleTree(i.rowIndex);
          return;
        }
      }
      if (e.shiftKey && !ctrl) {
        self.selectionBounds = self.getSelectionBounds();
        self.selectArea(undefined, false);
      }
    }
    checkSelectionChange();
    self.draw(true);
  };
  self.dragResizeColumn = function (e) {
    var pos, x, y;
    pos = self.getLayerPos(e);
    x = self.resizingStartingWidth + pos.x - self.dragStart.x;
    y = self.resizingStartingHeight + pos.y - self.dragStart.y;
    if (x < self.style.minColumnWidth) {
      x = self.style.minColumnWidth;
    }
    if (y < self.style.minRowHeight) {
      y = self.style.minRowHeight;
    }
    if (
      self.dispatchEvent('resizecolumn', {
        x: x,
        y: y,
        draggingItem: self.draggingItem,
      })
    ) {
      return false;
    }
    if (
      self.scrollBox.scrollLeft >
        self.scrollBox.scrollWidth - self.attributes.resizeScrollZone &&
      self.dragMode === 'ew-resize'
    ) {
      self.resize(true);
    }
    if (self.dragMode === 'ew-resize') {
      self.sizes.columns[
        self.draggingItem.header.style === 'rowHeaderCell'
          ? 'cornerCell'
          : self.draggingItem.sortColumnIndex
      ] = x;
      if (
        ['rowHeaderCell', 'cornerCell'].indexOf(
          self.draggingItem.header.style,
        ) !== -1
      ) {
        self.resize(true);
      }
      self.resizeChildGrids();
      return;
    }
    if (self.dragMode === 'ns-resize') {
      if (self.draggingItem.rowOpen) {
        self.sizes.trees[self.draggingItem.rowIndex] = y;
      } else if (self.attributes.globalRowResize) {
        self.style.cellHeight = y;
      } else {
        self.sizes.rows[self.draggingItem.rowIndex] = y;
      }
      self.dispatchEvent('resizerow', { row: y });
      self.resizeChildGrids();
      return;
    }
    self.ellipsisCache = {};
  };
  self.stopDragResize = function (event) {
    const pos = self.getLayerPos(event);

    if (self.dragMode === 'ew-resize') {
      const hasMoved = !!(pos.x - self.dragStart.x);
      // Check that dragItem is selected or part of selection.
      const dragItemIsSelected = self.isColumnSelected(
        self.dragItem.columnIndex,
      );

      if (hasMoved && dragItemIsSelected) {
        const width = Math.max(
          self.resizingStartingWidth + pos.x - self.dragStart.x,
          self.style.minColumnWidth,
        );
        // If the column is selected, resize it to width plus any other selected columns.
        self.fitSelectedColumns(width);
      }
    }

    self.resize();
    document.body.removeEventListener(
      'mousemove',
      self.dragResizeColumn,
      false,
    );
    document.body.removeEventListener('mouseup', self.stopDragResize, false);
    self.setStorageData();
    self.draw(true);
    self.ignoreNextClick = true;
  };
  self.scrollGrid = function (e) {
    var pos = self.getLayerPos(e);
    if (
      self.attributes.scrollPointerLock &&
      self.pointerLockPosition &&
      ['horizontal-scroll-box', 'vertical-scroll-box'].indexOf(
        self.scrollStartMode,
      ) !== -1
    ) {
      self.pointerLockPosition.x += e.movementX;
      self.pointerLockPosition.y += e.movementY;
      self.pointerLockPosition.x = Math.min(
        self.width - self.style.scrollBarWidth,
        Math.max(0, self.pointerLockPosition.x),
      );
      self.pointerLockPosition.y = Math.min(
        self.height - self.style.scrollBarWidth,
        Math.max(0, self.pointerLockPosition.y),
      );
      pos = self.pointerLockPosition;
    }
    self.scrollMode = self.getCellAt(pos.x, pos.y).context;
    if (
      self.scrollMode === 'horizontal-scroll-box' &&
      self.scrollStartMode !== 'horizontal-scroll-box'
    ) {
      self.scrollStartMode = 'horizontal-scroll-box';
      self.dragStart = pos;
      self.scrollStart.left = self.scrollBox.scrollLeft;
      clearTimeout(self.scrollTimer);
      return;
    }
    if (
      self.scrollMode === 'vertical-scroll-box' &&
      self.scrollStartMode !== 'vertical-scroll-box'
    ) {
      self.scrollStartMode = 'vertical-scroll-box';
      self.dragStart = pos;
      self.scrollStart.top = self.scrollBox.scrollTop;
      clearTimeout(self.scrollTimer);
      return;
    }
    if (
      self.scrollStartMode === 'vertical-scroll-box' &&
      self.scrollMode !== 'vertical-scroll-box'
    ) {
      self.scrollMode = 'vertical-scroll-box';
    }
    if (
      self.scrollStartMode === 'horizontal-scroll-box' &&
      self.scrollMode !== 'horizontal-scroll-box'
    ) {
      self.scrollMode = 'horizontal-scroll-box';
    }
    clearTimeout(self.scrollTimer);
    if (self.scrollModes.indexOf(self.scrollMode) === -1) {
      return;
    }
    if (self.scrollMode === 'vertical-scroll-box') {
      self.scrollBox.scrollTop =
        self.scrollStart.top +
        (pos.y - self.dragStart.y) / self.scrollBox.heightBoxRatio;
    } else if (self.scrollMode === 'vertical-scroll-top') {
      self.scrollBox.scrollTop -= self.page * self.style.cellHeight;
      self.scrollTimer = setTimeout(
        self.scrollGrid,
        self.attributes.scrollRepeatRate,
        e,
      );
    } else if (self.scrollMode === 'vertical-scroll-bottom') {
      self.scrollBox.scrollTop += self.page * self.style.cellHeight;
      self.scrollTimer = setTimeout(
        self.scrollGrid,
        self.attributes.scrollRepeatRate,
        e,
      );
    }
    if (self.scrollMode === 'horizontal-scroll-box') {
      self.scrollBox.scrollLeft =
        self.scrollStart.left +
        (pos.x - self.dragStart.x) / self.scrollBox.widthBoxRatio;
    } else if (self.scrollMode === 'horizontal-scroll-right') {
      self.scrollBox.scrollLeft += self.attributes.selectionScrollIncrement;
      self.scrollTimer = setTimeout(
        self.scrollGrid,
        self.attributes.scrollRepeatRate,
        e,
      );
    } else if (self.scrollMode === 'horizontal-scroll-left') {
      self.scrollBox.scrollLeft -= self.attributes.selectionScrollIncrement;
      self.scrollTimer = setTimeout(
        self.scrollGrid,
        self.attributes.scrollRepeatRate,
        e,
      );
    }
  };
  self.stopScrollGrid = function () {
    clearTimeout(self.scrollTimer);
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
    document.removeEventListener('mousemove', self.scrollGrid, false);
  };
  self.dragReorder = function (e) {
    var pos,
      x,
      y,
      columReorder = self.dragMode === 'column-reorder',
      rowReorder = self.dragMode === 'row-reorder';
    pos = self.getLayerPos(e);
    x = pos.x - self.dragStart.x;
    y = pos.y - self.dragStart.y;
    if (!self.attributes.allowColumnReordering && columReorder) {
      return;
    }
    if (!self.attributes.allowRowReordering && rowReorder) {
      return;
    }
    if ((e.ctrlKey || e.metaKey || e.shiftKey) && self.reorderObject) {
      if (
        self.dragMode === 'column-reorder' &&
        !self.isMultiColumnsSelected(self.draggingItem.header.index)
      ) {
        self.selectColumn(self.draggingItem.header.index, false, false);
      }
    }
    if (
      self.dispatchEvent('reordering', {
        NativeEvent: e,
        source: self.dragStartObject,
        target: self.currentCell,
        dragMode: self.dragMode,
      })
    ) {
      return;
    }
    if (
      Math.abs(x) > self.attributes.reorderDeadZone ||
      Math.abs(y) > self.attributes.reorderDeadZone
    ) {
      self.reorderObject = self.draggingItem;
      if (self.isMultiRowsSelected)
        self.reorderObject = self.getVisibleCellByIndex(
          -1,
          self.activeCell.rowIndex,
        );
      if (!self.reorderObject) return;
      self.reorderTarget = self.currentCell;
      self.reorderObject.dragOffset = {
        x: x,
        y: y,
      };
      self.autoScrollZone(
        e,
        columReorder ? pos.x : -1,
        rowReorder ? pos.y : -1,
        false,
      );
    }
  };
  self.stopDragReorder = function (e) {
    var oIndex,
      tIndex,
      odata = [],
      cr = {
        'row-reorder': self.orders.rows,
        'column-reorder': self.orders.columns,
      },
      i = {
        'row-reorder': 'rowIndex',
        'column-reorder': 'sortColumnIndex',
      }[self.dragMode];
    document.body.removeEventListener('mousemove', self.dragReorder, false);
    document.body.removeEventListener('mouseup', self.stopDragReorder, false);
    if (
      self.reorderObject &&
      self.reorderTarget &&
      ((self.dragMode === 'column-reorder' &&
        self.reorderTarget.sortColumnIndex > -1 &&
        self.reorderTarget.sortColumnIndex < self.getSchema().length) ||
        (self.dragMode === 'row-reorder' &&
          self.reorderTarget.rowIndex > -1 &&
          self.reorderTarget.rowIndex < self.viewData.length)) &&
      self.reorderObject[i] !== self.reorderTarget[i] &&
      !self.dispatchEvent('reorder', {
        NativeEvent: e,
        source: self.reorderObject,
        target: self.reorderTarget,
        dragMode: self.dragMode,
      })
    ) {
      self.ignoreNextClick = true;
      oIndex = cr[self.dragMode].indexOf(self.reorderObject[i]);
      tIndex = cr[self.dragMode].indexOf(self.reorderTarget[i]);
      if (self.dragMode === 'column-reorder') {
        var sortColumnIndices = [];
        var seletedColumnIndices = [];
        if (self.selections[0]) {
          self.selections[0].forEach(function (value) {
            sortColumnIndices.push(self.orders.columns[value]);
          });
        }
        var deleteCount = sortColumnIndices.length;
        cr[self.dragMode].splice(oIndex, deleteCount);
        if (tIndex > oIndex) tIndex = tIndex - (deleteCount - 1);
        for (var i = 0; i < sortColumnIndices.length; i++) {
          seletedColumnIndices.push(tIndex + i);
          cr[self.dragMode].splice(tIndex + i, 0, sortColumnIndices[i]);
        }
        self.orders.columns = cr[self.dragMode];
        self.viewData.forEach(function (row, rowIndex) {
          self.selections[rowIndex] = seletedColumnIndices;
        });
      } else {
        var selectedRows = [];
        self.selections.forEach(function (row, rowIndex) {
          if (row) {
            selectedRows.push(row);
            odata.push(self.viewData[rowIndex]);
          }
        });
        self.viewData.splice(oIndex, odata.length);
        self.selections = [];
        if (tIndex > oIndex) tIndex = tIndex - (odata.length - 1);
        self.activeCell.rowIndex = tIndex;
        for (var i = 0; i < odata.length; i++) {
          self.viewData.splice(tIndex + i, 0, odata[i]);
          self.selections[tIndex + i] = selectedRows[i];
        }
      }
      self.resize();
      self.setStorageData();
    }
    self.reorderObject = undefined;
    self.reorderTarget = undefined;
    self.draw(true);
  };
  self.dragMove = function (e) {
    if (
      self.dispatchEvent('moving', { NativeEvent: e, cell: self.currentCell })
    ) {
      return;
    }
    var pos = self.getLayerPos(e);
    self.moveOffset = {
      x: self.currentCell.columnIndex - self.dragStartObject.columnIndex,
      y: self.currentCell.rowIndex - self.dragStartObject.rowIndex,
    };
    if (
      Math.abs(pos.x) > self.attributes.reorderDeadZone ||
      Math.abs(pos.y) > self.attributes.reorderDeadZone
    ) {
      setTimeout(function () {
        self.autoScrollZone(e, pos.x, pos.y, false);
      }, 1);
    }
  };
  self.stopDragMove = function (e) {
    document.body.removeEventListener('mousemove', self.dragMove, false);
    document.body.removeEventListener('mouseup', self.stopDragMove, false);
    var b = self.getSelectionBounds();
    if (
      self.dispatchEvent('endmove', { NativeEvent: e, cell: self.currentCell })
    ) {
      self.movingSelection = undefined;
      self.moveOffset = undefined;
      self.draw(true);
      return;
    }
    if (self.moveOffset) {
      self.moveTo(
        self.movingSelection,
        b.left + self.moveOffset.x,
        b.top + self.moveOffset.y,
      );
      self.moveSelection(self.moveOffset.x, self.moveOffset.y);
    }
    self.movingSelection = undefined;
    self.moveOffset = undefined;
    self.draw(true);
  };
  self.freezeMove = function (e) {
    if (
      self.dispatchEvent('freezemoving', {
        NativeEvent: e,
        cell: self.currentCell,
      })
    ) {
      return;
    }
    var pos = self.getLayerPos(e),
      bm = self.style.gridBorderCollapse === 'collapse' ? 1 : 2,
      columnHeaderCellBorder = self.style.columnHeaderCellBorderWidth * bm,
      columnHeaderCellHeight = self.getColumnHeaderCellHeight(),
      rowHeaderCellWidth = self.getRowHeaderCellWidth();

    self.ignoreNextClick = true;
    self.freezeMarkerPosition = pos;
    pos.x -= self.getRowGroupAreaWidth();
    pos.y -= self.getColumnGroupAreaHeight();
    if (
      self.currentCell &&
      self.currentCell.rowIndex !== undefined &&
      self.dragMode === 'frozen-row-marker'
    ) {
      self.scrollBox.scrollTop = 0;
      self.frozenRow = self.currentCell.rowIndex + 1;
      self.scrollBox.bar.v.y =
        columnHeaderCellHeight +
        columnHeaderCellBorder +
        self.scrollCache.y[self.frozenRow];
      self.scrollBox.box.v.y =
        columnHeaderCellHeight +
        columnHeaderCellBorder +
        self.scrollCache.y[self.frozenRow];
      var dataHeight = self.scrollCache.y[self.scrollCache.y.length - 1];
      self.scrollBox.heightBoxRatio =
        (self.scrollBox.height -
          columnHeaderCellHeight -
          self.scrollCache.y[self.frozenRow]) /
        dataHeight;
      self.scrollBox.scrollBoxHeight =
        self.scrollBox.height * self.scrollBox.heightBoxRatio -
        self.style.scrollBarWidth;
      self.scrollBox.scrollBoxHeight = Math.max(
        self.scrollBox.scrollBoxHeight,
        self.style.scrollBarBoxMinSize,
      );
      self.scrollBox.box.v.height = self.scrollBox.scrollBoxHeight;
    }
    if (
      self.currentCell &&
      self.currentCell.columnIndex !== undefined &&
      self.dragMode === 'frozen-column-marker'
    ) {
      self.scrollBox.scrollLeft = 0;
      self.frozenColumn = self.currentCell.columnIndex + 1;
      self.scrollBox.bar.h.x =
        rowHeaderCellWidth + self.scrollCache.x[self.frozenColumn - 1];
      self.scrollBox.box.h.x =
        rowHeaderCellWidth + self.scrollCache.x[self.frozenColumn - 1];
      var dataWidth = self.scrollCache.x[self.scrollCache.x.length - 1];
      self.scrollBox.widthBoxRatio =
        (self.scrollBox.width - self.scrollCache.x[self.frozenColumn - 1]) /
        dataWidth;
      self.scrollBox.scrollBoxWidth =
        self.scrollBox.width * self.scrollBox.widthBoxRatio -
        self.style.scrollBarWidth;
      self.scrollBox.scrollBoxWidth = Math.max(
        self.scrollBox.scrollBoxWidth,
        self.style.scrollBarBoxMinSize,
      );
      self.scrollBox.box.h.width = self.scrollBox.scrollBoxWidth;
    }
    if (
      Math.abs(pos.x) > self.attributes.reorderDeadZone ||
      Math.abs(pos.y) > self.attributes.reorderDeadZone
    ) {
      setTimeout(function () {
        self.autoScrollZone(e, pos.x, pos.y, false);
      }, 1);
    }
  };
  self.stopFreezeMove = function (e) {
    document.body.removeEventListener('mousemove', self.freezeMove, false);
    document.body.removeEventListener('mouseup', self.stopFreezeMove, false);
    self.freezeMarkerPosition = undefined;
    if (
      self.dispatchEvent('endfreezemove', {
        NativeEvent: e,
        cell: self.currentCell,
      })
    ) {
      self.frozenRow = self.startFreezeMove.x;
      self.frozenColumn = self.startFreezeMove.y;
      self.draw(true);
      return;
    }
    self.draw(true);
  };
  self.mousedown = function (e, overridePos) {
    self.lastMouseDownTarget = e.target;
    if (
      self.dispatchEvent('mousedown', {
        NativeEvent: e,
        cell: self.currentCell,
      })
    ) {
      return;
    }
    if (!self.hasFocus) {
      return;
    }
    if (e.button === 2 || self.input) {
      return;
    }
    var ctrl = e.ctrlKey || e.metaKey,
      move = /-move/.test(self.dragMode),
      freeze = /frozen-row-marker|frozen-column-marker/.test(self.dragMode),
      resize = /-resize/.test(self.dragMode);
    self.dragStart = overridePos || self.getLayerPos(e);
    self.scrollStart = {
      left: self.scrollBox.scrollLeft,
      top: self.scrollBox.scrollTop,
    };
    self.dragStartObject = self.getCellAt(self.dragStart.x, self.dragStart.y);
    self.dragAddToSelection = !self.dragStartObject.selected;
    if (
      !ctrl &&
      !e.shiftKey &&
      !/(vertical|horizontal)-scroll-(bar|box)/.test(
        self.dragStartObject.context,
      ) &&
      self.currentCell &&
      !self.currentCell.isColumnHeader &&
      !move &&
      !freeze &&
      !resize
    ) {
      if (
        !(self.dragMode == 'row-reorder' && self.isMultiRowsSelected) &&
        !(self.currentCell.hovered && self.hovers.onFilterButton)
      ) {
        self.selections = [];
      }
    }
    if (self.dragStartObject.isGrid) {
      return;
    }
    if (self.scrollModes.indexOf(self.dragStartObject.context) !== -1) {
      self.scrollMode = self.dragStartObject.context;
      self.scrollStartMode = self.dragStartObject.context;
      self.scrollGrid(e);
      if (
        self.attributes.scrollPointerLock &&
        ['horizontal-scroll-box', 'vertical-scroll-box'].indexOf(
          self.scrollStartMode,
        ) !== -1
      ) {
        self.pointerLockPosition = {
          x: self.dragStart.x,
          y: self.dragStart.y,
        };
        self.canvas.requestPointerLock();
      }
      document.addEventListener('mousemove', self.scrollGrid, false);
      document.addEventListener('mouseup', self.stopScrollGrid, false);
      self.ignoreNextClick = true;
      return;
    }
    if (self.dragMode === 'cell') {
      self.selecting = true;
      if (
        (self.attributes.selectionMode === 'row' ||
          self.dragStartObject.columnIndex === -1) &&
        self.dragStartObject.rowIndex > -1
      ) {
        self.selectRow(self.dragStartObject.rowIndex, ctrl, null);
      } else if (
        (self.attributes.selectionMode === 'column' ||
          self.dragStartObject.rowIndex === -1) &&
        self.dragStartObject.columnIndex > -1
      ) {
        self.selectColumn(self.currentCell.header.index, ctrl, e.shiftKey);
      } else if (self.attributes.selectionMode !== 'row') {
        self.mousemove(e);
      }
      return;
    }
    if (move) {
      self.draggingItem = self.dragItem;
      self.movingSelection = self.selections.concat([]);
      self.dragging = self.dragStartObject;
      if (
        self.dispatchEvent('beginmove', {
          NativeEvent: e,
          cell: self.currentCell,
        })
      ) {
        return;
      }
      document.body.addEventListener('mousemove', self.dragMove, false);
      document.body.addEventListener('mouseup', self.stopDragMove, false);
      return self.mousemove(e);
    }
    if (freeze) {
      self.draggingItem = self.dragItem;
      self.startFreezeMove = {
        x: self.frozenRow,
        y: self.frozenColumn,
      };
      if (self.dispatchEvent('beginfreezemove', { NativeEvent: e })) {
        return;
      }
      document.body.addEventListener('mousemove', self.freezeMove, false);
      document.body.addEventListener('mouseup', self.stopFreezeMove, false);
      return self.mousemove(e);
    }
    if (resize) {
      self.draggingItem = self.dragItem;
      if (self.draggingItem.rowOpen) {
        self.resizingStartingHeight =
          self.sizes.trees[self.draggingItem.rowIndex];
      } else {
        self.resizingStartingHeight =
          self.sizes.rows[self.draggingItem.rowIndex] || self.style.cellHeight;
      }
      self.resizingStartingWidth =
        self.sizes.columns[
          self.draggingItem.header.style === 'rowHeaderCell'
            ? 'cornerCell'
            : self.draggingItem.sortColumnIndex
        ] || self.draggingItem.width;
      document.body.addEventListener('mousemove', self.dragResizeColumn, false);
      document.body.addEventListener('mouseup', self.stopDragResize, false);
      return;
    }
    if (['row-reorder', 'column-reorder'].indexOf(self.dragMode) !== -1) {
      self.draggingItem = self.dragStartObject;
      if (
        self.dragMode === 'column-reorder' &&
        !self.isMultiColumnsSelected(self.currentCell.header.index)
      ) {
        self.selectColumn(self.currentCell.header.index, ctrl, e.shiftKey);
      } else if (self.dragMode === 'row-reorder' && !self.isMultiRowsSelected) {
        self.selectRow(self.dragStartObject.rowIndex, ctrl, null);
      }
      document.body.addEventListener('mousemove', self.dragReorder, false);
      document.body.addEventListener('mouseup', self.stopDragReorder, false);
      return;
    }
  };
  self.mouseup = function (e) {
    clearTimeout(self.scrollTimer);
    self.cellBoundaryCrossed = true;
    self.rowBoundaryCrossed = true;
    self.columnBoundaryCrossed = true;
    self.selecting = undefined;
    self.draggingItem = undefined;
    self.dragStartObject = undefined;
    if (
      self.dispatchEvent('mouseup', { NativeEvent: e, cell: self.currentCell })
    ) {
      return;
    }
    if (!self.hasFocus && e.target !== self.canvas) {
      return;
    }
    if (self.currentCell && self.currentCell.grid !== undefined) {
      return;
    }
    if (self.contextMenu || self.input) {
      return;
    }
    if (self.dragStart && self.isInGrid(self.dragStart)) {
      self.controlInput.focus();
    }
    e.preventDefault();
  };
  // gets the horizontal adjacent cells as well as first/last based on column visibility
  self.getAdjacentCells = function () {
    var x,
      i,
      s = self.getSchema(),
      o = {};
    for (x = 0; x < s.length; x += 1) {
      i = self.orders.columns[x];
      if (!s[i].hidden) {
        if (o.first === undefined) {
          o.first = x;
          o.left = x;
        }
        o.last = x;
        if (x > self.activeCell.columnIndex && o.right === undefined) {
          o.right = x;
        }
        if (x < self.activeCell.columnIndex) {
          o.left = x;
        }
      }
    }
    if (o.right === undefined) {
      o.right = o.last;
    }
    return o;
  };
  self.keydown = function (e) {
    var i,
      ev,
      adjacentCells = self.getAdjacentCells(),
      x = Math.max(self.activeCell.columnIndex, 0),
      y = Math.max(self.activeCell.rowIndex, 0),
      ctrl = e.ctrlKey || e.metaKey,
      last = self.viewData.length - 1,
      s = self.getSchema(),
      cols = s.length - 1;

    var defaultPrevented = self.dispatchEvent('keydown', {
      NativeEvent: e,
      cell: self.currentCell,
    });

    if (defaultPrevented) {
      return;
    }

    if (!self.attributes.keepFocusOnMouseOut && !self.hasFocus) {
      return;
    }

    // If a user starts typing content, switch to "Enter" mode
    if (isPrintableKeyEvent(e) && !ctrl) {
      return self.beginEditAt(x, y, e, true);
    }

    if (self.attributes.showNewRow) {
      last += 1;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
    }

    if (e.key === 'Escape') {
      self.selectNone();
    } else if (ctrl && e.key === 'a') {
      self.selectAll();
    } else if (['Backspace', 'Delete'].includes(e.key)) {
      self.deleteSelectedData();
    } else if (e.key === 'ArrowDown') {
      y += 1;
    } else if (e.key === 'ArrowUp') {
      y -= 1;
    } else if (
      (e.key === 'ArrowLeft' && !ctrl) ||
      (e.shiftKey && e.key === 'Tab')
    ) {
      x = adjacentCells.left;
    } else if (
      (e.key === 'ArrowRight' && !ctrl) ||
      (!e.shiftKey && e.key === 'Tab')
    ) {
      x = adjacentCells.right;
    } else if (e.key === 'PageUp') {
      y -= self.page;
      e.preventDefault();
    } else if (e.key === 'PageDown') {
      y += self.page;
      e.preventDefault();
    } else if (e.key === 'Home' || (ctrl && e.key === 'ArrowUp')) {
      y = 0;
    } else if (e.key === 'End' || (ctrl && e.key === 'ArrowDown')) {
      y = self.viewData.length - 1;
    } else if (ctrl && e.key === 'ArrowRight') {
      x = adjacentCells.last;
    } else if (ctrl && e.key === 'ArrowLeft') {
      x = adjacentCells.first;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      return self.beginEditAt(x, y, e);
    }
    if (x < 0 || Number.isNaN(x)) {
      x = adjacentCells.first;
    }
    if (y > last) {
      y = last;
    }
    if (y < 0 || Number.isNaN(y)) {
      y = 0;
    }
    if (x > cols) {
      x = adjacentCells.last;
    }

    // TODO - most likely some column order related bugs in key based selection
    // Arrows
    var isArrowKey = [
      'ArrowLeft',
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
    ].includes(e.key);

    // Shrinking and expanding selection using shift and arrow keys
    if (e.shiftKey && isArrowKey) {
      const firstSelectedRowIndex = self.selections.findIndex((el) => !!el);
      const firstSelectedRow = self.selections[firstSelectedRowIndex];
      const firstSelectedColumnIndex = firstSelectedRow[0];
      const lastSelectedColumn = firstSelectedRow[firstSelectedRow.length - 1];
      const yAtTop = y === 0;
      const yAtBottom = y === last;
      const xAtLeft = x === 0;
      const xAtRight = x === cols;

      if (e.key === 'ArrowUp') {
        if (y + 1 > firstSelectedRowIndex && !yAtTop) {
          self.selections.pop();
        } else if (y < firstSelectedRowIndex) {
          self.selections[y] = self.selections[y] || [];
          self.selections[y].push(x);
        } else if (yAtTop && self.activeCell.rowIndex !== 0) {
          self.selections.pop();
        }
      }

      if (e.key === 'ArrowDown') {
        if (y > firstSelectedRowIndex && y === self.selections.length) {
          self.selections[y] = self.selections[y] || [];
          self.selections[y].push(x);
        } else if (y >= firstSelectedRowIndex && !yAtBottom) {
          delete self.selections[y - 1];
        } else if (yAtBottom && self.activeCell.rowIndex !== last) {
          delete self.selections[y - 1];
        }
      }

      for (const selection of self.selections) {
        if (e.key === 'ArrowRight' && selection) {
          if (x > lastSelectedColumn) {
            selection.push(x);
          } else if (x <= lastSelectedColumn && !xAtRight) {
            selection.shift();
          } else if (xAtRight && self.activeCell.columnIndex !== cols) {
            selection.shift();
          }
        }

        if (e.key === 'ArrowLeft' && selection) {
          if (x < firstSelectedColumnIndex) {
            selection.unshift(x);
          } else if (x >= firstSelectedColumnIndex && !xAtLeft) {
            selection.pop();
          } else if (xAtLeft && self.activeCell.columnIndex !== 0) {
            selection.pop();
          }
        }
      }

      self.selectionBounds = self.getSelectionBounds();
      self.selectArea(undefined, ctrl);

      self.draw(true);
    }

    if (x !== self.activeCell.columnIndex || y !== self.activeCell.rowIndex) {
      self.scrollIntoView(
        x !== self.activeCell.columnIndex ? x : undefined,
        y !== self.activeCell.rowIndex && !Number.isNaN(y) ? y : undefined,
      );

      self.setActiveCell(x, y);
      if (!e.shiftKey && self.attributes.selectionFollowsActiveCell) {
        if (!ctrl) {
          self.selections = [];
        }
        self.selections[y] = self.selections[y] || [];
        self.selections[y].push(x);
        ev = {
          selectedData: self.getSelectedData(),
          selections: self.selections,
          selectionBounds: self.getSelectionBounds(),
          selectedCells: self.getSelectedCells(),
        };
        Object.defineProperty(ev, 'selectedData', {
          get: function () {
            return self.getSelectedData();
          },
        });
        self.dispatchEvent('selectionchanged', ev);
      }
      self.draw(true);
    }
  };
  self.keyup = function (e) {
    if (
      self.dispatchEvent('keyup', { NativeEvent: e, cell: self.currentCell })
    ) {
      return;
    }
    if (!self.hasFocus) {
      return;
    }
  };
  self.keypress = function (e) {
    if (!self.hasFocus) {
      return;
    }
    if (
      self.dispatchEvent('keypress', { NativeEvent: e, cell: self.currentCell })
    ) {
      return;
    }
  };
  self.dblclick = function (e) {
    if (
      self.dispatchEvent('dblclick', { NativeEvent: e, cell: self.currentCell })
    ) {
      return;
    }
    if (!self.hasFocus) {
      return;
    }
    if (
      self.currentCell.context === 'ew-resize' &&
      self.currentCell.style === 'columnHeaderCell'
    ) {
      // Check that double-clicked cell is selected or part of selection.
      const currentCellIsSelected = self.isColumnSelected(
        self.currentCell.columnIndex,
      );

      if (currentCellIsSelected) {
        // There might be more
        self.fitSelectedColumns();
      } else {
        self.fitColumnToValues(self.currentCell.header.name);
      }
    } else if (
      self.currentCell.context === 'ew-resize' &&
      self.currentCell.style === 'cornerCell'
    ) {
      self.autosize();
    } else if (
      ['cell', 'activeCell'].includes(self.currentCell.style) &&
      !self.hovers.onFilterButton &&
      !self.hovers.onCellTreeIcon
    ) {
      if (self.currentCell.isRowTree || self.currentCell.isColumnTree) {
        self.cellTreeExpandCollapse(
          self.currentCell.rowIndex,
          self.currentCell.columnIndex,
        );
        self.draw();
      } else {
        self.beginEditAt(
          self.currentCell.columnIndex,
          self.currentCell.rowIndex,
        );
      }
    }
  };
  self.scrollWheel = function (e) {
    var l,
      t,
      ev = e,
      deltaX = e.deltaX === undefined ? e.NativeEvent.deltaX : e.deltaX,
      deltaY = e.deltaY === undefined ? e.NativeEvent.deltaY : e.deltaY,
      deltaMode =
        e.deltaMode === undefined ? e.NativeEvent.deltaMode : e.deltaMode;
    var e = e.NativeEvent || e;
    if (wheeling) {
      ev.preventDefault(e);
      return;
    }
    if (self.dispatchEvent('wheel', { NativeEvent: e })) {
      return;
    }
    self.touchHaltAnimation = true;
    l = self.scrollBox.scrollLeft;
    t = self.scrollBox.scrollTop;
    if (self.hasFocus) {
      //BUG Issue 42: https://github.com/TonyGermaneri/canvas-datagrid/issues/42
      //https://stackoverflow.com/questions/20110224/what-is-the-height-of-a-line-in-a-wheel-event-deltamode-dom-delta-line
      if (deltaMode === 1) {
        // line mode = 17 pixels per line
        deltaY = deltaY * 17;
      }
      if (
        (self.scrollBox.scrollTop < self.scrollBox.scrollHeight &&
          deltaY > 0) ||
        (self.scrollBox.scrollLeft < self.scrollBox.scrollWidth &&
          deltaX > 0) ||
        (self.scrollBox.scrollTop > 0 && deltaY < 0) ||
        (self.scrollBox.scrollLeft > 0 && deltaX < 0)
      ) {
        ev.preventDefault(e);
      }
      wheeling = setTimeout(function () {
        wheeling = undefined;
        self.scrollBox.scrollTo(deltaX + l, deltaY + t);
      }, 1);
    }
  };
  self.pasteData = function (
    pasteValue,
    mimeType,
    startRowIndex,
    startColIndex,
  ) {
    if (mimeType === 'text/html' && !isSupportedHtml(pasteValue)) {
      console.warn(
        'Unrecognized HTML format. HTML must be a simple table, e.g.: <table><tr><td>data</td></tr></table>.',
      );
      console.warn(
        'Data with the mime type text/html not in this format will not be imported as row data.',
      );

      return;
    }
    var schema = self.getSchema();
    var rows = parseData(pasteValue, mimeType);

    // selected cell. This mimics Excel's paste functionality, and works
    // as a poor-man's fill-down.
    if (rows.length === 1 && rows[0].length === 1) {
      var cellData = rows[0][0].value.map((item) => item.value).join();

      self.forEachSelectedCell(function (data, rowIndex, colName) {
        data[rowIndex][colName] = cellData;
      });
    } else {
      var selections = [];
      for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        // Rows may have been moved by user, so get the actual row index
        // (instead of the row index at which the row is rendered):
        var realRowIndex = self.orders.rows[startRowIndex + rowIndex];
        var cells = rows[rowIndex];

        var existingRowData = self.viewData[realRowIndex];
        var newRowData = Object.assign({}, existingRowData);

        selections[realRowIndex] = [];

        for (var colIndex = 0; colIndex < cells.length; colIndex++) {
          var column = schema[startColIndex + colIndex];

          if (!column) {
            console.warn('Paste data exceeded grid bounds. Skipping.');
            continue;
          }

          var columnName = column.name;
          var cellData = cells[colIndex].value
            .map((item) => item.value)
            .join('');

          if (cellData === undefined || cellData === null) {
            newRowData[columnName] = existingRowData[columnName];
            continue;
          }

          selections[realRowIndex].push(startColIndex + colIndex);

          newRowData[columnName] = cellData;
        }

        self.originalData[self.boundRowIndexMap.get(realRowIndex)] = newRowData;
        // Update view date here to avoid a full refresh of `viewData`.
        // To stay in line with Excel and Google Sheet behaviour,
        // don't perform a full refresh (and filter/sort results)
        // as this would make any pasted values disappear and/or suddenly change position.
        self.viewData[realRowIndex] = newRowData;
      }
      self.selections = selections;
    }

    // selections is a sparse array, so we condense:
    var affectedCells = [];

    self.selections.forEach(function (row, rowIndex) {
      if (rowIndex === undefined) return;

      row.forEach(function (columnIndex) {
        affectedCells.push([
          rowIndex,
          columnIndex,
          self.getBoundRowIndexFromViewRowIndex(rowIndex),
          self.getBoundColumnIndexFromViewColumnIndex(columnIndex),
        ]);
      });
    });

    self.dispatchEvent('afterpaste', {
      cells: affectedCells,
    });

    return rows.length;
  };
  self.getNextVisibleColumnIndex = function (visibleColumnIndex) {
    var x,
      s = self.getVisibleSchema();
    for (x = 0; x < s.length; x += 1) {
      if (s[x].columnIndex === visibleColumnIndex) {
        return s[x + 1].columnIndex;
      }
    }
    return -1;
  };
  self.getVisibleColumnIndexOf = function (columnIndex) {
    var x,
      s = self.getVisibleSchema();
    for (x = 0; x < s.length; x += 1) {
      if (s[x].columnIndex === columnIndex) {
        return x;
      }
    }
    return -1;
  };
  self.paste = function (event) {
    if (!self.attributes.editable) {
      return;
    }

    var defaultPrevented = self.dispatchEvent('beforepaste', {
      NativeEvent: event,
    });

    if (defaultPrevented) {
      return;
    }

    var clipboardItems = new Map(
      Array.from(event.clipboardData.items).map((item) => [item.type, item]),
    );

    // Supported MIME types, in order of preference:
    var supportedMimeTypes = ['text/html', 'text/csv', 'text/plain'];

    // The clipboard will often contain the same data in multiple formats,
    // which can be used depending on the context in which it's pasted. Here
    // we'll prefere more structured (HTML/CSV) over less structured, when
    // available, so we try to find those first:
    var pasteableItems = supportedMimeTypes
      .map((mimeType) => clipboardItems.get(mimeType))
      .filter((item) => !!item); // filter out not-found MIME types (= undefined)

    if (pasteableItems.length === 0) {
      console.warn(
        'Cannot find supported clipboard data type. Supported types are:',
        supportedMimeTypes.join(', '),
      );
      return;
    }

    var itemToPaste = pasteableItems[0];

    let startCell = [];
    for (
      let rowIndex = 0, len = self.selections.length;
      rowIndex < len;
      rowIndex++
    ) {
      const row = self.selections[rowIndex];
      if (row) {
        if (row[0] === undefined) return;
        startCell = [rowIndex, row[0] < 0 ? row[1] : row[0]];
        break;
      }
    }

    // itemToPaste is cleared once accessed (getData or getAsString),
    // so we need to store the type here, before reading its value:
    var pasteType = itemToPaste.type;

    itemToPaste.getAsString(function (pasteValue) {
      self.pasteData(pasteValue, pasteType, startCell[0], startCell[1]);

      self.draw();
    });
  };
  self.cut = function (event) {
    if (self.dispatchEvent('cut', { NativeEvent: event })) {
      return;
    }

    // Expecting instance of `ClipboardEvent` with `clipboardData` attribute
    if (!self.hasFocus || !event.clipboardData) {
      return;
    }

    self.copySelectedCellsToClipboard(event.clipboardData);

    const affectedCells = self.clearSelectedCells();

    self.dispatchEvent('aftercut', {
      cells: affectedCells,
    });

    requestAnimationFrame(() => self.draw());
    event.preventDefault();
  };
  self.copy = function (event) {
    if (self.dispatchEvent('copy', { NativeEvent: event })) {
      return;
    }

    // Expecting instance of `ClipboardEvent` with `clipboardData` attribute
    if (!self.hasFocus || !event.clipboardData) {
      return;
    }

    self.copySelectedCellsToClipboard(event.clipboardData);

    event.preventDefault();
  };
  return;
}
