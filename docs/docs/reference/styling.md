---
title: Styling
---

All visual elements of the canvas are dependent on the values of the style object.
Using the style object, you can change the dimensions and appearance of any element of the grid.

There are two types of styles, styles built into the DOM element, such as width and margin, and there
are styles related to the drawing of the grid on the canvas, these are listed in the style section.

Styles can be set during instantiation.

```js
const grid = canvasDatagrid({
    style: {
        gridBackgroundColor: 'red'
    }
});
```

Styles can be set after instantiation.

```js
grid.style.gridBackgroundColor = 'red';
```

When using the web component, styles can be set as above, but also using standard CSS.

When using standard CSS, style names are hyphenated, lower case, and prefixed with `--cdg-`.

```html
<canvas-datagrid style="--cdg-grid-background-color: red;">[{"my": "data"}]</canvas-datagrid>
```

When using the web component you can also use CSS classes and selectors as you would a native HTML element.
    
```html
<style>
    .my-grid {
        --cdg-grid-background-color: red;
    }
</style>

<canvas-datagrid class="my-grid">[{"my": "data"}]</canvas-datagrid>
```

You can build your own styles using the <a href="https://tonygermaneri.github.io/canvas-datagrid/tutorials/styleBuilder.html">Style Builder</a>.

## Style properties

### activeCellBackgroundColor
**string**


Style of activeCellBackgroundColor.
### activeCellBorderColor
**string**


Style of activeCellBorderColor.
### activeCellBorderWidth
**number**


Style of activeCellBorderWidth.
### activeCellColor
**string**


Style of activeCellColor.
### activeCellFont
**string**


Style of activeCellFont.
### activeCellHorizontalAlignment
**string**


Style of activeCellHorizontalAlignment.
### activeCellHoverBackgroundColor
**string**


Style of activeCellHoverBackgroundColor.
### activeCellHoverColor
**string**


Style of activeCellHoverColor.
### activeCellOverlayBorderColor
**string**


Style of activeCellOverlayBorderColor.
### activeCellOverlayBorderWidth
**number**


Style of activeCellOverlayBorderWidth.
### activeCellPaddingBottom
**number**


Style of activeCellPaddingBottom.
### activeCellPaddingLeft
**number**


Style of activeCellPaddingLeft.
### activeCellPaddingRight
**number**


Style of activeCellPaddingRight.
### activeCellPaddingTop
**number**


Style of activeCellPaddingTop.
### activeCellSelectedBackgroundColor
**string**


Style of activeCellSelectedBackgroundColor.
### activeCellSelectedColor
**string**


Style of activeCellSelectedColor.
### activeCellVerticalAlignment
**string**


Style of activeCellVerticalAlignment.
### activeHeaderCellBackgroundColor
**string**


Style of activeHeaderCellBackgroundColor.
### activeHeaderCellColor
**string**


Style of activeHeaderCellColor.
### activeRowHeaderCellBackgroundColor
**string**


Style of activeRowHeaderCellBackgroundColor.
### activeRowHeaderCellColor
**string**


Style of activeRowHeaderCellColor.
### autocompleteBottomMargin
**number**


Style of autocompleteBottomMargin.
### autosizeHeaderCellPadding
**number**


Style of autosizeHeaderCellPadding.
### autosizePadding
**number**


Style of autosizePadding.
### cellAutoResizePadding
**number**


Style of cellAutoResizePadding.
### cellBackgroundColor
**string**


Style of cellBackgroundColor.
### cellBorderColor
**string**


Style of cellBorderColor.
### cellBorderWidth
**number**


Style of cellBorderWidth.
### cellColor
**string**


Style of cellColor.
### cellFont
**string**


Style of cellFont.
### cellGridHeight
**number**


Style of cellGridHeight.
### cellHeight
**number**


Style of cellHeight.
### cellHeightWithChildGrid
**number**


Style of cellHeightWithChildGrid.
### cellHorizontalAlignment
**string**


Style of cellHorizontalAlignment.
### cellHoverBackgroundColor
**string**


Style of cellHoverBackgroundColor.
### cellHoverColor
**string**


Style of cellHoverColor.
### cellLineHeight
**number**


The line height of each wrapping line as a percentage.
### cellLineSpacing
**number**


Style of cellLineSpacing.
### cellPaddingBottom
**number**


Style of cellPaddingBottom.
### cellPaddingLeft
**number**


Style of cellPaddingLeft.
### cellPaddingRight
**number**


Style of cellPaddingRight.
### cellPaddingTop
**number**


Style of cellPaddingTop.
### cellSelectedBackgroundColor
**string**


