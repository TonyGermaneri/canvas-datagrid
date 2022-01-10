/*jslint browser: true, unparam: true, todo: true*/
/*globals XMLSerializer: false, define: true, Blob: false, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
'use strict';

export default function (self) {
  var perfCounters = [],
    cachedImagesDrawn = false,
    drawCount = 0,
    perfWindowSize = 300,
    entityCount = [],
    hiddenFrozenColumnCount = 0,
    scrollDebugCounters = [],
    touchPPSCounters = [];
  self.htmlImageCache = {};
  // more heavyweight version than fillArray defined in intf.js
  function fillArray(low, high, step, def) {
    step = step || 1;
    var i = [],
      x;
    for (x = low; x <= high; x += step) {
      i[x] = def === undefined ? x : typeof def === 'function' ? def(x) : def;
    }
    return i;
  }
  function drawPerfLine(w, h, x, y, perfArr, arrIndex, max, color, useAbs) {
    var i = w / perfArr.length,
      r = h / max;
    x += self.canvasOffsetLeft;
    y += self.canvasOffsetTop;
    self.ctx.beginPath();
    self.ctx.moveTo(x, y + h);
    perfArr.forEach(function (n) {
      var val = arrIndex === undefined ? n : n[arrIndex],
        cx,
        cy;
      if (useAbs) {
        val = Math.abs(val);
      }
      cx = x + i;
      cy = y + h - val * r;
      self.ctx.lineTo(cx, cy);
      x += i;
    });
    self.ctx.moveTo(x + w, y + h);
    self.ctx.strokeStyle = color;
    self.ctx.stroke();
  }
  function drawOnAllImagesLoaded() {
    var loaded = true;
    Object.keys(self.htmlImageCache).forEach(function (html) {
      if (!self.htmlImageCache[html].img.complete) {
        loaded = false;
      }
    });
    if (loaded && !cachedImagesDrawn) {
      cachedImagesDrawn = true;
      self.draw();
    }
  }
  function drawHtml(cell) {
    var img,
      v = cell.innerHTML || cell.formattedValue,
      cacheKey =
        v.toString() + cell.rowIndex.toString() + cell.columnIndex.toString(),
      x = Math.round(cell.x + self.canvasOffsetLeft),
      y = Math.round(cell.y + self.canvasOffsetTop);
    if (self.htmlImageCache[cacheKey]) {
      img = self.htmlImageCache[cacheKey].img;
      if (
        self.htmlImageCache[cacheKey].height !== cell.height ||
        self.htmlImageCache[cacheKey].width !== cell.width
      ) {
        // height and width of the cell has changed, invalidate cache
        self.htmlImageCache[cacheKey] = undefined;
      } else {
        if (!img.complete) {
          return;
        }
        return self.ctx.drawImage(img, x, y);
      }
    } else {
      cachedImagesDrawn = false;
    }
    img = new Image(cell.width, cell.height);
    self.htmlImageCache[cacheKey] = {
      img,
      width: cell.width,
      height: cell.height,
    };
    img.onload = function () {
      self.ctx.drawImage(img, x, y);
      drawOnAllImagesLoaded();
    };
    img.src =
      'data:image/svg+xml;base64,' +
      btoa(
        '<svg xmlns="http://www.w3.org/2000/svg" width="' +
          cell.width +
          '" height="' +
          cell.height +
          '">\n' +
          '<foreignObject class="node" x="0" y="0" width="100%" height="100%">\n' +
          '<body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0;">\n' +
          v +
          '\n' +
          '</body>' +
          '</foreignObject>\n' +
          '</svg>\n',
      );
  }
  /**
   * @param {number[]} coords [x0,y0, x1,y1, x2,y2, ...]
   */
  function strokeLines(coords) {
    if (coords.length < 4) return;
    self.ctx.beginPath();
    self.ctx.moveTo(
      coords[0] + self.canvasOffsetLeft,
      coords[1] + self.canvasOffsetTop,
    );
    for (let i = 2; i < coords.length; i += 2) {
      const x = coords[i] + self.canvasOffsetLeft;
      const y = coords[i + 1] + self.canvasOffsetTop;
      self.ctx.lineTo(x, y);
    }
    self.ctx.stroke();
  }
  /**
   * @param {number} x based-X (left-top)
   * @param {number} y based-Y (left-top)
   * @param {number} width
   * @param {boolean} collapsed true: '+'; false: '-'
   */
  function drawGroupHandle(x, y, width, collapsed) {
    fillRect(x, y, width, width);
    strokeRect(x, y, width, width);
    const cx = x + width * 0.5;
    const cy = y + width * 0.5;
    strokeLines([x + width * 0.2, cy, x + width * 0.78, cy]);
    if (collapsed) strokeLines([cx, y + width * 0.22, cx, y + width * 0.8]);
  }
  function drawOrderByArrow(x, y) {
    var mt = self.style.columnHeaderOrderByArrowMarginTop * self.scale,
      ml = self.style.columnHeaderOrderByArrowMarginLeft * self.scale,
      mr = self.style.columnHeaderOrderByArrowMarginRight * self.scale,
      aw = self.style.columnHeaderOrderByArrowWidth * self.scale,
      ah = self.style.columnHeaderOrderByArrowHeight * self.scale;
    x += self.canvasOffsetLeft;
    y += self.canvasOffsetTop;
    self.ctx.fillStyle = self.style.columnHeaderOrderByArrowColor;
    self.ctx.strokeStyle = self.style.columnHeaderOrderByArrowBorderColor;
    self.ctx.beginPath();
    x = x + ml;
    y = y + mt;
    if (self.orderDirection === 'asc') {
      self.ctx.lineTo(x, y + ah);
      self.ctx.lineTo(x + aw, y + ah);
      self.ctx.lineTo(x + aw * 0.5, y);
      self.ctx.lineTo(x, y + ah);
    } else {
      self.ctx.moveTo(x, y);
      self.ctx.lineTo(x + aw, y);
      self.ctx.lineTo(x + aw * 0.5, y + ah);
      self.ctx.moveTo(x, y);
    }
    self.ctx.stroke();
    self.ctx.fill();
    return ml + aw + mr;
  }
  function drawTreeArrow(cell, x, y) {
    var mt = self.style.treeArrowMarginTop * self.scale,
      mr = self.style.treeArrowMarginRight * self.scale,
      ml = self.style.treeArrowMarginLeft * self.scale,
      aw = self.style.treeArrowWidth * self.scale,
      ah = self.style.treeArrowHeight * self.scale;
    x += self.canvasOffsetLeft;
    y += self.canvasOffsetTop;
    self.ctx.fillStyle = self.style.treeArrowColor;
    self.ctx.strokeStyle = self.style.treeArrowBorderColor;
    self.ctx.beginPath();
    x = x + ml;
    y = y + mt;
    if (self.openChildren[cell.rowIndex]) {
      self.ctx.moveTo(x, y);
      self.ctx.lineTo(x + aw, y);
      self.ctx.lineTo(x + aw * 0.5, y + ah);
      self.ctx.moveTo(x, y);
    } else {
      self.ctx.lineTo(x, y);
      self.ctx.lineTo(x + ah, y + aw * 0.5);
      self.ctx.lineTo(x, y + aw);
      self.ctx.lineTo(x, y);
    }
    self.ctx.stroke();
    self.ctx.fill();
    return ml + aw + mr;
  }
  function drawFilterButtonArrow(x, y) {
    var mt =
        ((self.style.filterButtonHeight - self.style.filterButtonArrowHeight) /
          2) *
        self.scale,
      ml =
        ((self.style.filterButtonWidth - self.style.filterButtonArrowWidth) /
          2) *
        self.scale,
      aw = self.style.filterButtonArrowWidth * self.scale,
      ah = self.style.filterButtonArrowHeight * self.scale;
    x += self.canvasOffsetLeft;
    y += self.canvasOffsetTop;
    self.ctx.fillStyle = self.style.filterButtonArrowColor;
    self.ctx.strokeStyle = self.style.filterButtonArrowBorderColor;
    self.ctx.beginPath();
    x = x + ml;
    y = y + mt;

    self.ctx.moveTo(x, y);
    self.ctx.lineTo(x + aw, y);
    self.ctx.lineTo(x + aw * 0.5, y + ah);
    self.ctx.moveTo(x, y);

    self.ctx.stroke();
    self.ctx.fill();
    return ml + aw;
  }
  function radiusRect(x, y, w, h, radius) {
    x += self.canvasOffsetLeft;
    y += self.canvasOffsetTop;
    var r = x + w,
      b = y + h;
    self.ctx.beginPath();
    self.ctx.moveTo(x + radius, y);
    self.ctx.lineTo(r - radius, y);
    self.ctx.quadraticCurveTo(r, y, r, y + radius);
    self.ctx.lineTo(r, y + h - radius);
    self.ctx.quadraticCurveTo(r, b, r - radius, b);
    self.ctx.lineTo(x + radius, b);
    self.ctx.quadraticCurveTo(x, b, x, b - radius);
    self.ctx.lineTo(x, y + radius);
    self.ctx.quadraticCurveTo(x, y, x + radius, y);
  }
  function fillRect(x, y, w, h) {
    x += self.canvasOffsetLeft;
    y += self.canvasOffsetTop;
    self.ctx.fillRect(x, y, w, h);
  }
  function strokeRect(x, y, w, h) {
    x += self.canvasOffsetLeft;
    y += self.canvasOffsetTop;
    self.ctx.strokeRect(x, y, w, h);
  }
  function fillText(text, x, y) {
    x += self.canvasOffsetLeft;
    y += self.canvasOffsetTop;
    self.ctx.fillText(text, x, y);
  }
  function fillCircle(x, y, r) {
    x += self.canvasOffsetLeft;
    y += self.canvasOffsetTop;
    self.ctx.beginPath();
    self.ctx.arc(x, y, r, 0, 2 * Math.PI);
    self.ctx.fill();
  }
  function strokeCircle(x, y, r) {
    x += self.canvasOffsetLeft;
    y += self.canvasOffsetTop;
    self.ctx.beginPath();
    self.ctx.arc(x, y, r, 0, 2 * Math.PI);
    self.ctx.stroke();
  }
  function clipFrozenArea(mode) {
    // 0 both, 1 rows, 2 cols
    // self.lastFrozenColumnPixel;
    // self.lastFrozenRowPixel;
    self.ctx.beginPath();
    if (mode === 0) {
      self.ctx.moveTo(self.lastFrozenColumnPixel, self.lastFrozenRowPixel);
      self.ctx.lineTo(self.lastFrozenColumnPixel, self.height);
      self.ctx.lineTo(self.width, self.height);
      self.ctx.lineTo(self.width, self.lastFrozenRowPixel);
    }
    if (mode === 1) {
      self.ctx.moveTo(0, self.lastFrozenRowPixel);
      self.ctx.lineTo(0, self.height);
      self.ctx.lineTo(self.width, self.height);
      self.ctx.lineTo(self.width, self.lastFrozenRowPixel);
    }
    if (mode === 2) {
      self.ctx.moveTo(self.lastFrozenColumnPixel, 0);
      self.ctx.lineTo(self.width, 0);
      self.ctx.lineTo(self.width, self.height);
      self.ctx.lineTo(self.lastFrozenColumnPixel, self.height);
    }
    self.ctx.clip();
  }
  function fillHandle(x, y, r) {
    if (self.style.selectionHandleType === 'circle') {
      return fillCircle(x, y, r * 0.5);
    }
    fillRect(x - r * 0.5, y - r * 0.5, r, r);
  }
  function strokeHandle(x, y, r) {
    if (self.style.selectionHandleType === 'circle') {
      return strokeCircle(x, y, r * 0.5);
    }
    strokeRect(x - r * 0.5, y - r * 0.5, r, r);
  }
  function addselectionHandle(c, pos) {
    var hw = self.style.selectionHandleSize,
      p = {
        tr: function () {
          fillHandle(c.x + c.width, c.y, hw);
          strokeHandle(c.x + c.width, c.y, hw);
        },
        br: function () {
          fillHandle(c.x + c.width, c.y + c.height, hw);
          strokeHandle(c.x + c.width, c.y + c.height, hw);
        },
        tl: function () {
          fillHandle(c.x, c.y, hw);
          strokeHandle(c.x, c.y, hw);
        },
        bl: function () {
          fillHandle(c.x, c.y + c.height, hw);
          strokeHandle(c.x, c.y + c.height, hw);
        },
      };
    p[pos]();
  }
  function addBorderLine(c, pos) {
    self.ctx.beginPath();
    var p = {
      t: function () {
        self.ctx.moveTo(
          c.x + self.canvasOffsetLeft,
          c.y + self.canvasOffsetTop,
        );
        self.ctx.lineTo(
          c.x + self.canvasOffsetLeft + c.width,
          c.y + self.canvasOffsetTop,
        );
      },
      r: function () {
        self.ctx.moveTo(
          c.x + self.canvasOffsetLeft + c.width,
          c.y + self.canvasOffsetTop,
        );
        self.ctx.lineTo(
          c.x + self.canvasOffsetLeft + c.width,
          c.y + self.canvasOffsetTop + c.height,
        );
      },
      b: function () {
        self.ctx.moveTo(
          c.x + self.canvasOffsetLeft,
          c.y + self.canvasOffsetTop + c.height,
        );
        self.ctx.lineTo(
          c.x + self.canvasOffsetLeft + c.width,
          c.y + self.canvasOffsetTop + c.height,
        );
      },
      l: function () {
        self.ctx.moveTo(
          c.x + self.canvasOffsetLeft,
          c.y + self.canvasOffsetTop,
        );
        self.ctx.lineTo(
          c.x + self.canvasOffsetLeft,
          c.y + self.canvasOffsetTop + c.height,
        );
      },
    };
    p[pos]();
    self.ctx.stroke();
  }
  function addEllipsis(text, width) {
    var c,
      w = 0;
    if (self.ellipsisCache[text] && self.ellipsisCache[text][width]) {
      return self.ellipsisCache[text][width];
    }
    //TODO Add ellipsis back when there is a fast way to do it
    w = self.ctx.measureText(text).width;
    self.ellipsisCache[text] = self.ellipsisCache[text] || {};
    c = { value: text, width: w };
    self.ellipsisCache[text][width] = c;
    return c;
  }
  function wrapText(cell, splitChar) {
    if (!cell.formattedValue) {
      return {
        lines: [{ width: 0, value: '' }],
        width: 0,
        height: cell.calculatedLineHeight,
      };
    }
    var max = 0,
      n = '\n',
      x,
      word,
      words = cell.formattedValue.split(splitChar),
      textHeight = cell.calculatedLineHeight,
      lines = [],
      out = [],
      wrap = self.style.cellWhiteSpace !== 'nowrap',
      autoResize = self.attributes.autoResizeRows && wrap,
      elWidth,
      et = self.attributes.ellipsisText,
      elClipLength,
      plWidth,
      clippedVal,
      ogWordWidth,
      previousLine,
      line = {
        width: 0,
        value: '',
      },
      cHeight = wrap ? cell.paddedHeight : cell.calculatedLineHeight;
    lines.push(line);
    elWidth = self.ctx.measureText(' ' + et).width;
    for (x = 0; x < words.length; x += 1) {
      word = words[x];
      var curSplitChar = word[word.length - 1] === '-' ? '' : splitChar;
      var measure = self.ctx.measureText(word + curSplitChar);
      if (line.width + measure.width + elWidth < cell.paddedWidth) {
        line.value += word + curSplitChar;
        line.width += measure.width;
        continue;
      }
      // if there is a hyphenated word that is too long
      // split it and add the split set to the array
      // then back up and re-read new split set
      // this behavior seems right, it might not be
      if (/\w-\w/.test(word) && cell.paddedWidth < measure.width) {
        var arr = word.split('-');
        arr = arr.map((item, index) => {
          return index === arr.length - 1 ? item : item + '-';
        });
        words.splice(x, 1, ...arr);
        x -= 1;
        continue;
      }
      line = {
        width: measure.width,
        value: word + curSplitChar,
      };
      if (x === 0) {
        lines = [];
        lines.push(line);
      }
      textHeight += cell.calculatedLineHeight;
      if (textHeight > cHeight && !autoResize) {
        if (lines.length === 0) {
          break;
        }
        elClipLength = 1;
        previousLine = lines[lines.length - 1];
        if (previousLine.width < cell.paddedWidth && words.length === 1) {
          break;
        }
        clippedVal = previousLine.value + word;
        plWidth = self.ctx.measureText(clippedVal + et).width;
        var originText = clippedVal;
        if (plWidth > cell.paddedWidth) {
          var stepLength = parseInt(clippedVal.length / 2);
          var direction = -1;
          while (stepLength > 0) {
            clippedVal = originText.substr(
              0,
              stepLength * direction + clippedVal.length,
            );
            plWidth = self.ctx.measureText(clippedVal + et).width;
            direction = plWidth > cell.paddedWidth ? -1 : 1;
            stepLength = parseInt(stepLength / 2);
          }
        }
        clippedVal =
          clippedVal + (originText.length != clippedVal.length ? et : '');
        previousLine.value = clippedVal;
        previousLine.width = plWidth;
        break;
      }
      if (x > 0) {
        lines.push(line);
      }
    }
    return {
      lines: lines,
      width: max,
      height: cell.calculatedLineHeight * lines.length,
    };
  }
  function drawText(cell) {
    var ll = cell.text.lines.length,
      h = cell.fontHeight * cell.lineHeight,
      x,
      line,
      wrap = self.style.cellWhiteSpace !== 'nowrap',
      textHeight = 0;
    for (x = 0; x < cell.text.lines.length; x += 1) {
      line = cell.text.lines[x];
      var vPos =
          Math.max(
            (cell.height -
              (wrap ? cell.text.height : cell.calculatedLineHeight)) *
              0.5,
            0,
          ) + h,
        hPos = cell.paddingLeft + cell.treeArrowWidth + cell.orderByArrowWidth;
      if (cell.horizontalAlignment === 'right') {
        hPos = cell.paddingLeft + cell.paddedWidth - line.width;
      } else if (cell.horizontalAlignment === 'center') {
        hPos =
          cell.paddingLeft +
          (cell.paddedWidth + cell.paddingRight) / 2 -
          line.width / 2;
      }
      if (cell.verticalAlignment === 'top') {
        vPos = cell.calculatedLineHeight;
      } else if (cell.verticalAlignment === 'bottom') {
        vPos = cell.height - cell.paddingBottom - cell.text.height;
      }
      line.height = h + cell.lineSpacing;
      line.offsetLeft = hPos;
      line.offsetTop = vPos;
      line.x = cell.x + hPos;
      line.y = cell.y + textHeight + vPos;
      textHeight += line.height;
      fillText(line.value, line.x, line.y);
    }
    if (self.attributes.debug && cell.active) {
      requestAnimationFrame(function () {
        self.ctx.font = self.style.debugFont;
        self.ctx.fillStyle = self.style.debugColor;
        fillText(
          JSON.stringify(
            {
              x: cell.x,
              y: cell.y,
              h: cell.height,
              w: cell.width,
              pw: cell.paddedWidth,
              idx: cell.columnIndex,
              idx_ord: cell.sortColumnIndex,
            },
            null,
            '\t',
          ),
          cell.x + 14,
          cell.y + 14,
        );
        fillText(
          JSON.stringify(
            cell.text.lines.map(function (l) {
              return { w: l.width, v: l.value.length };
            }),
            null,
            '\t',
          ),
          cell.x + 14,
          cell.y + 30,
        );
      });
    }
  }
  function getFrozenColumnsWidth() {
    var w = 0,
      s = self.getSchema(),
      x = 0,
      n = Math.min(self.frozenColumn, s.length),
      collapsedGroups = self.getCollapsedColumnGroups(),
      column;
    hiddenFrozenColumnCount = 0;
    while (x < n) {
      column = s[x];
      if (column.hidden) {
        hiddenFrozenColumnCount += 1;
      } else {
        const isCollapsed =
          collapsedGroups.findIndex(
            (group) => x >= group.from && x <= group.to,
          ) >= 0;
        if (isCollapsed) {
          hiddenFrozenColumnCount += 1;
        } else {
          w += self.getColumnWidth(x);
        }
      }
      x += 1;
    }
    return w;
  }
  /**
   * Redraws the grid. No matter what the change, this is the only method required to refresh everything.
   * @memberof canvasDatagrid
   * @name draw
   * @method
   */
  // r = literal row index
  // rd = row data array
  // i = user order index
  // o = literal data index
  // y = y drawing cursor
  // x = x drawing cursor
  // s = visible schema array
  // cx = current x drawing cursor sub calculation var
  // cy = current y drawing cursor sub calculation var
  // a = static cell (like corner cell)
  // p = perf counter
  // l = data length
  // u = current cell
  // h = current height
  // w = current width
  self.draw = function (internal) {
    if (self.dispatchEvent('beforedraw', {})) {
      return;
    }
    if (!self.isChildGrid && (!self.height || !self.width)) {
      return;
    }
    if (self.isChildGrid && internal) {
      requestAnimationFrame(self.parentGrid.draw);
      return;
    }
    if (self.intf.visible === false) {
      return;
    }
    // initial values
    var checkScrollHeight,
      rowHeaderCell,
      p,
      cx,
      cy,
      treeGrid,
      rowOpen,
      rowHeight,
      cornerCell,
      y,
      x,
      c,
      h,
      w,
      schema,
      rowIndex,
      rowData,
      aCell,
      viewData = self.viewData || [],
      bc = self.style.gridBorderCollapse === 'collapse',
      selectionBorders = [],
      moveBorders = [],
      selectionHandles = [],
      rowHeaders = [],
      l = viewData.length,
      u = self.currentCell || {},
      columnHeaderCellHeight = self.getColumnHeaderCellHeight(),
      rowHeaderCellWidth = self.getRowHeaderCellWidth(),
      rowGroupsAreaWidth = self.getRowGroupAreaWidth(),
      columnGroupsAreaHeight = self.getColumnGroupAreaHeight(),
      /** key: boundRowIndex, value: `{y,h}` */
      rowGroupsRectInfo = {},
      /** value: `{y,h}` */
      rowGroupsFrozenInfo = {},
      /** key: columnIndex, value: `{x,w}` */
      columnGroupsRectInfo = {},
      collapsedColumnGroups = self.getCollapsedColumnGroups(),
      collapsedRowGroups = self.getCollapsedRowGroups(),
      cellHeight = self.style.cellHeight;
    drawCount += 1;
    p = performance.now();
    self.visibleRowHeights = [];
    // if data length has changed, there is no way to know
    if (viewData.length > self.orders.rows.length) {
      self.createRowOrders();
    }
    function saveRowGroupsRectInfo(cell) {
      let index = cell.boundRowIndex;
      if (index >= -1 === false)
        if (cell.rowIndex === -1) index = -1;
        else return;
      if (rowGroupsRectInfo[index]) return;
      rowGroupsRectInfo[index] = { y: cell.y, h: cell.height };
    }
    function saveColumnGroupsRectInfo(cell) {
      const index = cell.columnIndex;
      if (columnGroupsRectInfo[index]) return;
      columnGroupsRectInfo[index] = { x: cell.x, w: cell.width };
    }
    /**
     * @param {number} columnIndex
     * @returns {boolean}
     */
    function isColumnCollapsedByGroup(columnIndex) {
      return (
        collapsedColumnGroups.findIndex(
          (group) => columnIndex >= group.from && columnIndex <= group.to,
        ) >= 0
      );
    }

    function drawScrollBars() {
      var drawCorner,
        en = self.scrollBox.entities,
        m = self.style.scrollBarBoxMargin * 2;
      self.ctx.strokeStyle = self.style.scrollBarBorderColor;
      self.ctx.lineWidth = self.style.scrollBarBorderWidth;
      if (self.frozenColumn > 0) {
        en.horizontalBox.x =
          rowHeaderCellWidth +
          self.style.scrollBarBoxMargin +
          self.scrollCache.x[self.frozenColumn - 1] +
          (en.horizontalBar.width -
            self.scrollCache.x[self.frozenColumn - 1] -
            self.scrollBox.scrollBoxWidth) *
            (self.scrollBox.scrollLeft / self.scrollBox.scrollWidth);
      } else {
        en.horizontalBox.x =
          rowHeaderCellWidth +
          self.style.scrollBarBoxMargin +
          (en.horizontalBar.width - self.scrollBox.scrollBoxWidth) *
            (self.scrollBox.scrollLeft / self.scrollBox.scrollWidth);
      }
      en.verticalBox.y =
        columnHeaderCellHeight +
        self.style.scrollBarBoxMargin +
        self.scrollCache.y[self.frozenRow] +
        (en.verticalBar.height -
          self.scrollBox.scrollBoxHeight -
          self.scrollCache.y[self.frozenRow]) *
          (self.scrollBox.scrollTop / self.scrollBox.scrollHeight);
      if (self.scrollBox.horizontalBarVisible) {
        self.ctx.fillStyle = self.style.scrollBarBackgroundColor;
        fillRect(
          en.horizontalBar.x,
          en.horizontalBar.y,
          en.horizontalBar.width + m,
          en.horizontalBar.height,
        );
        strokeRect(
          en.horizontalBar.x,
          en.horizontalBar.y,
          en.horizontalBar.width + m,
          en.horizontalBar.height,
        );
        self.ctx.fillStyle = self.style.scrollBarBoxColor;
        if (self.scrollBox.horizontalBoxVisible) {
          if (/horizontal/.test(u.context)) {
            self.ctx.fillStyle = self.style.scrollBarActiveColor;
          }
          radiusRect(
            en.horizontalBox.x,
            en.horizontalBox.y,
            en.horizontalBox.width,
            en.horizontalBox.height,
            self.style.scrollBarBoxBorderRadius,
          );
          self.ctx.stroke();
          self.ctx.fill();
        }
        drawCorner = true;
        self.visibleCells.unshift(en.horizontalBar);
        self.visibleCells.unshift(en.horizontalBox);
      }
      if (self.scrollBox.verticalBarVisible) {
        self.ctx.fillStyle = self.style.scrollBarBackgroundColor;
        fillRect(
          en.verticalBar.x,
          en.verticalBar.y,
          en.verticalBar.width,
          en.verticalBar.height + m,
        );
        strokeRect(
          en.verticalBar.x,
          en.verticalBar.y,
          en.verticalBar.width,
          en.verticalBar.height + m,
        );
        if (self.scrollBox.verticalBoxVisible) {
          self.ctx.fillStyle = self.style.scrollBarBoxColor;
          if (/vertical/.test(u.context)) {
            self.ctx.fillStyle = self.style.scrollBarActiveColor;
          }
          radiusRect(
            en.verticalBox.x,
            en.verticalBox.y,
            en.verticalBox.width,
            en.verticalBox.height,
            self.style.scrollBarBoxBorderRadius,
          );
          self.ctx.stroke();
          self.ctx.fill();
        }
        drawCorner = true;
        self.visibleCells.unshift(en.verticalBar);
        self.visibleCells.unshift(en.verticalBox);
      }
      if (drawCorner) {
        //corner
        self.ctx.strokeStyle = self.style.scrollBarCornerBorderColor;
        self.ctx.fillStyle = self.style.scrollBarCornerBackgroundColor;
        radiusRect(
          en.corner.x,
          en.corner.y,
          en.corner.width,
          en.corner.height,
          0,
        );
        self.ctx.stroke();
        self.ctx.fill();
        self.visibleCells.unshift(en.corner);
      }
    }
    function createHandlesOverlayArray(cell) {
      if (self.attributes.allowMovingSelection || self.mobile) {
        if (
          cell.selectionBorderTop &&
          cell.selectionBorderRight &&
          self.mobile
        ) {
          selectionHandles.push([cell, 'tr']);
          cell.selectionHandle = 'tr';
        }
        if (
          cell.selectionBorderTop &&
          cell.selectionBorderLeft &&
          self.mobile
        ) {
          selectionHandles.push([cell, 'tl']);
          cell.selectionHandle = 'tl';
        }
        if (
          cell.selectionBorderBottom &&
          cell.selectionBorderLeft &&
          self.mobile
        ) {
          selectionHandles.push([cell, 'bl']);
          cell.selectionHandle = 'bl';
        }
        if (
          cell.selectionBorderBottom &&
          cell.selectionBorderRight &&
          (self.attributes.selectionHandleBehavior !== 'none' || self.mobile)
        ) {
          selectionHandles.push([cell, 'br']);
          cell.selectionHandle = 'br';
        }
      }
    }
    function createBorderOverlayArray(
      cell,
      drawArray,
      propPrefix,
      offsetPoint,
    ) {
      offsetPoint = offsetPoint || { x: 0, y: 0 };
      cell.selectionBorder = '';
      if (
        !cell.isRowHeader &&
        self.selections[cell.rowIndex + -offsetPoint.y] &&
        self.selections[cell.rowIndex + -offsetPoint.y].indexOf(
          cell.columnIndex + -offsetPoint.x,
        ) !== -1
      ) {
        if (
          (!self.selections[cell.rowIndex - 1 + -offsetPoint.y] ||
            self.selections[cell.rowIndex - 1 + -offsetPoint.y].indexOf(
              cell.columnIndex + -offsetPoint.x,
            ) === -1 ||
            cell.rowIndex === 0) &&
          !cell.isHeader
        ) {
          drawArray.push([cell, 't']);
          cell[propPrefix + 'BorderTop'] = true;
          cell[propPrefix + 'Border'] += 't';
        }
        if (
          !self.selections[cell.rowIndex + 1 + -offsetPoint.y] ||
          self.selections[cell.rowIndex + 1 + -offsetPoint.y].indexOf(
            cell.columnIndex + -offsetPoint.x,
          ) === -1
        ) {
          drawArray.push([cell, 'b']);
          cell[propPrefix + 'BorderBottom'] = true;
          cell[propPrefix + 'Border'] += 'b';
        }
        if (
          !self.selections[cell.rowIndex + -offsetPoint.y] ||
          cell.columnIndex === 0 ||
          self.selections[cell.rowIndex + -offsetPoint.y].indexOf(
            cell.columnIndex - 1 + -offsetPoint.x,
          ) === -1
        ) {
          drawArray.push([cell, 'l']);
          cell[propPrefix + 'BorderLeft'] = true;
          cell[propPrefix + 'Border'] += 'l';
        }
        if (
          !self.selections[cell.rowIndex + -offsetPoint.y] ||
          cell.columnIndex === schema.length ||
          self.selections[cell.rowIndex + -offsetPoint.y].indexOf(
            cell.columnIndex + 1 + -offsetPoint.x,
          ) === -1
        ) {
          drawArray.push([cell, 'r']);
          cell[propPrefix + 'BorderRight'] = true;
          cell[propPrefix + 'Border'] += 'r';
        }
      }
    }
    function drawCell(rowData, rowOrderIndex, rowIndex) {
      return function drawEach(header, headerIndex, columnOrderIndex) {
        if (header.hidden) {
          return 0;
        }
        var cellStyle = header.style || 'cell',
          cellGridAttributes,
          cell,
          isHeader = /HeaderCell/.test(cellStyle),
          isCorner = /cornerCell/.test(cellStyle),
          isRowHeader = 'rowHeaderCell' === cellStyle,
          isColumnHeader = 'columnHeaderCell' === cellStyle,
          isFilterable =
            self.filterable.rows.includes(rowIndex) &&
            self.filterable.columns.includes(headerIndex),
          wrap = self.style.cellWhiteSpace !== 'nowrap',
          selected =
            self.selections[rowOrderIndex] &&
            self.selections[rowOrderIndex].indexOf(columnOrderIndex) !== -1,
          hovered =
            self.hovers.rowIndex === rowOrderIndex &&
            (self.attributes.hoverMode === 'row' ||
              self.hovers.columnIndex === columnOrderIndex),
          openedFilter =
            self.selectedFilterButton.rowIndex == rowIndex &&
            self.selectedFilterButton.columnIndex == headerIndex,
          active =
            self.activeCell.rowIndex === rowOrderIndex &&
            self.activeCell.columnIndex === columnOrderIndex,
          isColumnHeaderCellCap = cellStyle === 'columnHeaderCellCap',
          rawValue = rowData ? rowData[header.name] : undefined,
          isGrid = header.type === 'canvas-datagrid',
          activeHeader =
            (self.orders.rows[self.activeCell.rowIndex] === rowOrderIndex ||
              self.orders.columns[self.activeCell.columnIndex] ===
                headerIndex) &&
            (columnOrderIndex === -1 || rowOrderIndex === -1)
              ? isRowHeader
                ? 'activeRowHeaderCell'
                : 'activeColumnHeaderCell'
              : false,
          val,
          f = self.formatters[header.type || 'string'],
          orderByArrowSize = 0,
          treeArrowSize = 0,
          cellWidth = self.sizes.columns[headerIndex] || header.width,
          ev = {
            value: rawValue,
            row: rowData,
            header: header,
          };
        if (isColumnHeaderCellCap) {
          cellWidth = w - x;
        }
        // if no data or schema are defined, a width is provided to the stub column
        if (cellWidth === undefined) {
          cellWidth = self.style.cellWidth;
        }
        cellWidth = cellWidth * self.scale;
        if (x + cellWidth + self.style.cellBorderWidth < 0) {
          x += cellWidth + self.style.cellBorderWidth;
        }
        if (active && cellStyle !== 'cornerCell') {
          cellStyle = 'activeCell';
        }
        if (self.visibleRows.indexOf(rowIndex) === -1 && !isHeader) {
          self.visibleRows.push(rowIndex);
        }
        val = self.dispatchEvent('formatcellvalue', ev);
        cx = x;
        cy = y;
        if (cellStyle === 'cornerCell') {
          cx = 0;
          cy = 0;
        } else if (isRowHeader) {
          cx = 0;
        } else if (isHeader) {
          cy = 0;
        }
        cell = {
          type: isGrid ? 'canvas-datagrid-cell' : header.type,
          style: cellStyle,
          nodeType: 'canvas-datagrid-cell',
          x: cx,
          y: cy,
          fontHeight: (self.style[cellStyle + 'FontHeight'] || 0) * self.scale,
          horizontalAlignment: self.style[cellStyle + 'HorizontalAlignment'],
          verticalAlignment: self.style[cellStyle + 'VerticalAlignment'],
          paddingLeft:
            (self.style[cellStyle + 'PaddingLeft'] || 0) * self.scale,
          paddingTop: (self.style[cellStyle + 'PaddingTop'] || 0) * self.scale,
          paddingRight:
            (self.style[cellStyle + 'PaddingRight'] || 0) * self.scale,
          paddingBottom:
            (self.style[cellStyle + 'PaddingBottom'] || 0) * self.scale,
          whiteSpace: self.style.cellWhiteSpace,
          lineHeight: self.style.cellLineHeight,
          lineSpacing: self.style.cellLineSpacing,
          offsetTop: self.canvasOffsetTop + cy,
          offsetLeft: self.canvasOffsetLeft + cx,
          scrollTop: self.scrollBox.scrollTop,
          scrollLeft: self.scrollBox.scrollLeft,
          active: active || activeHeader,
          hovered: hovered,
          selected: selected,
          width: cellWidth,
          height: cellHeight,
          offsetWidth: cellWidth,
          offsetHeight: cellHeight,
          parentNode: self.intf.parentNode,
          offsetParent: self.intf.parentNode,
          data: rowData,
          isCorner: isCorner,
          isHeader: isHeader,
          isColumnHeader: isColumnHeader,
          isColumnHeaderCellCap: isColumnHeaderCellCap,
          isRowHeader: isRowHeader,
          isFilterable: isFilterable,
          openedFilter: openedFilter,
          rowOpen: rowOpen,
          header: header,

          columnIndex: columnOrderIndex,
          rowIndex: rowOrderIndex,

          viewRowIndex: rowOrderIndex,
          viewColumnIndex: columnOrderIndex,

          boundRowIndex: self.getBoundRowIndexFromViewRowIndex(rowOrderIndex),
          boundColumnIndex: self.getBoundColumnIndexFromViewColumnIndex(
            columnOrderIndex,
          ),

          sortColumnIndex: headerIndex,
          sortRowIndex: rowIndex,

          isGrid: isGrid,
          isNormal: !isGrid && !isCorner && !isHeader,
          gridId: (self.attributes.name || '') + rowIndex + ':' + headerIndex,
          parentGrid: self.intf,
          innerHTML: '',
          activeHeader: activeHeader,
          value:
            isHeader && !isRowHeader ? header.title || header.name : rawValue,
        };
        cell.calculatedLineHeight =
          cell.fontHeight * cell.lineHeight + cell.lineSpacing;
        cell.paddedWidth = cell.width - cell.paddingRight - cell.paddingLeft;
        cell.paddedHeight = cell.height - cell.paddingTop - cell.paddingBottom;
        ev.cell = cell;
        cell.userHeight = cell.isHeader ? self.sizes.rows[-1] : rowHeight;
        cell.userWidth = cell.isHeader
          ? self.sizes.columns.cornerCell
          : self.sizes.columns[headerIndex];
        self.visibleCells.unshift(cell);
        saveRowGroupsRectInfo(cell);
        saveColumnGroupsRectInfo(cell);
        if (self.dispatchEvent('beforerendercell', ev)) {
          return;
        }
        self.ctx.fillStyle = self.style[cellStyle + 'BackgroundColor'];
        self.ctx.strokeStyle = self.style[cellStyle + 'BorderColor'];
        self.ctx.lineWidth = self.style[cellStyle + 'BorderWidth'];
        if (hovered) {
          self.ctx.fillStyle = self.style[cellStyle + 'HoverBackgroundColor'];
          self.ctx.strokeStyle = self.style[cellStyle + 'HoverBorderColor'];
        }
        if (selected) {
          self.ctx.fillStyle =
            self.style[cellStyle + 'SelectedBackgroundColor'];
          self.ctx.strokeStyle = self.style[cellStyle + 'SelectedBorderColor'];
        }
        if (activeHeader) {
          self.ctx.fillStyle = self.style[activeHeader + 'BackgroundColor'];
        }
        self.dispatchEvent('rendercell', ev);
        if (cell.isGrid) {
          if (cell.height !== rowHeight) {
            cell.height = rowHeight || self.style.cellHeightWithChildGrid;
            checkScrollHeight = true;
          }
          cell.width =
            self.sizes.columns[headerIndex] ||
            self.style.cellWidthWithChildGrid;
        }
        if (rowOpen && !cell.isRowHeader) {
          cell.height = self.sizes.rows[rowIndex] || self.style.cellHeight;
        }
        if (!cell.isGrid) {
          fillRect(cx, cy, cell.width, cell.height);
          strokeRect(cx, cy, cell.width, cell.height);
        }
        self.ctx.save();
        radiusRect(cell.x, cell.y, cell.width, cell.height, 0);
        self.ctx.clip();
        self.dispatchEvent('afterrendercell', ev);
        if (cell.height !== cellHeight && !(rowOpen && !cell.isRowHeader)) {
          self.sizes.rows[isHeader ? -1 : rowIndex] = cell.height;
          checkScrollHeight = true;
        }
        if (cell.width !== cellWidth) {
          self.sizes.columns[headerIndex] = cell.width;
          checkScrollHeight = true;
        }
        if (isRowHeader && self.attributes.tree) {
          if (!self.dispatchEvent('rendertreearrow', ev)) {
            treeArrowSize = drawTreeArrow(
              cell,
              self.style[cellStyle + 'PaddingLeft'],
              cy,
              0,
            );
          }
        }
        if ((self.attributes.showRowNumbers && isRowHeader) || !isRowHeader) {
          if (cell.isGrid && !self.dispatchEvent('beforerendercellgrid', ev)) {
            if (!self.childGrids[cell.gridId]) {
              // HACK: this only allows setting of the child grids styles if data is set _after_
              // this is less than desirable.  An interface needs to be made to effect the
              // style of all cell grids.  One for individual grids already exists.
              cellGridAttributes = self.cellGridAttributes;
              cellGridAttributes.name = self.attributes.saveAppearance
                ? cell.gridId
                : undefined;
              cellGridAttributes.component = false;
              cellGridAttributes.parentNode = cell;
              cellGridAttributes.data = rawValue;
              ev.cellGridAttributes = cellGridAttributes;
              if (self.dispatchEvent('beforecreatecellgrid', ev)) {
                return;
              }
              self.childGrids[cell.gridId] = self.createGrid(
                cellGridAttributes,
              );
              self.sizes.rows[rowIndex] =
                self.sizes.rows[rowIndex] || self.style.cellGridHeight;
              checkScrollHeight = true;
            }
            cell.grid = self.childGrids[cell.gridId];
            cell.grid.parentNode = cell;
            cell.grid.visible = true;
            cell.grid.draw();
            self.dispatchEvent('rendercellgrid', ev);
          } else if (!cell.isGrid) {
            if (self.childGrids[cell.gridId]) {
              self.childGrids[cell.gridId].parentNode.offsetHeight = 0;
            }
            if (isHeader && self.orderBy === header.name) {
              if (!self.dispatchEvent('renderorderbyarrow', ev)) {
                orderByArrowSize = drawOrderByArrow(
                  cx + self.style[cellStyle + 'PaddingLeft'],
                  0,
                );
              }
            }
            self.ctx.fillStyle = self.style[cellStyle + 'Color'];
            if (hovered) {
              self.ctx.fillStyle = self.style[cellStyle + 'HoverColor'];
            }
            if (selected) {
              self.ctx.fillStyle = self.style[cellStyle + 'SelectedColor'];
            }
            if (activeHeader) {
              self.ctx.fillStyle = self.style[activeHeader + 'Color'];
            }
            cell.treeArrowWidth = treeArrowSize;
            cell.orderByArrowWidth = orderByArrowSize;
            // create text ref to see if height needs to expand
            val = val !== undefined ? val : f ? f(ev) : '';
            if (val === undefined && !f) {
              val = '';
              console.warn(
                'canvas-datagrid: Unknown format ' +
                  header.type +
                  ' add a cellFormater',
              );
            }
            cell.formattedValue = (val !== undefined && val !== null
              ? val
              : ''
            ).toString();
            if (
              self.columnFilters &&
              self.columnFilters[val] !== undefined &&
              isHeader
            ) {
              cell.formattedValue = self.attributes.filterTextPrefix + val;
            }
            self.ctx.font =
              self.style[cellStyle + 'FontHeight'] * self.scale +
              'px ' +
              self.style[cellStyle + 'FontName'];
            if (!self.dispatchEvent('formattext', ev)) {
              cell.text = wrapText(cell, ' ');
            }
            if (!self.dispatchEvent('rendertext', ev)) {
              if (cell.innerHTML || header.type === 'html') {
                drawHtml(cell);
              } else {
                drawText(cell);
              }

              if (wrap && cell.text && cell.text.height > rowHeight) {
                self.sizes.rows[isHeader ? -1 : rowIndex] = cell.text.height;
                checkScrollHeight = true;
              }
            }
          }
        }
        if (active) {
          aCell = cell;
        }
        createBorderOverlayArray(cell, selectionBorders, 'selection');
        // createBorderOverlayArray calculates data for createHandlesOverlayArray so it must go 2nd
        createHandlesOverlayArray(cell);
        if (self.movingSelection) {
          createBorderOverlayArray(cell, moveBorders, 'move', self.moveOffset);
        }
        self.ctx.restore();

        if (isFilterable) {
          drawFilterButton(cell);
        }

        // Gaps may occur in row numbers between consecutively rendered rows
        // when we are filtering. We draw attention to this by drawing a thick
        // border overlapping the two consecutive row headers. If sorting, visible
        // row numbers stay the same (i.e. they don't correspond to the underlying
        // data's row number), so we do not show row gaps in that case.
        const isSorting =
          self.orderings.columns && self.orderings.columns.length > 0;

        if (
          isRowHeader &&
          self.attributes.showRowNumbers &&
          self.attributes.showRowNumberGaps &&
          isSorting === false
        ) {
          const previousRowNumber = self.getBoundRowIndexFromViewRowIndex(
            rowOrderIndex - 1,
          );
          let hasRowGap =
            previousRowNumber !== undefined &&
            cell.boundRowIndex > 0 &&
            cell.boundRowIndex - previousRowNumber > 1;
          if (hasRowGap && collapsedRowGroups.length > 0) {
            hasRowGap =
              collapsedRowGroups.find(
                (group) =>
                  group.from === previousRowNumber &&
                  group.to === cell.boundRowIndex,
              ) >= 0;
          }

          if (hasRowGap) {
            const barHeight = self.style.rowHeaderCellRowNumberGapHeight;
            const barColor = self.style.rowHeaderCellRowNumberGapColor;

            self.ctx.save();

            self.ctx.fillStyle = barColor;

            fillRect(cell.x, cell.y - barHeight / 2, cell.width, barHeight);

            self.ctx.restore();
          }
        }

        x += cell.width + (bc ? 0 : self.style.cellBorderWidth);
        return cell.width;
      };
    }
    function drawFilterButton(cell, ev) {
      var posX = cell.x + cell.width - self.style.filterButtonWidth - 1;
      var posY = cell.y + cell.height - self.style.filterButtonHeight - 2;
      if (self.dispatchEvent('beforerenderfilterbutton', ev)) {
        return;
      }
      self.ctx.save();
      self.ctx.strokeStyle = self.style.filterButtonBorderColor;
      self.ctx.fillStyle = self.style.filterButtonBackgroundColor;
      if (cell.openedFilter) {
        self.ctx.fillStyle = self.style.filterButtonActiveBackgroundColor;
      } else if (cell.hovered && self.hovers.onFilterButton) {
        self.ctx.fillStyle = self.style.filterButtonHoverBackgroundColor;
      }
      radiusRect(
        posX,
        posY,
        self.style.filterButtonWidth,
        self.style.filterButtonHeight,
        self.style.filterButtonBorderRadius,
      );
      self.ctx.stroke();
      self.ctx.fill();
      drawFilterButtonArrow(posX, posY);
      self.ctx.clip();
      self.dispatchEvent('afterrenderfilterbutton', ev);
      self.ctx.restore();
    }
    function drawRowHeader(rowData, rowIndex, rowOrderIndex) {
      if (self.attributes.showRowHeaders) {
        x = 0;

        // When filtering we'd like to display the actual row numbers,
        // as it is in the unfiltered data, instead of simply the viewed
        // row index + 1. If rowIndex > viewData.length, it's a new row
        // added to the end, and we want to render that new row's number
        const filteredRowNumber =
          self.viewData && rowIndex < self.viewData.length
            ? self.getBoundRowIndexFromViewRowIndex(rowIndex) + 1
            : self.originalData
            ? self.originalData.length + 1
            : rowOrderIndex + 1;

        const rowHeaderValue =
          self.hasActiveFilters() || self.hasCollapsedRowGroup()
            ? filteredRowNumber
            : rowIndex + 1;

        const rowHeaderCell = { rowHeaderCell: rowHeaderValue };
        const headerDescription = {
          name: 'rowHeaderCell',
          width: self.sizes.columns[-1] || self.style.rowHeaderCellWidth,
          style: 'rowHeaderCell',
          type: 'string',
          data: rowHeaderValue,
          index: -1,
        };
        rowOpen = self.openChildren[rowIndex];
        drawCell(rowHeaderCell, rowOrderIndex, rowIndex)(
          headerDescription,
          -1,
          -1,
        );
      }
    }
    function drawHeaders() {
      var d,
        g = schema.length,
        i,
        o,
        columnHeaderCell,
        header,
        nonFrozenHeaderWidth;
      function drawHeaderColumnRange(start, end) {
        end = Math.min(end, g);
        for (o = start; o < end; o += 1) {
          i = self.orders.columns[o];
          header = schema[i];
          if (!header.hidden && !isColumnCollapsedByGroup(o)) {
            d = {
              title: header.title,
              name: header.name,
              width: header.width || self.style.cellWidth,
              style: 'columnHeaderCell',
              type: 'string',
              index: o,
              order: i,
            };
            columnHeaderCell = {
              columnHeaderCell: header.title || header.name,
            };
            x += drawCell(columnHeaderCell, -1, -1)(d, i, o);
            if (x > self.width + self.scrollBox.scrollLeft) {
              break;
            }
          }
        }
      }
      rowHeaders.forEach(function (rArgs, rhIndex) {
        y = rArgs[3];
        cellHeight = rArgs[4];
        if (rhIndex === self.frozenRow) {
          self.ctx.save();
          radiusRect(
            0,
            self.lastFrozenRowPixel,
            self.width,
            self.height - self.lastFrozenRowPixel,
            0,
          );
          self.ctx.clip();
        }
        drawRowHeader(rArgs[0], rArgs[1], rArgs[2]);
      });
      self.ctx.restore();
      if (self.attributes.showColumnHeaders) {
        x =
          -self.scrollBox.scrollLeft +
          self.scrollPixelLeft +
          self.style.columnHeaderCellBorderWidth;
        if (self.attributes.showRowHeaders) {
          x += rowHeaderCellWidth;
        }
        y = 0;
        // cell height might have changed during drawing
        cellHeight = self.getColumnHeaderCellHeight();
        drawHeaderColumnRange(self.scrollIndexLeft, g);
        nonFrozenHeaderWidth = x;
        x = self.style.columnHeaderCellBorderWidth;
        if (self.attributes.showRowHeaders) {
          x += rowHeaderCellWidth;
        }
        drawHeaderColumnRange(0, self.frozenColumn);
        // fill in the space right of the headers
        x = nonFrozenHeaderWidth;
        if (x < w) {
          c = {
            name: '',
            width: self.style.scrollBarWidth,
            style: 'columnHeaderCellCap',
            isColumnHeaderCell: true,
            isColumnHeaderCellCap: true,
            type: 'string',
            index: schema.length,
          };
          drawCell({ endCap: '' }, -1, -1)(c, -1, -1);
        }
        // fill in the space right of the headers
        if (self.attributes.showRowHeaders) {
          cornerCell = { cornerCell: '' };
          x = 0;
          c = {
            name: 'cornerCell',
            width: self.style.rowHeaderCellWidth,
            style: 'cornerCell',
            type: 'string',
            index: -1,
          };
          drawCell(cornerCell, -1, -1)(c, -1, -1);
        }
      }
    }
    function drawRow(rowOrderIndex, rowIndex) {
      var headerIndex,
        treeHeight,
        rowSansTreeHeight,
        columnOrderIndex,
        g = schema.length;
      if (y - cellHeight * 2 > h) {
        return false;
      }
      rowData = viewData[rowOrderIndex];
      rowOpen = self.openChildren[rowOrderIndex];
      rowSansTreeHeight =
        (self.sizes.rows[rowOrderIndex] || self.style.cellHeight) * self.scale;
      treeHeight = (rowOpen ? self.sizes.trees[rowOrderIndex] : 0) * self.scale;
      rowHeight = rowSansTreeHeight + treeHeight;
      if (y < -rowHeight) {
        return false;
      }
      if (self.attributes.showRowHeaders) {
        x += rowHeaderCellWidth;
      }
      cellHeight = rowHeight;
      //draw normal columns
      for (
        columnOrderIndex = self.scrollIndexLeft;
        columnOrderIndex < g;
        columnOrderIndex += 1
      ) {
        if (!isColumnCollapsedByGroup(columnOrderIndex)) {
          headerIndex = self.orders.columns[columnOrderIndex];
          x += drawCell(rowData, rowOrderIndex, rowIndex)(
            schema[headerIndex],
            headerIndex,
            columnOrderIndex,
          );
        }
        if (x > self.width) {
          self.scrollIndexRight = columnOrderIndex;
          self.scrollPixelRight = x;
          break;
        }
      }
      //draw frozen columns
      x = 0;
      if (self.attributes.showRowHeaders) {
        x += rowHeaderCellWidth;
      }
      for (
        columnOrderIndex = 0;
        columnOrderIndex < self.frozenColumn;
        columnOrderIndex += 1
      ) {
        if (!isColumnCollapsedByGroup(columnOrderIndex)) {
          headerIndex = self.orders.columns[columnOrderIndex];
          x += drawCell(rowData, rowOrderIndex, rowIndex)(
            schema[headerIndex],
            headerIndex,
            columnOrderIndex,
          );
        }
        if (x > self.width) {
          break;
        }
      }
      self.lastFrozenColumnPixel = x;
      // cell height might have changed during drawing
      cellHeight = rowHeight;
      x =
        -self.scrollBox.scrollLeft +
        self.scrollPixelLeft +
        self.style.cellBorderWidth;
      // don't draw a tree for the new row
      treeGrid = self.childGrids[rowOrderIndex];
      if (rowOrderIndex !== viewData.length && rowOpen) {
        treeGrid.visible = true;
        treeGrid.parentNode = {
          offsetTop: y + rowSansTreeHeight + self.canvasOffsetTop,
          offsetLeft: rowHeaderCellWidth - 1 + self.canvasOffsetLeft,
          offsetHeight: treeHeight,
          offsetWidth:
            self.width - rowHeaderCellWidth - self.style.scrollBarWidth - 1,
          offsetParent: self.intf.parentNode,
          parentNode: self.intf.parentNode,
          style: self.style,
          nodeType: 'canvas-datagrid-tree',
          scrollTop: self.scrollBox.scrollTop,
          scrollLeft: self.scrollBox.scrollLeft,
          rowIndex: rowOrderIndex,
          columnGroupsAreaHeight: columnGroupsAreaHeight,
          rowGroupsAreaWidth: rowGroupsAreaWidth,
        };
        if (self.intf.parentNode) {
          const {
            columnGroupsAreaHeight,
            rowGroupsAreaWidth,
          } = self.intf.parentNode;
          treeGrid.parentNode.columnGroupsAreaHeight +=
            columnGroupsAreaHeight || 0;
          treeGrid.parentNode.rowGroupsAreaWidth += rowGroupsAreaWidth || 0;
        }
        self.visibleCells.unshift({
          rowIndex: rowOrderIndex,
          columnIndex: 0,
          y: treeGrid.parentNode.offsetTop,
          x: treeGrid.parentNode.offsetLeft,
          height: treeGrid.height,
          width: treeGrid.width,
          style: 'tree-grid',
          type: treeGrid.parentNode.nodeType,
        });
        treeGrid.draw();
      } else if (treeGrid) {
        treeGrid.parentNode.offsetHeight = 0;
        delete self.sizes.trees[rowOrderIndex];
      }
      rowHeaders.push([rowData, rowOrderIndex, rowIndex, y, rowHeight]);
      self.visibleRowHeights[rowOrderIndex] = rowHeight;
      y += cellHeight + (bc ? 0 : self.style.cellBorderWidth);
      return true;
    }
    function initDraw() {
      self.visibleRows = [];
      schema = self.getSchema();
      self.visibleCells = [];
      self.visibleGroups = [];
      self.canvasOffsetTop = self.isChildGrid ? self.parentNode.offsetTop : 0.5;
      self.canvasOffsetLeft = self.isChildGrid
        ? self.parentNode.offsetLeft
        : -0.5;
      h = self.height;
      w = self.width;
    }
    function drawBackground() {
      radiusRect(0, 0, w, h, 0);
      self.ctx.clip();
      self.ctx.fillStyle = self.style.gridBackgroundColor;
      fillRect(0, 0, w, h);
    }
    function initGroupArea() {
      self.ctx.translate(rowGroupsAreaWidth, columnGroupsAreaHeight);
    }
    function drawGroupArea() {
      const mx = rowGroupsAreaWidth;
      const my = columnGroupsAreaHeight;
      const frozenColumnsWidth = getFrozenColumnsWidth();
      const frozenRowsHeight =
        rowGroupsFrozenInfo.y + rowGroupsFrozenInfo.h - columnHeaderCellHeight;
      const onTheLeft = self.attributes.columnGroupIndicatorPosition === 'left';
      const onTheTop = self.attributes.rowGroupIndicatorPosition === 'top';

      /** @type {CanvasRenderingContext2D} */
      const ctx = self.ctx;
      ctx.save();
      ctx.fillStyle = self.style.groupingAreaBackgroundColor;
      fillRect(0, -my, w, my);
      fillRect(-mx, -my, mx, h);
      ctx.restore();

      //#region Columns Grouping
      /** it extends `self.groupedRows` */
      const groupedColumns = [];
      for (let row = 0; row < self.groupedColumns.length; row++) {
        const groups = self.groupedColumns[row];
        for (let j = 0; j < groups.length; j++) {
          groupedColumns.push(Object.assign({ row }, groups[j]));
        }
      }
      if (groupedColumns.length > 0) {
        const rowHeight = self.style.columnGroupRowHeight;
        const toggleHandleSize = rowHeight * 0.5;
        const toggleHandlePadding = (rowHeight - toggleHandleSize) * 0.5;

        for (let i = 0; i < groupedColumns.length; i++) {
          const group = groupedColumns[i];
          const { row, collapsed } = group;

          const topY = -my + row * rowHeight;
          const centerY = topY + rowHeight * 0.5;
          const bottomY = topY + rowHeight - toggleHandlePadding;
          const leftmostX =
            rowHeaderCellWidth - toggleHandleSize - toggleHandlePadding;

          const drawGroupHandleAtX = (x) =>
            drawGroupHandle(
              x,
              topY + toggleHandlePadding,
              toggleHandleSize,
              group.collapsed,
            );
          const pushToVisibleGroups = (leftX, rightX) =>
            self.visibleGroups.push({
              type: 'c',
              collapsed,
              from: group.from,
              to: group.to,
              row,
              x: leftX + mx,
              y: topY + my,
              x2: rightX + mx,
              y2: bottomY + my,
            });

          //#region check the relationship between this group and frozen columns
          const crossTheFrozen =
            group.from < self.frozenColumn && group.to >= self.frozenColumn;
          const notInFrozen = group.from >= self.frozenColumn;
          //#endregion

          if (collapsed) {
            let leftX = leftmostX + toggleHandleSize;
            // This group is not sticking on the first column
            if (group.from > 0) {
              let colIndex = group.to + 1;
              let col = columnGroupsRectInfo[colIndex];
              if (!col) {
                colIndex = group.from - 1;
                col = columnGroupsRectInfo[colIndex];
                if (!col) continue; // don't draw this group indicator because it is invisible
                leftX = col.x + col.w - toggleHandleSize * 0.5;
              } else {
                leftX = col.x + toggleHandlePadding;
              }
              if (colIndex >= self.frozenColumn) {
                const compare =
                  frozenColumnsWidth + rowHeaderCellWidth - toggleHandlePadding;
                // don't draw this group indicator because it is hidden by frozen columns
                if (leftX < compare) continue;
              }
            }
            const rightX = leftX + toggleHandleSize;
            ctx.save();
            ctx.strokeStyle = self.style.groupIndicatorColor;
            ctx.fillStyle = self.style.groupIndicatorBackgroundColor;
            drawGroupHandleAtX(leftX);
            ctx.restore();
            pushToVisibleGroups(leftX, rightX);
          } // end of collapsed group

          /** @type {number} pointer for loop */
          let ptr;
          let left = columnGroupsRectInfo[group.from];
          let right = columnGroupsRectInfo[group.to];

          let containsBegining = true;
          let containsEnd = true;
          ptr = group.from;
          while (!left && ptr < group.to) {
            left = columnGroupsRectInfo[++ptr];
            containsBegining = false;
          }
          ptr = group.to;
          while (!right && ptr > group.from) {
            right = columnGroupsRectInfo[--ptr];
            containsEnd = false;
          }
          if (!left || !right) continue;
          let rightX = right.x + right.w;
          let leftX = left.x;
          if (crossTheFrozen) {
            const rightCompare = columnGroupsRectInfo[self.frozenColumn - 1];
            if (rightCompare) {
              let compareX = rightCompare.x + rightCompare.w;
              if (!onTheLeft) compareX += toggleHandleSize;
              if (compareX >= rightX) {
                right = rightCompare;
                rightX = right.x + right.w;
                containsEnd = false;
              }
            }
          }

          let minLeftX =
            rowHeaderCellWidth + (notInFrozen ? frozenColumnsWidth : 0);
          if (rightX + (onTheLeft ? 0 : toggleHandleSize) < minLeftX) continue;

          rightX -= toggleHandlePadding;
          leftX += toggleHandlePadding;

          ctx.save();
          ctx.strokeStyle = self.style.groupIndicatorColor;
          ctx.fillStyle = self.style.groupIndicatorBackgroundColor;
          const lineCoords = [];

          if (onTheLeft) {
            // avoid lines from two groups be overlapping
            minLeftX += toggleHandlePadding * 2;
            if (leftX < minLeftX) leftX = minLeftX;
            if (group.from === 0) leftX -= toggleHandlePadding * 2;
            if (rightX >= leftX) {
              lineCoords.push(leftX, centerY, rightX, centerY);
              if (containsEnd) lineCoords.push(rightX, bottomY);
            } else {
              rightX = leftX;
            }

            leftX -= toggleHandleSize;
            drawGroupHandleAtX(leftX);
            // add more clickable area into `visibleGroups`
            rightX += toggleHandlePadding - 1;
          } else {
            // handle on the right
            if (leftX < minLeftX) leftX = minLeftX;
            if (group.from === 0) leftX -= toggleHandlePadding * 2;
            if (containsEnd) {
              if (group.to === self.frozenColumn - 1) {
                rightX -= toggleHandleSize;
              } else {
                rightX += toggleHandlePadding * 2;
              }
              drawGroupHandleAtX(rightX);
            }
            if (leftX > rightX) {
              leftX = rightX;
            } else {
              if (group.from === 0) {
                containsBegining = true;
                leftX = leftmostX + toggleHandleSize;
              }
              if (containsBegining) lineCoords.push(leftX, bottomY);
              lineCoords.push(leftX, centerY, rightX, centerY);
            }

            // add more clickable area into `visibleGroups`
            leftX -= toggleHandlePadding + 1;
            if (containsEnd) rightX += toggleHandleSize;
          }
          strokeLines(lineCoords);
          ctx.restore();
          pushToVisibleGroups(leftX, rightX);
        }
      }
      //#endregion Columns Grouping

      //#region Rows Grouping
      /** it extends `self.groupedRows` */
      const groupedRows = [];
      for (let col = 0; col < self.groupedRows.length; col++) {
        const groups = self.groupedRows[col];
        for (let j = 0; j < groups.length; j++) {
          groupedRows.push(Object.assign({ col }, groups[j]));
        }
      }
      if (groupedRows.length > 0) {
        const colWidth = self.style.rowGroupColumnWidth;
        const toggleHandleSize = colWidth * 0.5;
        const toggleHandlePadding = (colWidth - toggleHandleSize) * 0.5;

        for (let i = 0; i < groupedRows.length; i++) {
          const group = groupedRows[i];
          const { col, collapsed } = group;

          const leftX = -mx + col * colWidth;
          const centerX = leftX + colWidth * 0.5;
          const rightX = leftX + colWidth - toggleHandlePadding;
          const topmostY =
            columnHeaderCellHeight - toggleHandleSize - toggleHandlePadding;

          const drawGroupHandleAtY = (y) =>
            drawGroupHandle(
              leftX + toggleHandlePadding,
              y,
              toggleHandleSize,
              group.collapsed,
            );
          const pushToVisibleGroups = (topY, bottomY) =>
            self.visibleGroups.push({
              type: 'r',
              collapsed,
              from: group.from,
              to: group.to,
              col,
              x: leftX + mx,
              y: topY + my,
              x2: rightX + mx,
              y2: bottomY + my,
            });

          //#region check the relationship between this group and frozen columns
          const crossTheFrozen =
            group.from < self.frozenRow && group.to >= self.frozenRow;
          const notInFrozen = group.from >= self.frozenRow;
          //#endregion

          if (collapsed) {
            let topY = topmostY + toggleHandleSize;
            // This group is not sticking on the first column
            if (group.from > 0) {
              let rowIndex = group.to + 1;
              let row = rowGroupsRectInfo[rowIndex];
              if (!row) {
                rowIndex = group.from - 1;
                row = rowGroupsRectInfo[rowIndex];
                if (!row) continue; // don't draw this group indicator because it is invisible
                topY = row.y + row.h - toggleHandleSize * 0.5;
              } else {
                topY = row.y;
              }
              if (rowIndex >= self.frozenRow) {
                const compare =
                  frozenRowsHeight +
                  columnHeaderCellHeight -
                  toggleHandlePadding;
                // don't draw this group indicator because it is hidden by frozen columns
                if (topY < compare) continue;
              }
            }
            const bottomY = topY + toggleHandleSize;
            ctx.save();
            ctx.strokeStyle = self.style.groupIndicatorColor;
            ctx.fillStyle = self.style.groupIndicatorBackgroundColor;
            drawGroupHandleAtY(topY);
            ctx.restore();
            pushToVisibleGroups(topY, bottomY);
          } // end of collapsed group

          /** @type {number} pointer for loop */
          let ptr;
          let top = rowGroupsRectInfo[group.from];
          let bottom = rowGroupsRectInfo[group.to];

          let containsBegining = true;
          let containsEnd = true;
          ptr = group.from;
          while (!top && ptr < group.to) {
            top = rowGroupsRectInfo[++ptr];
            containsBegining = false;
          }
          ptr = group.to;
          while (!bottom && ptr > group.from) {
            bottom = rowGroupsRectInfo[--ptr];
            containsEnd = false;
          }
          if (!top || !bottom) continue;
          let bottomY = bottom.y + bottom.h;
          let topY = top.y;
          if (crossTheFrozen) {
            const bottomCompare = rowGroupsRectInfo[self.frozenRow - 1];
            if (bottomCompare) {
              let compareY = bottomCompare.y + bottomCompare.h;
              if (!onTheTop) compareY += toggleHandleSize;
              if (compareY >= bottomY) {
                bottom = bottomCompare;
                bottomY = bottom.y + bottom.h;
                containsEnd = false;
              }
            }
          }

          let minTopY =
            columnHeaderCellHeight + (notInFrozen ? frozenRowsHeight : 0);
          if (bottomY + (onTheTop ? 0 : toggleHandleSize) < minTopY) continue;

          bottomY -= toggleHandlePadding;
          topY += toggleHandlePadding;

          ctx.save();
          ctx.strokeStyle = self.style.groupIndicatorColor;
          ctx.fillStyle = self.style.groupIndicatorBackgroundColor;
          const lineCoords = [];

          if (onTheTop) {
            // avoid lines from two groups be overlapping
            minTopY += toggleHandlePadding * 2;
            if (topY < minTopY) topY = minTopY;
            if (group.from === 0) topY -= toggleHandlePadding * 2;
            if (bottomY >= topY) {
              lineCoords.push(centerX, topY, centerX, bottomY);
              if (containsEnd) lineCoords.push(rightX, bottomY);
            } else {
              bottomY = topY;
            }

            topY -= toggleHandleSize;
            drawGroupHandleAtY(topY);

            // add more clickable area into `visibleGroups`
            bottomY += toggleHandlePadding - 1;
          } else {
            // handle on the bottom
            if (topY < minTopY) topY = minTopY;
            if (group.from === 0) topY -= toggleHandlePadding * 2;
            if (containsEnd) {
              if (group.to === self.frozenRow - 1) {
                bottomY -= toggleHandleSize;
              } else {
                // bottomY += toggleHandlePadding * 2;
              }
              drawGroupHandleAtY(bottomY);
            }
            if (topY > bottomY) {
              topY = bottomY;
            } else {
              if (group.from === 0) {
                containsBegining = true;
                topY = topmostY + toggleHandleSize;
              }
              if (containsBegining) lineCoords.push(rightX, topY);
              lineCoords.push(centerX, topY, centerX, bottomY);
              // add more clickable area into `visibleGroups`
              topY -= toggleHandlePadding + 1;
            }
            // add more clickable area into `visibleGroups`
            if (containsEnd) bottomY += toggleHandleSize;
          }
          strokeLines(lineCoords);
          ctx.restore();
          pushToVisibleGroups(topY, bottomY);
        }
      }
      //#endregion Rows Grouping
    }
    function drawFrozenRows() {
      var rowOrderIndex,
        ln = Math.min(viewData.length, self.frozenRow);
      x =
        -self.scrollBox.scrollLeft +
        self.scrollPixelLeft +
        self.style.cellBorderWidth;
      y = columnHeaderCellHeight;
      for (rowIndex = 0; rowIndex < ln; rowIndex += 1) {
        rowOrderIndex = self.orders.rows[rowIndex];
        if (!drawRow(rowOrderIndex, rowIndex)) {
          break;
        }
      }
      if (self.attributes.allowFreezingRows) {
        // HACK great, another stupid magic number.
        // Background will appear as a 0.5px artifact behind the row freeze bar without this hack
        y +=
          self.style.frozenMarkerBorderWidth +
          self.style.frozenMarkerWidth -
          0.4999999999;
      }
      self.lastFrozenRowPixel = y;
    }
    function drawRows() {
      self.ctx.save();
      if (self.frozenRow > 0) {
        radiusRect(
          0,
          self.lastFrozenRowPixel,
          self.width,
          self.height - self.lastFrozenRowPixel,
          0,
        );
        self.ctx.clip();
      }
      var columnOrderIndex,
        rowOrderIndex,
        headerIndex,
        g = schema.length;
      x =
        -self.scrollBox.scrollLeft +
        self.scrollPixelLeft +
        self.style.cellBorderWidth;
      if (!self.attributes.snapToRow) {
        y +=
          -self.scrollBox.scrollTop +
          self.scrollPixelTop +
          self.style.cellBorderWidth;
      }
      for (
        rowIndex = self.frozenRow + self.scrollIndexTop;
        rowIndex < l;
        rowIndex += 1
      ) {
        rowOrderIndex = self.orders.rows[rowIndex];
        self.scrollIndexBottom = rowIndex;
        self.scrollPixelBottom = y;
        if (!drawRow(rowOrderIndex, rowIndex)) {
          break;
        }
      }
      if (self.attributes.showNewRow) {
        if (self.attributes.showRowHeaders) {
          x += rowHeaderCellWidth;
        }
        rowHeight = cellHeight = self.style.cellHeight;
        rowOpen = false;
        for (
          columnOrderIndex = self.scrollIndexLeft;
          columnOrderIndex < g;
          columnOrderIndex += 1
        ) {
          if (!isColumnCollapsedByGroup(columnOrderIndex)) {
            headerIndex = self.orders.columns[columnOrderIndex];
            x += drawCell(self.newRow, viewData.length, viewData.length)(
              schema[headerIndex],
              headerIndex,
              columnOrderIndex,
            );
          }
          if (x > self.width + self.scrollBox.scrollLeft) {
            break;
          }
        }
        rowHeaders.push([
          self.newRow,
          viewData.length,
          viewData.length,
          y,
          rowHeight,
        ]);
      }
      self.ctx.restore();
    }
    function drawMoveMarkers() {
      if (!self.movingSelection) {
        return;
      }
      self.ctx.lineWidth = self.style.moveOverlayBorderWidth;
      self.ctx.strokeStyle = self.style.moveOverlayBorderColor;
      self.ctx.setLineDash(self.style.moveOverlayBorderSegments);
      moveBorders.forEach(function (c) {
        addBorderLine(c[0], c[1]);
      });
      self.ctx.setLineDash([]);
    }
    function drawReorderMarkers() {
      if (!self.reorderObject) {
        return;
      }
      var b = {
          height: self.reorderObject.height,
          width: self.reorderObject.width,
          x: self.reorderObject.x + self.reorderObject.dragOffset.x,
          y: self.reorderObject.y + self.reorderObject.dragOffset.y,
        },
        m = {
          width: w,
          height: h,
          x: 0,
          y: 0,
        };
      self.ctx.fillStyle = self.style.reorderMarkerBackgroundColor;
      self.ctx.lineWidth = self.style.reorderMarkerBorderWidth;
      self.ctx.strokeStyle = self.style.reorderMarkerBorderColor;
      if (self.dragMode === 'row-reorder') {
        for (var k = 0; k < self.selections.length; k++) {
          if (!self.selections[k] || k == self.reorderObject.rowIndex) continue;
          b.height += self.getRowHeight(k);
        }
        b.width = w;
        b.x = 0;
        m.width = w;
        m.height = self.currentCell.height;
        m.y = self.currentCell.y;
        fillRect(b.x, b.y, b.width, b.height);
        strokeRect(b.x, b.y, b.width, b.height);
        self.ctx.lineWidth = self.style.reorderMarkerIndexBorderWidth;
        self.ctx.strokeStyle = self.style.reorderMarkerIndexBorderColor;
        if (
          self.currentCell.rowIndex !== self.reorderObject.rowIndex &&
          self.currentCell.rowIndex > -1 &&
          self.currentCell.rowIndex < l
        ) {
          addBorderLine(
            m,
            self.reorderTarget.sortRowIndex > self.reorderObject.sortRowIndex
              ? 'b'
              : 't',
          );
        }
      } else if (self.dragMode === 'column-reorder' && self.reorderObject) {
        var selectedColumns = self.selections[0];
        for (var k = 1; k < selectedColumns.length; k++) {
          b.width += self.getColumnWidth(
            self.orders.columns[selectedColumns[k]],
          );
        }
        b.height = h;
        b.y = 0;
        m.height = h;
        m.width = self.currentCell.width;
        m.y = 0;
        m.x = self.currentCell.x;
        fillRect(b.x, b.y, b.width, b.height);
        strokeRect(b.x, b.y, b.width, b.height);
        self.ctx.lineWidth = self.style.reorderMarkerIndexBorderWidth;
        self.ctx.strokeStyle = self.style.reorderMarkerIndexBorderColor;
        if (
          self.currentCell.sortColumnIndex !==
            self.reorderObject.sortColumnIndex &&
          self.currentCell.sortColumnIndex > -1 &&
          self.currentCell.sortColumnIndex < schema.length
        ) {
          addBorderLine(
            m,
            self.reorderTarget.columnIndex > self.reorderObject.columnIndex
              ? 'r'
              : 'l',
          );
        }
      }
    }
    function drawBorder() {
      self.ctx.lineWidth = self.style.gridBorderWidth;
      self.ctx.strokeStyle = self.style.gridBorderColor;
      strokeRect(0, 0, self.width, self.height);
    }
    function drawSelectionBorders() {
      self.ctx.lineWidth = self.style.selectionOverlayBorderWidth;
      self.ctx.strokeStyle = self.style.selectionOverlayBorderColor;
      function dsb(c) {
        addBorderLine(c[0], c[1]);
      }
      selectionBorders
        .filter(function (c) {
          return (
            c[0].rowIndex < self.frozenRow &&
            c[0].columnIndex < self.frozenColumn
          );
        })
        .forEach(dsb);
      self.ctx.save();
      clipFrozenArea(0);
      selectionBorders
        .filter(function (c) {
          return (
            c[0].rowIndex >= self.frozenRow &&
            c[0].columnIndex >= self.frozenColumn
          );
        })
        .forEach(dsb);
      self.ctx.restore();
      self.ctx.save();
      clipFrozenArea(1);
      selectionBorders
        .filter(function (c) {
          return (
            c[0].rowIndex >= self.frozenRow &&
            c[0].columnIndex < self.frozenColumn
          );
        })
        .forEach(dsb);
      self.ctx.restore();
      self.ctx.save();
      clipFrozenArea(2);
      selectionBorders
        .filter(function (c) {
          return (
            c[0].rowIndex < self.frozenRow &&
            c[0].columnIndex >= self.frozenColumn
          );
        })
        .forEach(dsb);
      self.ctx.restore();
    }
    function drawSelectionHandles() {
      if (self.mobile || self.attributes.allowMovingSelection) {
        self.ctx.lineWidth = self.style.selectionHandleBorderWidth;
        self.ctx.strokeStyle = self.style.selectionHandleBorderColor;
        self.ctx.fillStyle = self.style.selectionHandleColor;
        selectionHandles.forEach(function (c) {
          addselectionHandle(c[0], c[1]);
          var az = self.attributes.touchSelectHandleZone / 2,
            ax =
              c[0].x + (c[1] === 'tl' || c[1] === 'bl' ? 0 : c[0].width) - az,
            ay =
              c[0].y + (c[1] === 'bl' || c[1] === 'br' ? c[0].height : 0) - az;
          self.visibleCells.unshift({
            x: ax,
            y: ay,
            height: self.style.selectionHandleSize + az,
            width: self.style.selectionHandleSize + az,
            style: 'selection-handle-' + c[1],
          });
        });
      }
    }
    function drawActiveCell() {
      if (!aCell) {
        return;
      }
      self.ctx.save();
      var cl =
          self.activeCell.columnIndex + 1 > self.frozenColumn ||
          self.activeCell.rowIndex + 1 > self.frozenRow,
        acx = cl ? self.lastFrozenColumnPixel : 0,
        acy = cl ? self.lastFrozenRowPixel : 0,
        acw = cl ? self.width - self.lastFrozenColumnPixel : self.width,
        ach = cl ? self.height - self.lastFrozenRowPixel : self.height;
      radiusRect(acx, acy, acw, ach, 0);
      self.ctx.clip();
      if (self.attributes.selectionMode === 'row') {
        if (self.activeCell && self.activeCell.rowIndex === aCell.rowIndex) {
          self.ctx.lineWidth = self.style.activeCellOverlayBorderWidth;
          self.ctx.strokeStyle = self.style.activeCellOverlayBorderColor;
          strokeRect(
            1,
            aCell.y,
            self.getHeaderWidth() + rowHeaderCellWidth,
            self.visibleRowHeights[aCell.rowIndex],
          );
        }
      } else {
        self.ctx.lineWidth = self.style.activeCellOverlayBorderWidth;
        self.ctx.strokeStyle = self.style.activeCellOverlayBorderColor;
        strokeRect(aCell.x, aCell.y, aCell.width, aCell.height);
      }
      self.ctx.restore();
    }
    function drawFrozenMarkers() {
      var my = self.lastFrozenRowPixel - self.style.frozenMarkerWidth,
        mx = self.lastFrozenColumnPixel - self.style.frozenMarkerBorderWidth,
        xHover =
          self.currentCell && self.currentCell.style === 'frozen-row-marker',
        yHover =
          self.currentCell && self.currentCell.style === 'frozen-column-marker';
      self.ctx.lineWidth = self.style.frozenMarkerBorderWidth;
      if (self.attributes.allowFreezingColumns) {
        self.ctx.fillStyle = yHover
          ? self.style.frozenMarkerHoverColor
          : self.style.frozenMarkerColor;
        self.ctx.strokeStyle = yHover
          ? self.style.frozenMarkerHoverBorderColor
          : self.style.frozenMarkerBorderColor;
        fillRect(mx, 0, self.style.frozenMarkerWidth, self.height);
        strokeRect(mx, 0, self.style.frozenMarkerWidth, self.height);
        self.visibleCells.unshift({
          x: mx,
          y: 0,
          height: self.height,
          width:
            self.style.frozenMarkerWidth + self.style.frozenMarkerBorderWidth,
          style: 'frozen-column-marker',
        });
      }
      if (self.attributes.allowFreezingRows) {
        self.ctx.fillStyle = xHover
          ? self.style.frozenMarkerHoverColor
          : self.style.frozenMarkerColor;
        self.ctx.strokeStyle = xHover
          ? self.style.frozenMarkerHoverBorderColor
          : self.style.frozenMarkerBorderColor;
        fillRect(0, my, self.width, self.style.frozenMarkerWidth);
        strokeRect(0, my, self.width, self.style.frozenMarkerWidth);
        const height =
          self.style.frozenMarkerWidth + self.style.frozenMarkerBorderWidth;
        self.visibleCells.unshift({
          x: 0,
          y: my,
          height,
          width: self.width,
          style: 'frozen-row-marker',
        });
        rowGroupsFrozenInfo = { y: my, h: height };
      }
      if (self.freezeMarkerPosition) {
        self.ctx.fillStyle = self.style.frozenMarkerActiveColor;
        self.ctx.strokeStyle = self.style.frozenMarkerActiveBorderColor;
        if (self.dragMode === 'frozen-column-marker') {
          fillRect(
            self.freezeMarkerPosition.x,
            0,
            self.style.frozenMarkerWidth,
            self.height,
          );
          strokeRect(
            self.freezeMarkerPosition.x,
            0,
            self.style.frozenMarkerWidth,
            self.height,
          );
        } else {
          fillRect(
            0,
            self.freezeMarkerPosition.y,
            self.width,
            self.style.frozenMarkerWidth,
          );
          strokeRect(
            0,
            self.freezeMarkerPosition.y,
            self.width,
            self.style.frozenMarkerWidth,
          );
        }
      }
    }
    function drawPerfLines() {
      if (!self.attributes.showPerformance) {
        return;
      }
      var pw = 250,
        px =
          self.width -
          pw -
          self.style.scrollBarWidth -
          self.style.scrollBarBorderWidth * 2,
        py = columnHeaderCellHeight,
        ph = 100;
      if (scrollDebugCounters.length === 0) {
        scrollDebugCounters = fillArray(0, perfWindowSize, 1, function () {
          return [0, 0];
        });
      }
      if (touchPPSCounters.length === 0) {
        touchPPSCounters = fillArray(0, perfWindowSize, 1, function () {
          return [0, 0];
        });
      }
      if (entityCount.length === 0) {
        entityCount = fillArray(0, perfWindowSize, 1, 0);
      }
      self.ctx.lineWidth = 0.5;
      function dpl(name, perfArr, arrIndex, max, color, useAbs, rowIndex) {
        var v;
        drawPerfLine(pw, ph, px, py, perfArr, arrIndex, max, color, useAbs);
        self.ctx.fillStyle = color;
        fillRect(3 + px, py + 9 + rowIndex * 11, 8, 8);
        self.ctx.fillStyle = self.style.debugPerfChartTextColor;
        v = arrIndex !== undefined ? perfArr[0][arrIndex] : perfArr[0];
        fillText(
          name + ' ' + (isNaN(v) ? 0 : v).toFixed(3),
          14 + px,
          py + 16 + rowIndex * 11,
        );
      }
      self.ctx.textAlign = 'left';
      self.ctx.font = self.style.debugFont;
      self.ctx.fillStyle = self.style.debugPerfChartBackground;
      fillRect(px, py, pw, ph);
      [
        [
          'Scroll Height',
          scrollDebugCounters,
          0,
          self.scrollBox.scrollHeight,
          self.style.debugScrollHeightColor,
          false,
        ],
        [
          'Scroll Width',
          scrollDebugCounters,
          1,
          self.scrollBox.scrollWidth,
          self.style.debugScrollWidthColor,
          false,
        ],
        [
          'Performance',
          perfCounters,
          undefined,
          200,
          self.style.debugPerformanceColor,
          false,
        ],
        [
          'Entities',
          entityCount,
          undefined,
          1500,
          self.style.debugEntitiesColor,
          false,
        ],
        [
          'TouchPPSX',
          touchPPSCounters,
          0,
          1000,
          self.style.debugTouchPPSXColor,
          true,
        ],
        [
          'TouchPPSY',
          touchPPSCounters,
          1,
          1000,
          self.style.debugTouchPPSYColor,
          true,
        ],
      ].forEach(function (i, index) {
        i.push(index);
        dpl.apply(null, i);
      });
      self.ctx.fillStyle = self.style.debugPerfChartBackground;
      entityCount.pop();
      entityCount.unshift(self.visibleCells.length);
      scrollDebugCounters.pop();
      scrollDebugCounters.unshift([
        self.scrollBox.scrollTop,
        self.scrollBox.scrollLeft,
      ]);
      touchPPSCounters.pop();
      touchPPSCounters.unshift([self.yPPS, self.xPPS]);
    }
    function drawDebug() {
      self.ctx.save();
      var d;
      if (self.attributes.showPerformance || self.attributes.debug) {
        if (perfCounters.length === 0) {
          perfCounters = fillArray(0, perfWindowSize, 1, 0);
        }
        perfCounters.pop();
        perfCounters.unshift(performance.now() - p);
      }
      if (!self.attributes.debug) {
        self.ctx.restore();
        return;
      }
      self.ctx.font = self.style.debugFont;
      d = {};
      d.perf = (
        perfCounters.reduce(function (a, b) {
          return a + b;
        }, 0) / Math.min(drawCount, perfCounters.length)
      ).toFixed(1);
      d.perfDelta = perfCounters[0].toFixed(1);
      d.frozenColumnsWidth = getFrozenColumnsWidth();
      d.htmlImages = Object.keys(self.htmlImageCache).length;
      d.reorderObject =
        'x: ' +
        (self.reorderObject || { columnIndex: 0 }).columnIndex +
        ', y: ' +
        (self.reorderObject || { rowIndex: 0 }).rowIndex;
      d.reorderTarget =
        'x: ' +
        (self.reorderTarget || { columnIndex: 0 }).columnIndex +
        ', y: ' +
        (self.reorderTarget || { rowIndex: 0 }).rowIndex;
      d.scale = self.scale;
      d.startScale = self.startScale;
      d.scaleDelta = self.scaleDelta;
      d.zoomDeltaStart = self.zoomDeltaStart;
      d.touchLength = self.touchLength;
      d.touches =
        'y0: ' +
        (self.touchPosition || { y: 0 }).y +
        ' y1: ' +
        (self.touchPosition1 || { y: 0 }).y;
      d.scrollBox = self.scrollBox.toString();
      d.scrollIndex =
        'x: ' + self.scrollIndexLeft + ', y: ' + self.scrollIndexTop;
      d.scrollPixel =
        'x: ' + self.scrollPixelLeft + ', y: ' + self.scrollPixelTop;
      d.canvasOffset =
        'x: ' + self.canvasOffsetLeft + ', y: ' + self.canvasOffsetTop;
      d.touchDelta = 'x: ' + self.touchDelta.x + ', y: ' + self.touchDelta.y;
      d.touchAnimateTo =
        'x: ' + self.touchAnimateTo.x + ', y: ' + self.touchAnimateTo.y;
      d.scrollAnimation =
        'x: ' + self.scrollAnimation.x + ', y: ' + self.scrollAnimation.y;
      d.touchPPS = 'x: ' + self.xPPS + ', y: ' + self.yPPS;
      d.touchPPST = 'x: ' + self.xPPST + ', y: ' + self.yPPST;
      d.touchDuration = self.touchDuration;
      d.pointerLockPosition = self.pointerLockPosition
        ? self.pointerLockPosition.x + ', ' + self.pointerLockPosition.y
        : '';
      d.size = 'w: ' + self.width + ', h: ' + self.height;
      d.mouse = 'x: ' + self.mouse.x + ', y: ' + self.mouse.y;
      d.touch = !self.touchStart
        ? ''
        : 'x: ' + self.touchStart.x + ', y: ' + self.touchStart.y;
      d.entities = self.visibleCells.length;
      d.hasFocus = self.hasFocus;
      d.dragMode = self.dragMode;
      if (self.currentCell) {
        d.columnIndex = self.currentCell.columnIndex;
        d.rowIndex = self.currentCell.rowIndex;
        d.sortColumnIndex = self.currentCell.sortColumnIndex;
        d.sortRowIndex = self.currentCell.sortRowIndex;
        d.context = self.currentCell.context;
        d.dragContext = self.currentCell.dragContext;
        d.style = self.currentCell.style;
        d.type = self.currentCell.type;
      }
      self.ctx.textAlign = 'right';
      self.ctx.fillStyle = self.style.debugBackgroundColor;
      fillRect(0, 0, self.width, self.height);
      Object.keys(d).forEach(function (key, index) {
        var m = key + ': ' + d[key],
          lh = 14;
        self.ctx.fillStyle = self.style.debugColor;
        fillText(
          m,
          w - 20,
          (self.attributes.showPerformance ? 140 : 24) + index * lh,
        );
      });
      self.ctx.restore();
    }
    self.ctx.save();
    initDraw();
    drawBackground();
    initGroupArea();
    drawFrozenRows();
    drawRows();
    drawActiveCell();
    drawHeaders();
    drawFrozenMarkers();
    drawSelectionHandles();
    drawReorderMarkers();
    drawMoveMarkers();
    drawBorder();
    drawSelectionBorders();
    drawScrollBars();
    if (checkScrollHeight) {
      self.resize(true);
    }
    drawGroupArea();
    drawDebug();
    drawPerfLines();
    if (self.dispatchEvent('afterdraw', {})) {
      return;
    }
    self.ctx.restore();
  };
}