Style of cellSelectedBackgroundColor.
### cellSelectedColor
**string**


Style of cellSelectedColor.
### cellVerticalAlignment
**string**


Style of cellVerticalAlignment.
### cellWhiteSpace
**string**


Style of cellWhiteSpace. Can be 'nowrap' or 'normal'.
### cellWidth
**number**


Style of cellWidth.
### cellWidthWithChildGrid
**number**


Style of cellWidthWithChildGrid.
### childContextMenuArrowColor
**string**


Style of childContextMenuArrowColor.
### childContextMenuArrowHTML
**string**


Style of childContextMenuArrowHTML.
### childContextMenuMarginLeft
**number**


Style of childContextMenuMarginLeft.
### childContextMenuMarginTop
**number**


Style of childContextMenuMarginTop.
### columnHeaderCellBorderColor
**string**


Style of columnHeaderCellBorderColor.
### columnHeaderCellBorderWidth
**number**


Style of columnHeaderCellBorderWidth.
### columnHeaderCellCapBackgroundColor
**string**


Style of columnHeaderCellBackgroundColor.
### columnHeaderCellCapBorderColor
**string**


Style of columnHeaderCellBackgroundColor.
### columnHeaderCellCapBorderWidth
**number**


Style of columnHeaderCellBackgroundColor.
### columnHeaderCellColor
**string**


Style of columnHeaderCellColor.
### columnHeaderCellFont
**string**


Style of columnHeaderCellFont.
### columnHeaderCellHeight
**number**


Style of columnHeaderCellHeight.
### columnHeaderCellHorizontalAlignment
**string**


Style of columnHeaderCellHorizontalAlignment.
### columnHeaderCellHoverBackgroundColor
**string**


Style of columnHeaderCellHoverBackgroundColor.
### columnHeaderCellHoverColor
**string**


Style of columnHeaderCellHoverColor.
### columnHeaderCellPaddingBottom
**number**


Style of columnHeaderCellPaddingBottom.
### columnHeaderCellPaddingLeft
**number**


Style of columnHeaderCellPaddingLeft.
### columnHeaderCellPaddingRight
**number**


Style of columnHeaderCellPaddingRight.
### columnHeaderCellPaddingTop
**number**


Style of columnHeaderCellPaddingTop.
### columnHeaderCellVerticalAlignment
**string**


Style of columnHeaderCellVerticalAlignment.
### columnHeaderOrderByArrowBorderColor
**string**


Style of columnHeaderOrderByArrowBorderColor.
### columnHeaderOrderByArrowBorderWidth
**number**


Style of columnHeaderOrderByArrowBorderWidth.
### columnHeaderOrderByArrowColor
**string**


Style of columnHeaderOrderByArrowColor.
### columnHeaderOrderByArrowHeight
**number**


Style of columnHeaderOrderByArrowHeight.
### columnHeaderOrderByArrowMarginLeft
**number**


Style of columnHeaderOrderByArrowMarginLeft.
### columnHeaderOrderByArrowMarginRight
**number**


Style of columnHeaderOrderByArrowMarginRight.
### columnHeaderOrderByArrowMarginTop
**number**


Style of columnHeaderOrderByArrowMarginTop.
### columnHeaderOrderByArrowWidth
**number**


Style of columnHeaderOrderByArrowWidth.
### contextFilterButtonBorder
**string**


Style of contextFilterButtonBorder.
### contextFilterButtonBorderRadius
**string**


Style of contextFilterButtonBorderRadius.
### contextFilterButtonHTML
**string**


Style of contextFilterButtonHTML.
### contextMenuArrowColor
**string**


Style of contextMenuArrowColor.
### contextMenuArrowDownHTML
**string**


Style of contextMenuArrowDownHTML.
### contextMenuArrowUpHTML
**string**


Style of contextMenuArrowUpHTML.
### contextMenuBackground
**string**


Style of contextMenuBackground.
### contextMenuBorder
**string**


Style of contextMenuBorder.
### contextMenuBorderRadius
**string**


Style of contextMenuBorderRadius.
### contextMenuChildArrowFontSize
**string**


Style of contextMenuChildArrowFontSize.
### contextMenuColor
**string**


Style of contextMenuColor.
### contextMenuCursor
**string**


Style of contextMenuCursor.
### contextMenuFilterInvalidExpresion
**string**


Style of contextMenuFilterInvalidExpresion.
### contextMenuFontFamily
**string**


Style of contextMenuFontFamily.
### contextMenuFontSize
**string**


Style of contextMenuFontSize.
### contextMenuHoverBackground
**string**


Style of contextMenuHoverBackground.
### contextMenuHoverColor
**string**


Style of contextMenuHoverColor.
### contextMenuItemBorderRadius
**string**


Style of contextMenuItemBorderRadius.
### contextMenuItemMargin
**string**


Style of contextMenuItemMargin.
### contextMenuLabelDisplay
**string**


Style of contextMenuLabelDisplay.
### contextMenuLabelMargin
**string**


Style of contextMenuLabelMargin.
### contextMenuLabelMaxWidth
**string**


Style of contextMenuLabelMaxWidth.
### contextMenuLabelMinWidth
**string**


Style of contextMenuLabelMinWidth.
### contextMenuMarginLeft
**number**


Style of contextMenuMarginLeft.
### contextMenuMarginTop
**number**


Style of contextMenuMarginTop.
### contextMenuOpacity
**string**


Style of contextMenuOpacity.
### contextMenuPadding
**string**


Style of contextMenuPadding.
### contextMenuWindowMargin
**number**


Style of contextMenuWindowMargin.
### contextMenuZIndex
**number**


Style of contextMenuZIndex.
### cornerCellBackgroundColor
**string**


Style of cornerCellBackgroundColor.
### cornerCellBorderColor
**string**


Style of cornerCellBorderColor.
### debugBackgroundColor
**string**


Style of debugBackgroundColor.
### debugColor
**string**


Style of debugColor.
### debugEntitiesColor
**string**


Style of debugEntitiesColor.
### debugFont
**string**


Style of debugFont.
### debugPerfChartBackground
**string**


Style of debugPerfChartBackground.
### debugPerfChartTextColor
**string**


Style of debugPerfChartTextColor.
### debugPerformanceColor
**string**


Style of debugPerformanceColor.
### debugScrollHeightColor
**string**


Style of debugScrollHeightColor.
### debugScrollWidthColor
**string**


Style of debugScrollWidthColor.
### debugTouchPPSXColor
**string**


Style of debugTouchPPSXColor.
### debugTouchPPSYColor
**string**


Style of debugTouchPPSYColor.
### editCellBackgroundColor
**string**


Style of editCellBackgroundColor.
### editCellBorder
**string**


Style of editCellBorder.
### editCellBoxShadow
**string**


Style of editCellBoxShadow.
### editCellColor
**string**


Style of editCellColor.
### editCellFontFamily
**string**


Style of editCellFontFamily.
### editCellFontSize
**string**


Style of editCellFontSize.
### editCellPaddingLeft
**number**


Style of editCellPaddingLeft.
### editCellZIndex
**number**


Style of editCellZIndex.
### frozenMarkerActiveBorderColor
**string**


Style of frozenMarkerActiveBorderColor.
### frozenMarkerActiveColor
**string**


Style of frozenMarkerActiveColor.
### frozenMarkerBorderColor
**string**


Style of frozenMarkerBorderColor.
### frozenMarkerBorderWidth
**number**


Style of frozenMarkerBorderWidth.
### frozenMarkerColor
**string**


Style of frozenMarkerColor.
### frozenMarkerWidth
**number**


Style of frozenMarkerWidth.
### gridBackgroundColor
**string**


Style of gridBackgroundColor.
### gridBorderCollapse
**string**


Style of gridBorderCollapse.  When grid border collapse is set to the default value of `collapse`, the bottom border and the top border of the next cell down will be merged into a single border.  The only other setting is `expand` which allows the full border to be drawn.
### gridBorderColor
**string**


Style of gridBorderColor.
### gridBorderWidth
**number**


Style of gridBorderWidth.
### minColumnWidth
**number**


Style of minColumnWidth.
### minHeight
**number**


Style of minHeight.
### minRowHeight
**number**


Style of minRowHeight.
### moveOverlayBorderColor
**string**


Style of moveOverlayBorderColor.
### moveOverlayBorderSegments
**string**


Style of moveOverlayBorderSegments.
### moveOverlayBorderWidth
**number**


Style of moveOverlayBorderWidth.
### name
**string**


Style of name.
### overflowX
**string**


When set to hidden, horizontal scroll bar will be hidden.  When set to auto horizontal scroll bar will appear when data overflows the width.  When set to scroll the horizontal scrollbar will always be visible.

 ['', 'normal'],
### overflowY
**string**


When set to hidden, vertical scroll bar will be hidden.  When set to auto vertical scroll bar will appear when data overflows the height.  When set to scroll the vertical scrollbar will always be visible.
### reorderMarkerBackgroundColor
**string**


Style of reorderMarkerBackgroundColor.
### reorderMarkerBorderColor
**string**


Style of reorderMarkerBorderColor.
### reorderMarkerBorderWidth
**number**


Style of reorderMarkerBorderWidth.
### reorderMarkerIndexBorderColor
**string**


Style of reorderMarkerIndexBorderColor.
### reorderMarkerIndexBorderWidth
**number**


Style of reorderMarkerIndexBorderWidth.
### rowHeaderCellBackgroundColor
**string**


Style of rowHeaderCellBackgroundColor.
### rowHeaderCellBorderColor
**string**


Style of rowHeaderCellBorderColor.
### rowHeaderCellBorderWidth
**number**


Style of rowHeaderCellBorderWidth.
### rowHeaderCellColor
**string**


Style of rowHeaderCellColor.
### rowHeaderCellFont
**string**


Style of rowHeaderCellFont.
### rowHeaderCellHeight
**number**


Style of rowHeaderCellHeight.
### rowHeaderCellHorizontalAlignment
**string**


Style of rowHeaderCellHorizontalAlignment.
### rowHeaderCellHoverBackgroundColor
**string**


Style of rowHeaderCellHoverBackgroundColor.
### rowHeaderCellHoverColor
**string**


Style of rowHeaderCellHoverColor.
### rowHeaderCellPaddingBottom
**number**


Style of rowHeaderCellPaddingBottom.
### rowHeaderCellPaddingLeft
**number**


Style of rowHeaderCellPaddingLeft.
### rowHeaderCellPaddingRight
**number**


Style of rowHeaderCellPaddingRight.
### rowHeaderCellPaddingTop
**number**


Style of rowHeaderCellPaddingTop.
### rowHeaderCellRowNumberGapColor
**number**


Style of rowHeaderCellRowNumberGapColor.
### rowHeaderCellRowNumberGapHeight
**number**


Style of rowHeaderCellRowNumberGapHeight.
### rowHeaderCellSelectedBackgroundColor
**string**


Style of rowHeaderCellSelectedBackgroundColor.
### rowHeaderCellSelectedColor
**string**


Style of rowHeaderCellSelectedColor.
### rowHeaderCellVerticalAlignment
**string**


Style of rowHeaderCellVerticalAlignment.
### rowHeaderCellWidth
**number**


Style of rowHeaderCellWidth.
### scrollBarActiveColor
**string**


Style of scrollBarActiveColor.
### scrollBarBackgroundColor
**string**


Style of scrollBarBackgroundColor.
### scrollBarBorderColor
**string**


Style of scrollBarBorderColor.
### scrollBarBorderWidth
**number**


Style of scrollBarBorderWidth.
### scrollBarBoxBorderRadius
**number**


Style of scrollBarBoxBorderRadius.
### scrollBarBoxColor
**string**


Style of scrollBarBoxColor.
### scrollBarBoxMargin
**number**


Style of scrollBarBoxMargin.
### scrollBarBoxMinSize
**number**


Style of scrollBarBoxMinSize.
### scrollBarBoxWidth
**number**


Style of scrollBarBoxWidth.
### scrollBarCornerBackgroundColor
**string**


Style of scrollBarCornerBackgroundColor.
### scrollBarCornerBorderColor
**string**


Style of scrollBarCornerBorderColor.
### scrollBarWidth
**number**


Style of scrollBarWidth.
### selectionHandleBorderColor
**string**


Style of selectionHandleBorderColor.
### selectionHandleBorderWidth
**number**


Style of selectionHandleBorderWidth.
### selectionHandleColor
**string**


Style of selectionHandleColor.
### selectionHandleSize
**number**


Style of selectionHandleSize.
### selectionHandleType
**string**


Style of selectionHandleType.  Can be square or circle.
### selectionOverlayBorderColor
**string**


Style of selectionOverlayBorderColor.
### selectionOverlayBorderWidth
**number**


Style of selectionOverlayBorderWidth.
### treeArrowBorderColor
**string**


Style of treeArrowBorderColor.
### treeArrowBorderWidth
**number**


Style of treeArrowBorderWidth.
### treeArrowClickRadius
**number**


Style of treeArrowClickRadius.
### treeArrowColor
**string**


Style of treeArrowColor.
### treeArrowHeight
**number**


Style of treeArrowHeight.
### treeArrowMarginLeft
**number**


Style of treeArrowMarginLeft.
### treeArrowMarginRight
**number**


Style of treeArrowMarginRight.
### treeArrowMarginTop
**number**


Style of treeArrowMarginTop.
### treeArrowWidth
**number**


Style of treeArrowWidth.
### treeGridHeight
**number**


Style of treeGridHeight.
