(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["canvasDatagrid"] = factory();
	else
		root["canvasDatagrid"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/button.js":
/*!***********************!*\
  !*** ./lib/button.js ***!
  \***********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/*jslint browser: true, unparam: true, todo: true*/

/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false, Event: false*/


function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(self) {
  var zIndexTop;

  function applyButtonMenuItemStyle(buttonMenuItemContainer) {
    self.createInlineStyle(buttonMenuItemContainer, 'canvas-datagrid-button-menu-item' + (self.mobile ? '-mobile' : ''));
    buttonMenuItemContainer.addEventListener('mouseover', function () {
      self.createInlineStyle(buttonMenuItemContainer, 'canvas-datagrid-button-menu-item:hover');
    });
    buttonMenuItemContainer.addEventListener('mouseout', function () {
      self.createInlineStyle(buttonMenuItemContainer, 'canvas-datagrid-button-menu-item');
    });
  }

  function applyButtonStyle(button) {
    self.createInlineStyle(button, 'canvas-datagrid-button-wrapper');
    button.addEventListener('mouseover', function () {
      if (!self.buttonMenu) {
        self.createInlineStyle(button, 'canvas-datagrid-button-wrapper:hover');
      }
    });
    button.addEventListener('mouseout', function () {
      if (!self.buttonMenu) {
        self.createInlineStyle(button, 'canvas-datagrid-button-wrapper');
      }
    });
  }

  function createButton(pos, items, imgSrc) {
    var wrapper = document.createElement('div'),
        buttonArrow = document.createElement('div'),
        buttonIcon = document.createElement('div'),
        intf = {};

    if (!Array.isArray(items)) {
      throw new Error('createButton expects an array.');
    }

    function init() {
      var loc = {},
          s = self.scrollOffset(self.canvas);

      if (zIndexTop === undefined) {
        zIndexTop = self.style.buttonZIndex;
      }

      applyButtonStyle(wrapper);
      self.createInlineStyle(buttonIcon, 'canvas-datagrid-button-icon');
      self.createInlineStyle(buttonArrow, 'canvas-datagrid-button-arrow');
      loc.x = pos.left - s.left;
      loc.y = pos.top - s.top;
      loc.height = 0;
      zIndexTop += 1;
      wrapper.style.position = 'absolute';
      wrapper.style.zIndex = zIndexTop;
      wrapper.style.left = loc.x + 'px';
      wrapper.style.top = loc.y + 'px';
      wrapper.left = pos.left + self.scrollBox.scrollLeft;
      wrapper.top = pos.top + self.scrollBox.scrollTop;
      buttonArrow.innerHTML = self.style.buttonArrowDownHTML;

      if (imgSrc) {
        var img = document.createElement('img');
        img.setAttribute('src', imgSrc);
        img.style.maxWidth = '100%';
        img.style.height = '100%';
        buttonIcon.appendChild(img);
      }

      wrapper.appendChild(buttonIcon);
      wrapper.appendChild(buttonArrow);
      document.body.appendChild(wrapper);
      wrapper.addEventListener('click', toggleButtonMenu);
    }

    intf.wrapper = wrapper;
    intf.items = items;
    init();

    intf.dispose = function () {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    };

    return intf;
  }

  function toggleButtonMenu() {
    function createDisposeEvent() {
      requestAnimationFrame(function () {
        document.addEventListener('click', self.disposeButtonMenu);
      });
    }

    if (self.buttonMenu) {
      self.disposeButtonMenu();
    } else {
      var pos = {
        left: self.button.wrapper.left - self.scrollBox.scrollLeft,
        top: self.button.wrapper.top + self.button.wrapper.offsetHeight - self.scrollBox.scrollTop
      };
      self.buttonMenu = createButtonMenu(pos, self.button.items);
      self.createInlineStyle(self.button.wrapper, 'canvas-datagrid-button-wrapper:active');
      createDisposeEvent();
    }
  }

  function createButtonMenu(pos, items) {
    var buttonMenu = document.createElement('div'),
        selectedIndex = -1,
        intf = {},
        rect;

    function createItems() {
      function addItem(item, menuItemContainer) {
        function addContent(content) {
          if (content === null) {
            return;
          }

          if (_typeof(content) === 'object') {
            menuItemContainer.appendChild(content);
            return;
          }

          applyButtonMenuItemStyle(menuItemContainer);
          menuItemContainer.innerHTML = content;
          return;
        }

        addContent(item.title);
        item.buttonMenuItemContainer = menuItemContainer;

        if (item.click) {
          menuItemContainer.addEventListener('click', function (ev) {
            item.click.apply(self, [ev]);
            self.disposeButton();
          });
        }
      }

      var _iterator = _createForOfIteratorHelper(items),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          var buttonMenuItemContainer = document.createElement('div');
          addItem(item, buttonMenuItemContainer);
          buttonMenu.appendChild(buttonMenuItemContainer);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    function clickIndex(idx) {
      items[idx].buttonMenuItemContainer.dispatchEvent(new Event('click'));
    }

    function init() {
      var loc = {},
          s = self.scrollOffset(self.canvas);

      if (zIndexTop === undefined) {
        zIndexTop = self.style.buttonZIndex;
      }

      createItems();
      self.createInlineStyle(buttonMenu, 'canvas-datagrid-button-menu' + (self.mobile ? '-mobile' : ''));
      loc.x = pos.left - s.left;
      loc.y = pos.top - s.top;
      loc.height = 0;
      zIndexTop += 1;
      buttonMenu.style.position = 'absolute';
      buttonMenu.style.zIndex = zIndexTop;
      buttonMenu.style.left = loc.x + 'px';
      buttonMenu.style.top = loc.y + 'px';
      document.body.appendChild(buttonMenu);
      rect = buttonMenu.getBoundingClientRect();

      if (rect.bottom > window.innerHeight) {
        loc.y = self.button.wrapper.top - buttonMenu.offsetHeight - self.scrollBox.scrollTop;

        if (loc.y < 0) {
          loc.y = self.style.buttonMenuWindowMargin;
        }

        if (buttonMenu.offsetHeight > window.innerHeight - self.style.buttonMenuWindowMargin) {
          buttonMenu.style.height = window.innerHeight - self.style.buttonMenuWindowMargin * 2 + 'px';
        }
      }

      if (rect.right > window.innerWidth) {
        loc.x -= rect.right - window.innerWidth + self.style.buttonMenuWindowMargin;
      }

      if (loc.x < 0) {
        loc.x = self.style.buttonMenuWindowMargin;
      }

      if (loc.y < 0) {
        loc.y = self.style.buttonMenuWindowMargin;
      }

      buttonMenu.style.left = loc.x + 'px';
      buttonMenu.style.top = loc.y + 'px';
    }

    intf.buttonMenu = buttonMenu;
    init();
    intf.clickIndex = clickIndex;
    intf.rect = rect;
    intf.items = items;

    intf.dispose = function () {
      if (buttonMenu.parentNode) {
        buttonMenu.parentNode.removeChild(buttonMenu);
      }
    };

    Object.defineProperty(intf, 'selectedIndex', {
      get: function get() {
        return selectedIndex;
      },
      set: function set(value) {
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
          throw new Error('Button menu selected index must be a sane number.');
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
            return self.createInlineStyle(item.buttonMenuItemContainer, 'canvas-datagrid-button-menu-item:hover');
          }

          self.createInlineStyle(item.buttonMenuItemContainer, 'canvas-datagrid-button-menu-item');
        });
      }
    });
    return intf;
  }

  self.disposeButtonMenu = function () {
    if (self.buttonMenu) {
      document.removeEventListener('click', self.disposeButtonMenu);
      self.buttonMenu.dispose();
      self.buttonMenu = undefined;
      self.createInlineStyle(self.button.wrapper, 'canvas-datagrid-button-wrapper:hover');
    }
  };

  self.disposeButton = function (e) {
    if (e && e.keyCode !== 27) return;
    document.removeEventListener('keydown', self.disposeButton);
    zIndexTop = self.style.buttonZIndex;
    self.disposeButtonMenu();

    if (self.button) {
      self.button.dispose();
    }

    self.button = undefined;
  };

  self.moveButtonPos = function () {
    self.button.wrapper.style.left = self.button.wrapper.left - self.scrollBox.scrollLeft + 'px';
    self.button.wrapper.style.top = self.button.wrapper.top - self.scrollBox.scrollTop + 'px';
    self.disposeButtonMenu();
  };

  self.attachButton = function (pos, items, imgSrc) {
    function createDisposeEvent() {
      requestAnimationFrame(function () {
        document.addEventListener('keydown', self.disposeButton);
      });
    }

    if (self.button) {
      self.disposeButton();
    }

    self.button = createButton(pos, items, imgSrc);
    createDisposeEvent();
  };

  return;
}

/***/ }),

/***/ "./lib/component.js":
/*!**************************!*\
  !*** ./lib/component.js ***!
  \**************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _defaults__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaults */ "./lib/defaults.js");
/*jslint browser: true, unparam: true, todo: true*/

/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var typeMap,
      component = {};

  component.dehyphenateProperty = function hyphenateProperty(prop) {
    prop = prop.replace('--cdg-', '');
    var p = '',
        nextLetterCap;
    Array.prototype.forEach.call(prop, function (_char) {
      if (nextLetterCap) {
        nextLetterCap = false;
        p += _char.toUpperCase();
        return;
      }

      if (_char === '-') {
        nextLetterCap = true;
        return;
      }

      p += _char;
    });
    return p;
  };

  component.hyphenateProperty = function hyphenateProperty(prop, cust) {
    var p = '';
    Array.prototype.forEach.call(prop, function (_char2) {
      if (_char2 === _char2.toUpperCase()) {
        p += '-' + _char2.toLowerCase();
        return;
      }

      p += _char2;
    });
    return (cust ? '--cdg-' : '') + p;
  };

  function getDefaultItem(base, item) {
    var i = {},
        r;
    (0,_defaults__WEBPACK_IMPORTED_MODULE_0__.default)(i);
    r = i.defaults[base].filter(function (i) {
      return i[0].toLowerCase() === item.toLowerCase() || component.hyphenateProperty(i[0]) === item.toLowerCase() || component.hyphenateProperty(i[0], true) === item.toLowerCase();
    })[0];
    return r;
  }

  component.applyComponentStyle = function (supressChangeAndDrawEvents, intf) {
    if (!intf.isComponent) {
      return;
    }

    var cStyle = window.getComputedStyle(intf.tagName === 'CANVAS-DATAGRID' ? intf : intf.canvas, null),
        defs = {};
    intf.computedStyle = cStyle;
    (0,_defaults__WEBPACK_IMPORTED_MODULE_0__.default)(defs);
    defs = defs.defaults.styles;
    defs.forEach(function (def) {
      var val;
      val = cStyle.getPropertyValue(component.hyphenateProperty(def[0], true));

      if (val === '') {
        val = cStyle.getPropertyValue(component.hyphenateProperty(def[0], false));
      }

      if (val !== '' && typeof val === 'string') {
        intf.setStyleProperty(def[0], typeMap[_typeof(def[1])](val.replace(/^\s+/, '').replace(/\s+$/, ''), def[1]), true);
      }
    });

    if (!supressChangeAndDrawEvents && intf.dispatchEvent) {
      requestAnimationFrame(function () {
        intf.resize(true);
      });
      intf.dispatchEvent('stylechanged', intf.style);
    }
  };

  typeMap = {
    data: function data(strData) {
      try {
        return JSON.parse(strData);
      } catch (e) {
        throw new Error('Cannot read JSON data in canvas-datagrid data.');
      }
    },
    schema: function schema(strSchema) {
      try {
        return JSON.parse(strSchema);
      } catch (e) {
        throw new Error('Cannot read JSON data in canvas-datagrid schema attribute.');
      }
    },
    number: function number(strNum, def) {
      var n = parseInt(strNum, 10);
      return isNaN(n) ? def : n;
    },
    "boolean": function boolean(strBool) {
      return /true/i.test(strBool);
    },
    string: function string(str) {
      return str;
    }
  };

  component.getObservableAttributes = function () {
    var i = {},
        attrs = ['data', 'schema', 'style', 'className', 'name'];
    (0,_defaults__WEBPACK_IMPORTED_MODULE_0__.default)(i);
    i.defaults.attributes.forEach(function (attr) {
      attrs.push(attr[0].toLowerCase());
    });
    return attrs;
  };

  component.disconnectedCallback = function () {
    this.connected = false;
  };

  component.connectedCallback = function () {
    var intf = this;
    intf.parentDOMNode.innerHTML = '';
    intf.parentDOMNode.appendChild(intf.canvas);
    intf.connected = true;
    component.observe(intf);
    component.applyComponentStyle(true, intf);
    intf.resize(true);
  };

  component.adoptedCallback = function () {
    this.resize();
  };

  component.attributeChangedCallback = function (attrName, oldVal, newVal) {
    var tfn,
        intf = this,
        def;

    if (attrName === 'style') {
      component.applyComponentStyle(false, intf);
      return;
    }

    if (attrName === 'data') {
      if (intf.dataType === 'application/x-canvas-datagrid') {
        intf.dataType = 'application/json+x-canvas-datagrid';
      }

      intf.data = newVal;
      return;
    }

    if (attrName === 'schema') {
      intf.schema = typeMap.schema(newVal);
      return;
    }

    if (attrName === 'name') {
      intf.name = newVal;
      return;
    }

    if (attrName === 'class' || attrName === 'className') {
      return;
    }

    def = getDefaultItem('attributes', attrName);

    if (def) {
      tfn = typeMap[_typeof(def[1])];
      intf.attributes[def[0]] = tfn(newVal);
      return;
    }

    if (/^on/.test(attrName)) {
      intf.addEventListener('on' + attrName, Function('e', newVal));
    }

    return;
  };

  component.observe = function (intf) {
    var observer;

    if (!window.MutationObserver) {
      return;
    }

    intf.applyComponentStyle = function () {
      component.applyComponentStyle(false, intf);
      intf.resize();
    };
    /**
     * Applies the computed css styles to the grid.  In some browsers, changing directives in attached style sheets does not automatically update the styles in this component.  It is necessary to call this method to update in these cases.
     * @memberof canvasDatagrid
     * @name applyComponentStyle
     * @method
     */


    observer = new window.MutationObserver(function (mutations) {
      var checkInnerHTML, checkStyle;
      Array.prototype.forEach.call(mutations, function (mutation) {
        if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
          checkStyle = true;
          return;
        }

        if (mutation.target.nodeName === 'STYLE') {
          checkStyle = true;
          return;
        }

        if (mutation.target.parentNode && mutation.target.parentNode.nodeName === 'STYLE') {
          checkStyle = true;
          return;
        }

        if (mutation.target === intf && (mutation.addedNodes.length > 0 || mutation.type === 'characterData')) {
          checkInnerHTML = true;
        }
      });

      if (checkStyle) {
        intf.applyComponentStyle(false, intf);
      }

      if (checkInnerHTML) {
        if (intf.dataType === 'application/x-canvas-datagrid') {
          intf.dataType = 'application/json+x-canvas-datagrid';
        }

        intf.data = intf.innerHTML;
      }
    });
    observer.observe(intf, {
      characterData: true,
      childList: true,
      attributes: true,
      subtree: true
    });
    Array.prototype.forEach.call(document.querySelectorAll('style'), function (el) {
      observer.observe(el, {
        characterData: true,
        childList: true,
        attributes: true,
        subtree: true
      });
    });
  };

  return component;
}

/***/ }),

/***/ "./lib/contextMenu.js":
/*!****************************!*\
  !*** ./lib/contextMenu.js ***!
  \****************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/*jslint browser: true, unparam: true, todo: true*/

/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false, Event: false*/


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(self) {
  var zIndexTop, hoverScrollTimeout, autoCompleteContext;

  function applyContextItemStyle(contextItemContainer) {
    self.createInlineStyle(contextItemContainer, 'canvas-datagrid-context-menu-item' + (self.mobile ? '-mobile' : ''));
    contextItemContainer.addEventListener('mouseover', function () {
      self.createInlineStyle(contextItemContainer, 'canvas-datagrid-context-menu-item:hover');
    });
    contextItemContainer.addEventListener('mouseout', function () {
      self.createInlineStyle(contextItemContainer, 'canvas-datagrid-context-menu-item');
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
          if (e.relatedTarget === container || item.contextMenu.container === e.relatedTarget || childMenuArrow === e.relatedTarget || contextItemContainer === e.relatedTarget || item.contextMenu.container.contains(e.relatedTarget)) {
            return;
          }

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
          if (contextItemContainer.getAttribute('opening') !== '1' || contextItemContainer.getAttribute('contextOpen') === '1') {
            return;
          }

          var cPos = contextItemContainer.getBoundingClientRect();
          cPos = {
            left: cPos.left + self.style.childContextMenuMarginLeft + container.offsetWidth,
            top: cPos.top + self.style.childContextMenuMarginTop,
            bottom: cPos.bottom,
            right: cPos.right
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
            i = item.items.apply(intf, [function (items) {
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
            if (content === null) {
              return;
            }

            if (typeof content === 'function') {
              return addContent(content(ev));
            }

            if (_typeof(content) === 'object') {
              contextItemContainer.appendChild(content);
              return;
            }

            applyContextItemStyle(contextItemContainer);
            contextItemContainer.innerHTML = content;
            return;
          }

          addContent(item.title);
          item.contextItemContainer = contextItemContainer;

          if (item.items && item.items.length > 0 || typeof item.items === 'function') {
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
        self.parentDOMNode.appendChild(upArrow);
      } else if (upArrow.parentNode) {
        upArrow.parentNode.removeChild(upArrow);
      }

      if (container.scrollTop >= container.scrollHeight - container.offsetHeight && downArrow.parentNode) {
        downArrow.parentNode.removeChild(downArrow);
      } else if (container.scrollHeight - container.offsetHeight > 0 && !(container.scrollTop >= container.scrollHeight - container.offsetHeight)) {
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

      if (zIndexTop === undefined) {
        zIndexTop = self.style.contextMenuZIndex;
      }

      createItems();
      self.createInlineStyle(container, 'canvas-datagrid-context-menu' + (self.mobile ? '-mobile' : ''));
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
        container.style.maxHeight = window.innerHeight - loc.y - self.style.autocompleteBottomMargin + 'px';
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
      rect = container.getBoundingClientRect(); // TODO: fix !(parentContextMenu && parentContextMenu.inputDropdown) state (autocomplete)

      if (rect.bottom > window.innerHeight) {
        if (!(parentContextMenu && parentContextMenu.inputDropdown)) {
          loc.y -= rect.bottom + self.style.contextMenuWindowMargin - window.innerHeight;
        }

        if (loc.y < 0) {
          loc.y = self.style.contextMenuWindowMargin;
        }

        if (container.offsetHeight > window.innerHeight - self.style.contextMenuWindowMargin) {
          container.style.height = window.innerHeight - self.style.contextMenuWindowMargin * 2 + 'px';
        }
      }

      if (rect.right > window.innerWidth) {
        loc.x -= rect.right - window.innerWidth + self.style.contextMenuWindowMargin;
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
        fade(el);
      });
    };

    Object.defineProperty(intf, 'selectedIndex', {
      get: function get() {
        return selectedIndex;
      },
      set: function set(value) {
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
        iRect;

    function checkRegExpErrorState() {
      filterInput.style.background = self.style.contextFilterInputBackground;
      filterInput.style.color = self.style.contextFilterInputColor;

      if (self.invalidFilterRegEx) {
        filterInput.style.background = self.style.contextFilterInvalidRegExpBackground;
        filterInput.style.color = self.style.contextFilterInvalidRegExpColor;
      }
    }

    function fillAutoComplete() {
      var count = 0;
      var items = {};
      var blanksItem = [];
      self.viewData.forEach(function (row) {
        var cellValue = row[e.cell.header.name] == null ? row[e.cell.header.name] : String(row[e.cell.header.name]).trim();
        var value = self.blankValues.includes(cellValue) ? self.attributes.blanksText : cellValue;

        if (items[value] || count > self.attributes.maxAutoCompleteItems) {
          return;
        }

        count += 1;
        items[value] = {
          title: self.formatters[e.cell.header.type || 'string']({
            cell: {
              value: value
            }
          }),
          click: function click(e) {
            filterInput.value = value;
            e.stopPropagation();
            filterInput.dispatchEvent(new Event('keyup'));
            self.disposeAutocomplete();
            return;
          }
        };
      });

      if (Object.keys(items).indexOf(self.attributes.blanksText) !== -1) {
        blanksItem.push(items[self.attributes.blanksText]);
        delete items[self.attributes.blanksText];
      }

      return blanksItem.concat(Object.keys(items).map(function (key) {
        return items[key];
      }));
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

      autoCompleteContext = createContextMenu(e, {
        left: iRect.left,
        top: iRect.top,
        right: iRect.right,
        bottom: iRect.bottom,
        height: iRect.height,
        width: iRect.width
      }, autoCompleteItems, {
        inputDropdown: true
      });
      autoCompleteContext.selectedIndex = 0;
    }

    self.createInlineStyle(filterLabel, 'canvas-datagrid-context-menu-label');
    self.createInlineStyle(filterAutoCompleteButton, 'canvas-datagrid-context-menu-filter-button');
    self.createInlineStyle(filterInput, 'canvas-datagrid-context-menu-filter-input');
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
  /**
   * Return a tuple if the user selected contiguous columns, otherwise `null`.
   * Info: Because the user may reorder the columns,
   * the schemaIndex of the first item may be greater than the schemaIndex of the second item,
   * but the columnIndex of the firs item must less than the columnIndex of the second item.
   * @param {any[]} schema from `self.getSchema()`
   * @returns {any[]} column schemas tuple (each schema has an additional field `schemaIndex`)
   */


  function getSelectedContiguousColumns(ev, schema) {
    var memoKey = '__contiguousColumns';
    if (Array.isArray(ev[memoKey]) || ev[memoKey] === null) return ev[memoKey];
    ev[memoKey] = null;
    if (!Array.isArray(self.selections) || self.selections.length === 0) return;
    var selection = self.selections[0];
    if (!selection || selection.length === 0) return;

    for (var rowIndex = 0; rowIndex < self.viewData.length; rowIndex++) {
      var row = self.viewData[rowIndex];
      if (!row) continue;
      var compare = self.selections[rowIndex];
      if (!compare) return;
      if (compare.length !== selection.length) return;

      for (var i = 0; i < selection.length; i++) {
        if (selection[i] !== compare[i]) return;
      }
    }

    selection.sort(function (a, b) {
      return a - b;
    });
    /** @type {number[][]} */

    var ranges = [];
    var begin = selection[0];
    var end = selection[0];

    for (var _i = 1; _i < selection.length; _i++) {
      var orderIndex = selection[_i];

      if (orderIndex === end + 1) {
        end = orderIndex;
        continue;
      }

      ranges.push([begin, end]);
      begin = orderIndex;
      end = orderIndex;
    }

    ranges.push([begin, end]);
    var currentOrderIndex = ev.cell.columnIndex;
    var matchedRange = ranges.find(function (range) {
      return currentOrderIndex >= range[0] && currentOrderIndex <= range[1] && range[0] !== range[1];
    });
    if (!matchedRange) return;
    /** @type {number[]} orders[index] => columnIndex */

    var orders = self.orders.columns;
    if (!Array.isArray(orders)) return;
    var matchedSchema = matchedRange.map(function (orderIndex) {
      var schemaIndex = orders[orderIndex];
      var thisSchema = schema[schemaIndex];
      return Object.assign({}, thisSchema, {
        orderIndex: orderIndex
      });
    });
    if (matchedSchema.findIndex(function (it) {
      return !it;
    }) >= 0) return;
    return ev[memoKey] = matchedSchema;
  }
  /**
   * @param {boolean} [allowOnlyOneRow]
   * @returns {number[]} a rowIndex tuple. It can contains one row index or two row indexes.
   */


  function getSelectedContiguousRows(allowOnlyOneRow) {
    var range = [];
    var prev = -2;
    var ok = true;
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
    var schema = self.getSchema();
    /**
     * A map between columnIndex and column data
     * @type {Map<string,any>}
     */

    var columns;

    var getColumnsMap = function getColumnsMap() {
      if (!columns) columns = new Map(schema.map(function (_col) {
        return [_col.columnIndex, _col];
      }));
      return columns;
    };

    var isSorting = self.orderings.columns && self.orderings.columns.length > 0;
    var isNormalCell = !(e.cell.isBackground || e.cell.isColumnHeaderCellCap || e.cell.isScrollBar || e.cell.isCorner || e.cell.isRowHeader) && e.cell.header;

    if (self.attributes.showFilter && isNormalCell) {
      createFilterContextMenuItems(e);
    }

    if (self.attributes.showCopy && self.selections.reduce(function (p, r) {
      return p + r.length;
    }, 0) > 0) {
      e.items.push({
        title: self.attributes.copyText,
        click: function click() {
          document.execCommand('copy');
          self.disposeContextMenu();
          self.controlInput.focus();
        }
      });
    }

    if (self.attributes.showPaste && self.clipBoardData) {
      e.items.push({
        title: self.attributes.pasteText,
        click: function click() {
          self.paste(self.clipBoardData, e.cell.columnIndex, e.cell.rowIndex);
          self.draw();
        }
      });
    }

    if (self.attributes.showColumnSelector) {
      e.items.push({
        title: self.attributes.columnSelectorText,
        items: function items() {
          var d = [];
          self.getSchema().forEach(function (column) {
            function toggleColumnVisibility(e) {
              column.hidden = !column.hidden;
              self.dispatchEvent('togglecolumn', {
                column: column,
                hidden: column.hidden
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
            el.innerHTML = (column.hidden ? self.attributes.columnSelectorHiddenText : self.attributes.columnSelectorVisibleText) + (column.title || column.name);
            d.push({
              title: el
            });
          });
          return d;
        }
      });

      if (e.cell && e.cell.header && e.cell.columnIndex > -1) {
        // This variable represents the order index because of the following codes from `draw.js`:
        //     columnIndex: columnOrderIndex,
        var columnOrderIndex = e.cell.columnIndex;
        var columnIndex = self.orders.columns[columnOrderIndex];
        var contiguousColumns = getSelectedContiguousColumns(e, schema);
        var title = '';

        if (contiguousColumns) {
          title = contiguousColumns.map(function (col) {
            return col.title || col.name;
          }).join('-');
        } else {
          var column = schema[columnIndex];
          if (column) title = column.title || column.name;
        }

        e.items.push({
          title: self.attributes.hideColumnText.replace(/%s/gi, title),
          click: function click(ev) {
            ev.preventDefault();
            self.stopPropagation(ev);
            self.disposeContextMenu();

            if (contiguousColumns) {
              self.hideColumns(contiguousColumns[0].orderIndex, contiguousColumns[1].orderIndex);
            } else {
              self.hideColumns(columnOrderIndex);
            }
          }
        });
      }
    }

    if (self.attributes.saveAppearance && self.attributes.showClearSettingsOption && (Object.keys(self.sizes.rows).length > 0 || Object.keys(self.sizes.columns).length > 0)) {
      e.items.push({
        title: self.attributes.clearSettingsOptionText,
        click: function click(e) {
          e.preventDefault();
          self.sizes.rows = {};
          self.sizes.columns = {};
          self.createRowOrders();
          self.createColumnOrders();
          self.storedSettings = undefined;
          self.dispatchEvent('resizecolumn', {
            columnWidth: self.style.cellWidth
          });
          self.dispatchEvent('resizerow', {
            cellHeight: self.style.cellHeight
          });
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
        click: function click(ev) {
          ev.preventDefault();
          self.order(e.cell.header.name, 'asc');
          self.controlInput.focus();
        }
      });
      e.items.push({
        title: self.attributes.showOrderByOptionTextDesc.replace('%s', e.cell.header.title || e.cell.header.name),
        click: function click(ev) {
          ev.preventDefault();
          self.order(e.cell.header.name, 'desc');
          self.disposeContextMenu();
          self.controlInput.focus();
        }
      });
    } //#region hide rows


    var canHideRows = !isSorting && e.cell.isRowHeader && e.cell.header;

    if (canHideRows) {
      var range = getSelectedContiguousRows(true);

      if (range) {
        var boundRowIndexes = range.map(function (viewRowIndex) {
          return self.getBoundRowIndexFromViewRowIndex(viewRowIndex);
        });

        var _title;

        if (boundRowIndexes.length === 1) {
          if (typeof boundRowIndexes[0] === 'number') _title = boundRowIndexes[0] + 1;else _title = range[0] + 1;
          _title = self.attributes.showHideRow.replace('%s', _title); // hide one row

          e.items.push({
            title: _title,
            click: function click(ev) {
              ev.preventDefault();
              self.hideRows(boundRowIndexes[0], boundRowIndexes[0]);
            }
          });
        } else if (boundRowIndexes[0] <= boundRowIndexes[1]) {
          _title = boundRowIndexes.map(function (it, index) {
            if (typeof it === 'number') return it + 1;
            return range[index] + 1;
          }).join('-');
          _title = self.attributes.showHideRows.replace('%s', _title); // hide rows

          e.items.push({
            title: _title,
            click: function click(ev) {
              ev.preventDefault();
              self.hideRows(boundRowIndexes[0], boundRowIndexes[1]);
            }
          });
        }
      }
    } //#endregion hide rows
    //#region group/ungroup columns


    var groupAreaHeight = self.getColumnGroupAreaHeight();
    var groupAreaWidth = self.getRowGroupAreaWidth();

    var setCollapseStateForAllGroups = function setCollapseStateForAllGroups(allGroups, collapsed) {
      if (allGroups.length === 0) return;

      for (var i = 0; i < allGroups.length; i++) {
        var groups = allGroups[i];

        for (var j = 0; j < groups.length; j++) {
          var group = groups[j];
          group.collapsed = collapsed;
        }
      }

      self.refresh();
    };

    if (e.pos && e.pos.y < groupAreaHeight) {
      e.items.push({
        title: self.attributes.showRemoveAllGroupColumns,
        click: function click(ev) {
          ev.preventDefault();
          self.groupedColumns = [];
          self.refresh();
        }
      });
      e.items.push({
        title: self.attributes.showExpandAllGroupColumns,
        click: function click(ev) {
          ev.preventDefault();
          setCollapseStateForAllGroups(self.groupedColumns, false);
        }
      });
      e.items.push({
        title: self.attributes.showCollapseAllGroupColumns,
        click: function click(ev) {
          ev.preventDefault();
          setCollapseStateForAllGroups(self.groupedColumns, true);
        }
      });
    }

    if (e.pos && e.pos.x < groupAreaWidth) {
      e.items.push({
        title: self.attributes.showRemoveAllGroupRows,
        click: function click(ev) {
          ev.preventDefault();
          self.groupedRows = [];
          self.refresh();
        }
      });
      e.items.push({
        title: self.attributes.showExpandAllGroupRows,
        click: function click(ev) {
          ev.preventDefault();
          setCollapseStateForAllGroups(self.groupedRows, false);
        }
      });
      e.items.push({
        title: self.attributes.showCollapseAllGroupRows,
        click: function click(ev) {
          ev.preventDefault();
          setCollapseStateForAllGroups(self.groupedRows, true);
        }
      });
    }

    var canGroupByColumns = self.attributes.allowGroupingColumns && e.cell.isColumnHeader && e.cell.header && e.cell.header.index > 0;
    var canUngroupColumns = self.attributes.allowGroupingColumns && e.cell.isColumnHeader;
    var canGroupByRows = !isSorting && self.attributes.allowGroupingRows && e.cell.isRowHeader && e.cell.header;
    var canUngroupRows = self.attributes.allowGroupingRows && e.cell.isRowHeader;

    if (canGroupByColumns) {
      /** @type {number[]} */
      var groupIndexes = [];
      /** @type {number} */

      var headerIndex = e.cell.header.index;
      var col = headerIndex;

      for (; col >= 0; col--) {
        if (!self.isColumnSelected(col)) break;
        groupIndexes[0] = col;
      }

      for (col = headerIndex;; col++) {
        if (!self.isColumnSelected(col)) break;
        groupIndexes[1] = col;
      }

      if (col !== headerIndex && groupIndexes.length === 2 && groupIndexes[1] > groupIndexes[0] && self.isNewGroupRangeValid(self.groupedColumns, groupIndexes[0], groupIndexes[1])) {
        var _columns = getColumnsMap();

        var groupTitles = [];
        var groupNames = [];

        for (var i = 0; i < groupIndexes.length; i++) {
          var _columnIndex = groupIndexes[i];

          var _column = _columns.get(_columnIndex);

          if (_column) {
            groupNames.push(_column.name);
            groupTitles.push(_column.title || _column.name || _column.index);
          }
        }

        if (groupNames[0] && groupNames[1]) {
          // show group options
          e.items.push({
            title: self.attributes.showGroupColumns.replace('%s', groupTitles[0] + '-' + groupTitles[1]),
            click: function click(ev) {
              ev.preventDefault();
              self.groupColumns(groupNames[0], groupNames[1]);
              self.controlInput.focus();
            }
          });
        }
      }
    }

    if (canUngroupColumns) {
      var _columnIndex2 = e.cell.columnIndex;
      var groups = self.getGroupsColumnBelongsTo(_columnIndex2);

      var _columns2 = getColumnsMap();

      var _loop = function _loop(_i2) {
        var _groups$_i = groups[_i2],
            from = _groups$_i.from,
            to = _groups$_i.to;

        var cell0 = _columns2.get(from);

        var cell1 = _columns2.get(to);

        if (cell0 && cell1) {
          var formatArgs = (cell0.title || cell0.name || cell0.index) + '-' + (cell1.title || cell1.name || cell1.index);
          e.items.push({
            title: self.attributes.showRemoveGroupColumns.replace('%s', formatArgs),
            click: function click(ev) {
              ev.preventDefault();
              self.removeGroupColumns(cell0.name, cell1.name);
              self.controlInput.focus();
            }
          });
        } else {
          console.warn("Cannot find column ".concat(from, " or column ").concat(to));
        }
      };

      for (var _i2 = 0; _i2 < groups.length; _i2++) {
        _loop(_i2);
      }
    }

    if (canGroupByRows) {
      var _range = getSelectedContiguousRows(false) || [];

      var rangeTitle = _range.map(function (rowIndex) {
        var index = self.getBoundRowIndexFromViewRowIndex(rowIndex);
        if (typeof index === 'number') return index + 1;
        return rowIndex + 1;
      }).join('-');

      if (_range.length === 2 && self.isNewGroupRangeValid(self.groupedRows, _range[0], _range[1])) {
        e.items.push({
          title: self.attributes.showGroupRows.replace('%s', rangeTitle),
          click: function click(ev) {
            ev.preventDefault();
            self.groupRows(_range[0], _range[1]);
          }
        });
      }
    }

    if (canUngroupRows) {
      var rowIndex = e.cell.rowIndex;

      var _groups = self.getGroupsRowBelongsTo(rowIndex);

      var _loop2 = function _loop2(_i3) {
        var _groups$_i2 = _groups[_i3],
            from = _groups$_i2.from,
            to = _groups$_i2.to;
        var rangeTitle = [from, to].map(function (rowIndex) {
          var index = self.getBoundRowIndexFromViewRowIndex(rowIndex);
          if (typeof index === 'number') return index + 1;
          return rowIndex + 1;
        }).join('-');
        e.items.push({
          title: self.attributes.showRemoveGroupRows.replace('%s', rangeTitle),
          click: function click(ev) {
            ev.preventDefault();
            self.removeGroupRows(from, to);
            self.controlInput.focus();
          }
        });
      };

      for (var _i3 = 0; _i3 < _groups.length; _i3++) {
        _loop2(_i3);
      }
    } //#endregion group/ungroup columns

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
    } // don't create context menu for parents if current position is located in child grid


    var children = Object.keys(self.childGrids);

    for (var i = 0; i < children.length; i++) {
      var childGrid = self.childGrids[children[i]];
      var parentNode = childGrid && childGrid.parentNode;
      if (!parentNode) continue;
      var offsetLeft = parentNode.offsetLeft,
          offsetWidth = parentNode.offsetWidth,
          offsetTop = parentNode.offsetTop,
          offsetHeight = parentNode.offsetHeight;
      if ((e.x >= offsetLeft && e.x <= offsetLeft + offsetWidth) === false) continue;
      if ((e.y >= offsetTop && e.y <= offsetTop + offsetHeight) === false) continue;
      return; // in child grid
    } // don't create context menu for child if current position is located in parent grid


    if (self.isChildGrid && self.parentNode) {
      //#region check is current child grid closed
      var childGridsOfParent = self.parentGrid && self.parentGrid.childGrids;
      if (!childGridsOfParent || !Array.isArray(childGridsOfParent)) return;
      var matchedMe = childGridsOfParent.find(function (grid) {
        var nodeA = grid.parentNode;
        var nodeB = self.parentNode;
        return nodeA.offsetTop == nodeB.offsetTop && nodeA.offsetLeft === nodeB.offsetLeft;
      });
      if (!matchedMe) return; //#endregion

      var x0 = self.parentNode.offsetLeft;
      var x1 = self.parentNode.offsetLeft + self.parentNode.offsetWidth;
      var y0 = self.parentNode.offsetTop;
      var y1 = self.parentNode.offsetTop + self.parentNode.offsetHeight;
      var node = self.parentNode.parentNode;

      while (node) {
        var _node = node,
            _offsetLeft = _node.offsetLeft,
            _offsetWidth = _node.offsetWidth,
            _offsetTop = _node.offsetTop,
            _offsetHeight = _node.offsetHeight;
        if (_offsetLeft > x0) x0 = _offsetLeft;
        if (_offsetTop > y0) y0 = _offsetTop;
        var newX1 = _offsetLeft + _offsetWidth;
        var newY1 = _offsetTop + _offsetHeight;
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
        window.removeEventListener('mouseup', createDisposeEvent);
      });
    }

    var contextPosition,
        items = [],
        pos = overridePos || self.getLayerPos(e),
        ev = {
      NativeEvent: e,
      cell: self.getCellAt(pos.x, pos.y),
      pos: pos,
      items: items
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
        left: pos.x + pos.rect.left + self.style.contextMenuMarginLeft + self.canvasOffsetLeft,
        top: pos.y + pos.rect.top + self.style.contextMenuMarginTop + self.canvasOffsetTop,
        right: ev.cell.width + ev.cell.x + pos.rect.left,
        bottom: ev.cell.height + ev.cell.y + pos.rect.top,
        height: ev.cell.height,
        width: ev.cell.width
      };

      if (self.mobile) {
        contextPosition.left = self.style.mobileContextMenuMargin + 'px';
        contextPosition.width = self.width - self.style.mobileContextMenuMargin * 2 + 'px';
      }

      if (e.type == 'mousedown') {
        contextPosition.top += self.style.filterButtonMenuOffsetTop;
      }

      self.contextMenu = createContextMenu(ev, contextPosition, items);

      if (e.type == 'mousedown') {
        window.addEventListener('mouseup', createDisposeEvent);
      } else {
        createDisposeEvent();
      }

      e.preventDefault();
    }
  };

  return;
}

/***/ }),

/***/ "./lib/defaults.js":
/*!*************************!*\
  !*** ./lib/defaults.js ***!
  \*************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/*jslint browser: true, unparam: true, todo: true*/

/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(self) {
  self.defaults = {
    attributes: [['allowColumnReordering', true], ['allowColumnResize', true], ['allowColumnResizeFromCell', false], ['allowFreezingRows', false], ['allowFreezingColumns', false], ['allowMovingSelection', true], ['allowRowHeaderResize', true], ['allowRowReordering', false], ['allowRowResize', true], ['allowRowResizeFromCell', false], ['allowSorting', true], ['allowGroupingRows', true], ['allowGroupingColumns', true], ['animationDurationShowContextMenu', 50], ['animationDurationHideContextMenu', 50], ['autoGenerateSchema', false], ['autoResizeColumns', false], ['autoResizeRows', false], ['autoScrollOnMousemove', false], ['autoScrollMargin', 5], ['allowShrinkingSelection', false], ['blanksText', '(Blanks)'], ['borderDragBehavior', 'none'], ['borderResizeZone', 10], ['clearCellsWhenShrinkingSelection', false], ['clearSettingsOptionText', 'Clear saved settings'], ['columnHeaderClickBehavior', 'sort'], ['columnSelectorHiddenText', '&nbsp;&nbsp;&nbsp;'], ['columnSelectorText', 'Add/Remove columns'], ['columnSelectorVisibleText', "\u2713"], ['contextHoverScrollAmount', 2], ['contextHoverScrollRateMs', 5], ['copyHeadersOnSelectAll', true], ['copyText', 'Copy'], ['debug', false], ['editable', true], ['ellipsisText', '...'], ['filterOptionText', 'Filter %s'], ['filterTextPrefix', '(filtered) '], ['filterFrozenRows', true], ['globalRowResize', false], ['hideColumnText', 'Hide %s'], ['showUnhideColumnsIndicator', false], ['showUnhideRowsIndicator', false], ['showHideRow', 'Hide row %s'], ['showHideRows', 'Hide rows %s'], ['hoverMode', 'cell'], ['keepFocusOnMouseOut', false], ['maxAutoCompleteItems', 200], ['multiLine', false], ['name', ''], ['pageUpDownOverlap', 1], ['pasteText', 'Paste'], ['persistantSelectionMode', false], ['removeFilterOptionText', 'Remove filter on %s'], ['reorderDeadZone', 3], ['resizeScrollZone', 20], ['rowGrabZoneSize', 5], ['columnGrabZoneSize', 30], ['saveAppearance', true], ['scrollAnimationPPSThreshold', 0.75], ['scrollPointerLock', false], ['scrollRepeatRate', 75], ['selectionFollowsActiveCell', false], ['selectionHandleBehavior', 'none'], ['selectionMode', 'cell'], ['selectionScrollIncrement', 20], ['selectionScrollZone', 20], ['showClearSettingsOption', true], ['showColumnHeaders', true], ['showColumnSelector', true], ['showCopy', false], ['showFilter', true], ['showFilterInCell', false], ['showNewRow', false], ['showOrderByOption', true], ['showOrderByOptionTextAsc', 'Order by %s ascending'], ['showOrderByOptionTextDesc', 'Order by %s descending'], //#region grouping
    ['showGroupColumns', 'Group columns %s'], ['showGroupRows', 'Group rows %s'], ['showRemoveGroupColumns', 'Remove group %s'], ['showRemoveGroupRows', 'Remove group %s'], ['showRemoveAllGroupColumns', 'Remove all column groups'], ['showRemoveAllGroupRows', 'Remove all row groups'], ['showExpandAllGroupColumns', 'Expand all column groups'], ['showExpandAllGroupRows', 'Expand all row groups'], ['showCollapseAllGroupColumns', 'Collapse all column groups'], ['showCollapseAllGroupRows', 'Collapse all row groups'], ['columnGroupIndicatorPosition', 'right'], ['rowGroupIndicatorPosition', 'bottom'], //#endregion grouping
    ['showPaste', false], ['showPerformance', false], ['showRowHeaders', true], ['showRowNumbers', true], ['showRowNumberGaps', true], ['singleSelectionMode', false], ['snapToRow', false], ['sortFrozenRows', true], ['touchContextMenuTimeMs', 800], ['touchDeadZone', 3], ['touchEasingMethod', 'easeOutQuad'], ['touchReleaseAcceleration', 1000], ['touchReleaseAnimationDurationMs', 2000], ['touchScrollZone', 20], ['touchSelectHandleZone', 20], ['touchZoomSensitivity', 0.005], ['touchZoomMin', 0.5], ['touchZoomMax', 1.75], ['maxPixelRatio', 2], ['tree', false], ['treeHorizontalScroll', false], ['rowTree', []], ['rowTreeColIndex', 0], ['columnTree', []], ['columnTreeRowStartIndex', 0], ['columnTreeRowEndIndex', 0]],
    styles: [['activeCellBackgroundColor', 'rgba(255, 255, 255, 1)'], ['activeCellBorderColor', 'rgba(110, 168, 255, 1)'], ['activeCellBorderWidth', 1], ['activeCellColor', 'rgba(0, 0, 0, 1)'], ['activeCellFont', '16px sans-serif'], ['activeCellHoverBackgroundColor', 'rgba(255, 255, 255, 1)'], ['activeCellHorizontalAlignment', 'left'], ['activeCellHoverColor', 'rgba(0, 0, 0, 1)'], ['activeCellOverlayBorderColor', 'rgba(66, 133, 244, 1)'], ['activeCellOverlayBorderWidth', 1], ['activeCellPaddingBottom', 5], ['activeCellPaddingLeft', 5], ['activeCellPaddingRight', 5], ['activeCellPaddingTop', 5], ['activeCellSelectedBackgroundColor', 'rgba(236, 243, 255, 1)'], ['activeCellSelectedColor', 'rgba(0, 0, 0, 1)'], ['activeCellVerticalAlignment', 'center'], ['activeColumnHeaderCellBackgroundColor', 'rgba(225, 225, 225, 1)'], ['activeColumnHeaderCellColor', 'rgba(0, 0, 0, 1)'], ['activeRowHeaderCellBackgroundColor', 'rgba(225, 225, 225, 1)'], ['activeRowHeaderCellColor', 'rgba(0, 0, 0, 1)'], ['autocompleteBottomMargin', 60], ['autosizeHeaderCellPadding', 8], ['autosizePadding', 5], ['buttonActiveBackgroundColor', 'rgba(255, 255, 255, 1)'], ['buttonActiveBorderColor', 'rgba(110, 168, 255, 1)'], ['buttonArrowColor', 'rgba(50, 50, 50, 1)'], ['buttonArrowDownHTML', '&#x25BC;'], ['buttonZIndex', 10000], ['buttonBackgroundColor', 'rgba(255, 255, 255, 1)'], ['buttonBorderColor', 'rgba(172, 172, 172, 1)'], ['buttonHoverBackgroundColor', 'rgba(240, 240, 240, 1)'], ['buttonMenuWindowMargin', 30], ['buttonPadding', '3px'], ['cellAutoResizePadding', 13], ['cellBackgroundColor', 'rgba(255, 255, 255, 1)'], ['cellBorderColor', 'rgba(195, 199, 202, 1)'], ['cellBorderWidth', 1], ['cellColor', 'rgba(0, 0, 0, 1)'], ['cellFont', '16px sans-serif'], ['cellGridHeight', 250], ['cellHeight', 24], ['cellHeightWithChildGrid', 150], ['cellHorizontalAlignment', 'left'], ['cellHoverBackgroundColor', 'rgba(255, 255, 255, 1)'], ['cellHoverColor', 'rgba(0, 0, 0, 1)'], ['cellPaddingBottom', 5], ['cellPaddingLeft', 5], ['cellPaddingRight', 5], ['cellPaddingTop', 5], ['cellSelectedBackgroundColor', 'rgba(236, 243, 255, 1)'], ['cellSelectedColor', 'rgba(0, 0, 0, 1)'], ['cellTreeIconBorderColor', 'rgba(162, 174, 207, 1)'], ['cellTreeIconFillColor', 'rgba(240, 240, 240, 1)'], ['cellTreeIconHoverFillColor', 'rgba(198, 217, 233, 1)'], ['cellTreeIconLineColor', 'rgba(43, 53, 81, 1)'], ['cellTreeIconLineWidth', 1.5], ['cellTreeIconMarginLeft', 0], ['cellTreeIconMarginRight', 5], ['cellTreeIconMarginTop', 6], ['cellTreeIconWidth', 13], ['cellVerticalAlignment', 'center'], ['cellWidth', 250], ['cellWidthWithChildGrid', 250], ['cellWhiteSpace', 'nowrap'], ['cellLineHeight', 1], ['cellLineSpacing', 3], ['childContextMenuArrowColor', 'rgba(43, 48, 43, 1)'], ['childContextMenuArrowHTML', '&#x25BA;'], ['childContextMenuMarginLeft', -11], ['childContextMenuMarginTop', -6], ['columnGroupRowHeight', 25], ['columnHeaderCellBackgroundColor', 'rgba(240, 240, 240, 1)'], ['columnHeaderCellBorderColor', 'rgba(172, 172, 172, 1)'], ['columnHeaderCellBorderWidth', 1], ['columnHeaderCellCapBackgroundColor', 'rgba(240, 240, 240, 1)'], ['columnHeaderCellCapBorderColor', 'rgba(172, 172, 172, 1)'], ['columnHeaderCellCapBorderWidth', 1], ['columnHeaderCellColor', 'rgba(50, 50, 50, 1)'], ['columnHeaderCellFont', '16px sans-serif'], ['columnHeaderCellHeight', 25], ['columnHeaderCellHorizontalAlignment', 'left'], ['columnHeaderCellHoverBackgroundColor', 'rgba(235, 235, 235, 1)'], ['columnHeaderCellHoverColor', 'rgba(0, 0, 0, 1)'], ['columnHeaderCellPaddingBottom', 5], ['columnHeaderCellPaddingLeft', 5], ['columnHeaderCellPaddingRight', 5], ['columnHeaderCellPaddingTop', 5], ['columnHeaderCellVerticalAlignment', 'center'], ['columnHeaderOrderByArrowBorderColor', 'rgba(195, 199, 202, 1)'], ['columnHeaderOrderByArrowBorderWidth', 1], ['columnHeaderOrderByArrowColor', 'rgba(155, 155, 155, 1)'], ['columnHeaderOrderByArrowHeight', 8], ['columnHeaderOrderByArrowMarginLeft', 0], ['columnHeaderOrderByArrowMarginRight', 5], ['columnHeaderOrderByArrowMarginTop', 6], ['columnHeaderOrderByArrowWidth', 13], ['contextFilterButtonBorder', 'solid 1px rgba(158, 163, 169, 1)'], ['contextFilterButtonBorderRadius', '3px'], ['contextFilterButtonHTML', '&#x25BC;'], ['contextFilterInputBackground', 'rgba(255,255,255,1)'], ['contextFilterInputBorder', 'solid 1px rgba(158, 163, 169, 1)'], ['contextFilterInputBorderRadius', '0'], ['contextFilterInputColor', 'rgba(0,0,0,1)'], ['contextFilterInputFontFamily', 'sans-serif'], ['contextFilterInputFontSize', '14px'], ['contextFilterInvalidRegExpBackground', 'rgba(180, 6, 1, 1)'], ['contextFilterInvalidRegExpColor', 'rgba(255, 255, 255, 1)'], ['contextMenuArrowColor', 'rgba(43, 48, 43, 1)'], ['contextMenuArrowDownHTML', '&#x25BC;'], ['contextMenuArrowUpHTML', '&#x25B2;'], ['contextMenuBackground', 'rgba(240, 240, 240, 1)'], ['contextMenuBorder', 'solid 1px rgba(158, 163, 169, 1)'], ['contextMenuBorderRadius', '3px'], ['contextMenuChildArrowFontSize', '12px'], ['contextMenuColor', 'rgba(43, 48, 43, 1)'], ['contextMenuCursor', 'default'], ['contextMenuFilterButtonFontFamily', 'sans-serif'], ['contextMenuFilterButtonFontSize', '10px'], ['contextMenuFilterInvalidExpresion', 'rgba(237, 155, 156, 1)'], ['contextMenuFontFamily', 'sans-serif'], ['contextMenuFontSize', '16px'], ['contextMenuHoverBackground', 'rgba(182, 205, 250, 1)'], ['contextMenuHoverColor', 'rgba(43, 48, 153, 1)'], ['contextMenuItemBorderRadius', '3px'], ['contextMenuItemMargin', '2px'], ['contextMenuLabelDisplay', 'inline-block'], ['contextMenuLabelMargin', '0 3px 0 0'], ['contextMenuLabelMaxWidth', '700px'], ['contextMenuLabelMinWidth', '75px'], ['contextMenuMarginLeft', 3], ['contextMenuMarginTop', -3], ['contextMenuOpacity', '0.98'], ['contextMenuPadding', '2px'], ['contextMenuWindowMargin', 30], ['contextMenuZIndex', 10000], ['cornerCellBackgroundColor', 'rgba(240, 240, 240, 1)'], ['cornerCellBorderColor', 'rgba(202, 202, 202, 1)'], ['debugBackgroundColor', 'rgba(0, 0, 0, .0)'], ['debugColor', 'rgba(255, 15, 24, 1)'], ['debugEntitiesColor', 'rgba(76, 231, 239, 1.00)'], ['debugFont', '11px sans-serif'], ['debugPerfChartBackground', 'rgba(29, 25, 26, 1.00)'], ['debugPerfChartTextColor', 'rgba(255, 255, 255, 0.8)'], ['debugPerformanceColor', 'rgba(252, 255, 37, 1.00)'], ['debugScrollHeightColor', 'rgba(248, 33, 103, 1.00)'], ['debugScrollWidthColor', 'rgba(66, 255, 27, 1.00)'], ['debugTouchPPSXColor', 'rgba(246, 102, 24, 1.00)'], ['debugTouchPPSYColor', 'rgba(186, 0, 255, 1.00)'], ['display', 'inline-block'], ['editCellBackgroundColor', 'white'], ['editCellBorder', 'solid 1px rgba(110, 168, 255, 1)'], ['editCellBoxShadow', '0 2px 5px rgba(0,0,0,0.4)'], ['editCellColor', 'black'], ['editCellFontFamily', 'sans-serif'], ['editCellFontSize', '16px'], ['editCellPaddingLeft', 4], ['editCellZIndex', 10000], ['filterButtonActiveBackgroundColor', 'rgba(225, 225, 225, 1)'], ['filterButtonArrowBorderColor', 'rgba(195, 199, 202, 1)'], ['filterButtonArrowBorderWidth', 1], ['filterButtonArrowClickRadius', 5], ['filterButtonArrowColor', 'rgba(50, 50, 50, 1)'], ['filterButtonArrowHeight', 5], ['filterButtonArrowWidth', 8], ['filterButtonBackgroundColor', 'rgba(240, 240, 240, 1)'], ['filterButtonBorderColor', 'rgba(172, 172, 172, 1)'], ['filterButtonBorderRadius', 3], ['filterButtonHeight', 20], ['filterButtonHoverBackgroundColor', 'rgba(235, 235, 235, 1)'], ['filterButtonMenuOffsetTop', 10], ['filterButtonWidth', 20], ['frozenMarkerHoverColor', 'rgba(165, 198, 254, 1)'], ['frozenMarkerHoverBorderColor', 'rgba(165, 198, 254, 1)'], ['frozenMarkerActiveColor', 'rgba(165, 198, 254, 0.2)'], ['frozenMarkerActiveBorderColor', 'rgba(165, 198, 254, 0.5)'], ['frozenMarkerActiveHeaderColor', 'rgba(165, 198, 254, 1)'], ['frozenMarkerColor', 'rgba(221, 221, 221, 1)'], ['frozenMarkerBorderColor', 'rgba(221, 221, 221, 1)'], ['frozenMarkerBorderWidth', 1], ['frozenMarkerHeaderColor', 'rgba(188, 188, 188, 1)'], ['frozenMarkerWidth', 4], ['groupingAreaBackgroundColor', 'rgba(240, 240, 240, 1)'], ['gridBackgroundColor', 'rgba(240, 240, 240, 1)'], ['gridBorderCollapse', 'collapse'], ['gridBorderColor', 'rgba(202, 202, 202, 1)'], ['gridBorderWidth', 1], ['groupIndicatorColor', 'rgba(155, 155, 155, 1)'], ['groupIndicatorBackgroundColor', 'rgba(255, 255, 255, 1)'], ['height', 'auto'], ['maxHeight', 'inherit'], ['maxWidth', 'inherit'], ['minColumnWidth', 45], ['minHeight', 'inherit'], ['minRowHeight', 24], ['minWidth', 'inherit'], ['mobileContextMenuMargin', 10], ['mobileEditInputHeight', 30], ['mobileEditFontFamily', 'sans-serif'], ['mobileEditFontSize', '16px'], ['moveOverlayBorderWidth', 1], ['moveOverlayBorderColor', 'rgba(66, 133, 244, 1)'], ['moveOverlayBorderSegments', '12, 7'], ['name', 'default'], ['overflowY', 'auto'], ['overflowX', 'auto'], ['reorderMarkerBackgroundColor', 'rgba(0, 0, 0, 0.1)'], ['reorderMarkerBorderColor', 'rgba(0, 0, 0, 0.2)'], ['reorderMarkerBorderWidth', 1.25], ['reorderMarkerIndexBorderColor', 'rgba(66, 133, 244, 1)'], ['reorderMarkerIndexBorderWidth', 2.75], ['rowGroupColumnWidth', 25], ['rowHeaderCellBackgroundColor', 'rgba(240, 240, 240, 1)'], ['rowHeaderCellBorderColor', 'rgba(200, 200, 200, 1)'], ['rowHeaderCellBorderWidth', 1], ['rowHeaderCellColor', 'rgba(50, 50, 50, 1)'], ['rowHeaderCellFont', '16px sans-serif'], ['rowHeaderCellHeight', 25], ['rowHeaderCellHorizontalAlignment', 'left'], ['rowHeaderCellHoverBackgroundColor', 'rgba(235, 235, 235, 1)'], ['rowHeaderCellHoverColor', 'rgba(0, 0, 0, 1)'], ['rowHeaderCellPaddingBottom', 5], ['rowHeaderCellPaddingLeft', 5], ['rowHeaderCellPaddingRight', 5], ['rowHeaderCellPaddingTop', 5], ['rowHeaderCellRowNumberGapHeight', 5], ['rowHeaderCellRowNumberGapColor', 'rgba(50, 50, 50, 1)'], ['rowHeaderCellSelectedBackgroundColor', 'rgba(217, 217, 217, 1)'], ['rowHeaderCellSelectedColor', 'rgba(50, 50, 50, 1)'], ['rowHeaderCellVerticalAlignment', 'center'], ['rowHeaderCellWidth', 57], ['scrollBarActiveColor', 'rgba(125, 125, 125, 1)'], ['scrollBarBackgroundColor', 'rgba(240, 240, 240, 1)'], ['scrollBarBorderColor', 'rgba(202, 202, 202, 1)'], ['scrollBarBorderWidth', 0.5], ['scrollBarBoxBorderRadius', 4.125], ['scrollBarBoxColor', 'rgba(192, 192, 192, 1)'], ['scrollBarBoxMargin', 2], ['scrollBarBoxMinSize', 15], ['scrollBarBoxWidth', 8], ['scrollBarCornerBackgroundColor', 'rgba(240, 240, 240, 1)'], ['scrollBarCornerBorderColor', 'rgba(202, 202, 202, 1)'], ['scrollBarWidth', 11], ['selectionHandleBorderColor', 'rgba(255, 255, 255, 1)'], ['selectionHandleBorderWidth', 1.5], ['selectionHandleColor', 'rgba(66, 133, 244, 1)'], ['selectionHandleSize', 8], ['selectionHandleType', 'square'], ['fillOverlayBorderColor', 'rgba(127, 127, 127, 1)'], ['fillOverlayBorderWidth', 2], ['selectionOverlayBorderColor', 'rgba(66, 133, 244, 1)'], ['selectionOverlayBorderWidth', 1], ['treeArrowBorderColor', 'rgba(195, 199, 202, 1)'], ['treeArrowBorderWidth', 1], ['treeArrowClickRadius', 5], ['treeArrowColor', 'rgba(155, 155, 155, 1)'], ['treeArrowHeight', 8], ['treeArrowMarginLeft', 0], ['treeArrowMarginRight', 5], ['treeArrowMarginTop', 6], ['treeArrowWidth', 13], ['treeGridHeight', 250], ['unhideIndicatorColor', 'rgba(0, 0, 0, 1)'], ['unhideIndicatorBackgroundColor', 'rgba(255, 255, 255, 1)'], ['unhideIndicatorBorderColor', 'rgba(174, 193, 232, 1)'], ['unhideIndicatorSize', 16], ['width', 'auto']]
  };
}

/***/ }),

/***/ "./lib/dom.js":
/*!********************!*\
  !*** ./lib/dom.js ***!
  \********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/*jslint browser: true, unparam: true, todo: true*/

/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(self) {
  self.getClippingRect = function (ele) {
    var boundingRect = self.position(self.parentNode),
        eleRect = self.position(ele),
        s = self.scrollOffset(self.canvas),
        clipRect = {
      x: 0,
      y: 0,
      h: 0,
      w: 0
    },
        parentRect = {
      x: -Infinity,
      y: -Infinity,
      h: Infinity,
      w: Infinity
    },
        columnHeaderCellHeight = self.getColumnHeaderCellHeight(),
        rowHeaderCellWidth = self.getRowHeaderCellWidth();
    boundingRect.top -= s.top;
    boundingRect.left -= s.left;
    eleRect.top -= s.top;
    eleRect.left -= s.left;
    clipRect.h = boundingRect.top + boundingRect.height - ele.offsetTop - self.style.scrollBarWidth;
    clipRect.w = boundingRect.left + boundingRect.width - ele.offsetLeft - self.style.scrollBarWidth;
    clipRect.x = boundingRect.left + eleRect.left * -1 + rowHeaderCellWidth;
    clipRect.y = boundingRect.top + eleRect.top * -1 + columnHeaderCellHeight;
    return {
      x: clipRect.x > parentRect.x ? clipRect.x : parentRect.x,
      y: clipRect.y > parentRect.y ? clipRect.y : parentRect.y,
      h: clipRect.h < parentRect.h ? clipRect.h : parentRect.h,
      w: clipRect.w < parentRect.w ? clipRect.w : parentRect.w
    };
  };

  self.clipElement = function (ele) {
    var clipRect = self.getClippingRect(ele);

    if (clipRect.w < 0) {
      clipRect.w = 0;
    }

    if (clipRect.h < 0) {
      clipRect.h = 0;
    }

    ele.style.clip = 'rect(' + clipRect.y + 'px,' + clipRect.w + 'px,' + clipRect.h + 'px,' + clipRect.x + 'px' + ')'; // INFO https://developer.mozilla.org/en-US/docs/Web/CSS/clip
    // clip has been "deprecated" for clipPath.  Of course nothing but chrome
    // supports clip path, so we'll keep using clip until someday clipPath becomes
    // more widely support.  The code below works correctly, but setting clipPath and clip
    // at the same time has undesirable results.
    // ele.style.clipPath = 'polygon('
    //     + clipRect.x + 'px ' + clipRect.y + 'px,'
    //     + clipRect.x + 'px ' + clipRect.h + 'px,'
    //     + clipRect.w + 'px ' + clipRect.h + 'px,'
    //     + clipRect.w + 'px ' + clipRect.y + 'px'
    //     + ')';
  };

  self.scrollOffset = function (e) {
    var x = 0,
        y = 0,
        scrollingElement = document.scrollingElement || {
      scrollLeft: 0,
      scrollTop: 0
    };

    while (e.parentNode && e.nodeName !== 'CANVAS-DATAGRID' && e !== self.intf) {
      if (e.nodeType !== 'canvas-datagrid-tree' && e.nodeType !== 'canvas-datagrid-cell') {
        x -= e.scrollLeft;
        y -= e.scrollTop;
      }

      e = e.parentNode;
    }

    return {
      left: x - scrollingElement.scrollLeft,
      top: y - scrollingElement.scrollTop
    };
  };

  self.resizeEditInput = function () {
    if (self.input && self.input.editCell) {
      var pos = self.canvas.getBoundingClientRect(),
          s = self.scrollOffset(self.intf),
          bm = self.style.gridBorderCollapse === 'collapse' ? 1 : 2,
          borderWidth = self.style.cellBorderWidth * bm,
          cell = self.getVisibleCellByIndex(self.input.editCell.columnIndex, self.input.editCell.rowIndex) || {
        x: -100,
        y: -100,
        height: 0,
        width: 0
      };

      if (self.mobile) {
        self.input.style.left = '0';
        self.input.style.top = self.height - self.style.mobileEditInputHeight - borderWidth - 1 + 'px';
        self.input.style.height = self.style.mobileEditInputHeight + 'px';
        self.input.style.width = self.width - borderWidth - 1 + 'px';
        return;
      }

      var groupAreaOffsetY = self.getColumnGroupAreaHeight();
      var groupAreaOffsetX = self.getRowGroupAreaWidth();

      if (self.parentNode) {
        var _self$parentNode = self.parentNode,
            columnGroupsAreaHeight = _self$parentNode.columnGroupsAreaHeight,
            rowGroupsAreaWidth = _self$parentNode.rowGroupsAreaWidth;
        if (columnGroupsAreaHeight) groupAreaOffsetY += columnGroupsAreaHeight;
        if (rowGroupsAreaWidth) groupAreaOffsetX += rowGroupsAreaWidth;
      }

      self.input.style.left = pos.left + cell.x + self.canvasOffsetLeft - s.left + groupAreaOffsetX + 'px';
      self.input.style.top = pos.top + cell.y - self.style.cellBorderWidth + self.canvasOffsetTop - s.top + groupAreaOffsetY + 'px';
      self.input.style.height = cell.height - borderWidth + 'px';
      self.input.style.width = cell.width - self.style.cellPaddingLeft + 'px';
      self.clipElement(self.input);
    }
  };

  self.position = function (e, ignoreScrollOffset) {
    var x = 0,
        y = 0,
        s = e,
        h,
        w;
    var calculatedTree = false;

    while (e.offsetParent && e.nodeName !== 'CANVAS-DATAGRID') {
      var isTree = e.nodeType === 'canvas-datagrid-tree';

      if (!isTree || !calculatedTree) {
        x += e.offsetLeft;
        y += e.offsetTop;
        h = e.offsetHeight;
        w = e.offsetWidth;
      }

      if (isTree) calculatedTree = true;
      e = e.offsetParent;
    }

    if (ignoreScrollOffset) {
      return {
        left: x,
        top: y,
        height: h,
        width: w
      };
    }

    e = s;
    s = self.scrollOffset(e);
    return {
      left: x + s.left,
      top: y + s.top,
      height: h,
      width: w
    };
  };

  self.getLayerPos = function (e) {
    var rect = self.canvas.getBoundingClientRect(),
        pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    if (self.isChildGrid) {
      pos.x -= self.canvasOffsetLeft;
      pos.y -= self.canvasOffsetTop;
      if (self.parentNode.rowGroupsAreaWidth) pos.x -= self.parentNode.rowGroupsAreaWidth;
      if (self.parentNode.columnGroupsAreaHeight) pos.y -= self.parentNode.columnGroupsAreaHeight;
    }

    return {
      x: pos.x,
      y: pos.y,
      rect: rect
    };
  };
  /**
   * Ends editing, optionally aborting the edit.
   * @memberof canvasDatagrid
   * @name endEdit
   * @method
   * @param {boolean} abort When true, abort the edit.
   */


  self.endEdit = function (abort) {
    var cell = self.input.editCell,
        y = cell.rowIndex;

    function abortEdit() {
      abort = true;
    }

    if (self.dispatchEvent('beforeendedit', {
      cell: cell,
      newValue: self.input.value,
      oldValue: cell.value,
      abort: abortEdit,
      input: self.input
    })) {
      return false;
    }

    if (self.input.value !== cell.value && !abort) {
      self.changes[y] = self.changes[y] || {};
      self.changes[y][cell.header.name] = self.input.value;

      if (!cell.data) {
        self.originalData[cell.boundRowIndex] = {};
        cell.data = self.originalData[cell.boundRowIndex];
      }

      cell.data[cell.header.name] = self.input.value;

      if (y === self.viewData.length) {
        if (self.dispatchEvent('newrow', {
          value: self.input.value,
          defaultValue: cell.value,
          aborted: abort,
          cell: cell,
          input: self.input
        })) {
          return false;
        }

        self.addRow(cell.data);
        self.createNewRowData();
      }

      self.draw(true);
    }

    if (self.input.parentNode) {
      self.input.parentNode.removeChild(self.input);
    }

    self.intf.focus();
    self.dispatchEvent('endedit', {
      cell: cell,
      value: self.input.value,
      aborted: abort,
      input: self.input
    });
    self.input = undefined;
    return true;
  };
  /**
   * Begins editing at cell x, row y.
   * @memberof canvasDatagrid
   * @name beginEditAt
   * @method
   * @param {number} x The column index of the cell to edit.
   * @param {number} y The row index of the cell to edit.
   * @param {boolean} inEnterMode If true, starting to type in cell will replace the
   * cell's previous value instead of appending, and using the arrow keys will allow
   * the user to navigate to adjacent cells instead of moving the text cursor around
   * (default is false, and means user is in 'edit' mode).
   */


  self.beginEditAt = function (x, y, NativeEvent) {
    var inEnterMode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (!self.attributes.editable) {
      return;
    }

    if (self.input) {
      self.endEdit();
    }

    var cell = self.getVisibleCellByIndex(x, y),
        s = self.getSchema(),
        adjacentCells,
        enumItems,
        enu,
        option,
        valueInEnum;

    if (!(cell && cell.header)) {
      return;
    } //HACK for IE10, does not like literal enum


    enu = cell.header['enum'];

    if (self.dispatchEvent('beforebeginedit', {
      cell: cell,
      NativeEvent: NativeEvent
    })) {
      return false;
    }

    self.scrollIntoView(x, y);
    self.setActiveCell(x, y);
    adjacentCells = self.getAdjacentCells();

    if (enu) {
      self.input = document.createElement('select');
    } else {
      self.input = document.createElement(self.attributes.multiLine ? 'textarea' : 'input');
    }

    cell = self.getVisibleCellByIndex(x, y); //HACK on mobile devices sometimes edit can begin without the cell being in view, I don't know how.

    if (!cell) {
      return;
    }

    if (enu) {
      // add enums
      if (typeof enu === 'function') {
        enumItems = enu.apply(self.intf, [{
          cell: cell
        }]);
      } else if (Array.isArray(enu)) {
        enumItems = enu;
      }

      enumItems.forEach(function (e) {
        var i = document.createElement('option'),
            val,
            title;

        if (Array.isArray(e)) {
          val = e[0];
          title = e[1];
        } else {
          val = e;
          title = e;
        }

        if (val === cell.value) {
          valueInEnum = true;
        }

        i.value = val;
        i.innerHTML = title;
        self.input.appendChild(i);
      });

      if (!valueInEnum) {
        option = document.createElement('option');
        option.value = cell.value;
        option.innerHTML = cell.value;
        self.input.appendChild(option);
      }

      self.input.addEventListener('change', function () {
        self.endEdit();
        self.draw(true);
      });
    } // if the user has not prevented the default action, append to the body


    if (!self.dispatchEvent('appendeditinput', {
      cell: cell,
      input: self.input
    })) {
      document.body.appendChild(self.input);
    }

    self.createInlineStyle(self.input, self.mobile ? 'canvas-datagrid-edit-mobile-input' : 'canvas-datagrid-edit-input');
    self.input.style.position = 'absolute';
    self.input.editCell = cell;
    self.resizeEditInput();
    self.input.style.zIndex = self.style.editCellZIndex;
    self.input.style.fontSize = parseInt(self.style.editCellFontSize, 10) * self.scale + 'px';
    var cellValueIsEmpty = [null, undefined].indexOf(cell.value) !== -1;
    var shouldClearCellValue = cellValueIsEmpty || inEnterMode;
    self.input.value = shouldClearCellValue ? '' : cell.value;
    var width = Math.round(self.input.value.length * parseInt(self.style.editCellFontSize, 10) * 0.7 * self.scale);

    if (width + self.style.cellPaddingLeft < cell.width) {
      width = cell.width - self.style.cellPaddingLeft;
    } else if (width > self.width - cell.x - self.style.scrollBarWidth) {
      width = self.width - cell.x - self.style.scrollBarWidth;
      self.input.style.height = 'auto';
    }

    self.input.style.width = width + 'px';
    self.input.focus();
    self.input.addEventListener('click', self.stopPropagation);
    self.input.addEventListener('dblclick', self.stopPropagation);
    self.input.addEventListener('mouseup', self.stopPropagation);
    self.input.addEventListener('mousedown', self.stopPropagation);
    self.input.addEventListener('keydown', function (e) {
      var nx = cell.columnIndex,
          ny = cell.rowIndex;

      if (e.key === 'Escape') {
        self.endEdit(true); // end edit and abort the value change

        self.draw(true);
      } else if (e.key === 'Enter' && self.attributes.multiLine && e.altKey) {
        self.input.value = self.input.value + '\n';
        self.input.scrollTop = self.input.scrollHeight;
      } else if (e.key === 'Enter') {
        self.endEdit(); // Move to cell in next or previous row

        var nextRowIndex = e.shiftKey ? Math.max(0, ny - 1) : Math.min(ny + 1, self.viewData.length - 1);

        if (nextRowIndex !== ny) {
          self.scrollIntoView(nx, nextRowIndex);
          self.setActiveCell(nx, nextRowIndex);
        }

        self.draw(true);
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && inEnterMode) {
        switch (e.key) {
          case 'ArrowUp':
            ny = Math.max(0, ny - 1);
            break;

          case 'ArrowDown':
            ny = Math.min(ny + 1, self.viewData.length - 1);
            break;

          case 'ArrowLeft':
            nx = Math.max(nx - 1, 0);
            break;

          case 'ArrowRight':
            nx = adjacentCells.right;
            break;
        }

        self.endEdit();
        self.scrollIntoView(nx, ny);
        self.setActiveCell(nx, ny);
        self.draw(true);
      } else if (e.key === 'Tab') {
        e.preventDefault();

        if (!self.endEdit()) {
          return;
        }

        if (e.shiftKey) {
          nx = adjacentCells.left;
        } else {
          nx = adjacentCells.right;
        }

        if (adjacentCells.left === x && e.shiftKey) {
          nx = adjacentCells.last;
          ny -= 1;
        }

        if (adjacentCells.right === x && !e.shiftKey) {
          nx = adjacentCells.first;
          ny += 1;
        }

        if (ny < 0) {
          ny = self.viewData.length - 1;
        }

        if (ny > self.viewData.length - 1) {
          ny = 0;
        }

        self.scrollIntoView(nx, ny);
        self.beginEditAt(nx, ny, e);
      } else {
        var _width = Math.round(self.input.value.length * parseInt(self.style.editCellFontSize, 10) * 0.7 * self.scale);

        if (_width + self.style.cellPaddingLeft < cell.width) {
          _width = cell.width - self.style.cellPaddingLeft;
        } else if (_width > self.width - cell.x - self.style.scrollBarWidth) {
          _width = self.width - cell.x - self.style.scrollBarWidth;
          self.input.style.height = 'auto';
        }

        self.input.style.width = _width + 'px';
      }
    });
    self.dispatchEvent('beginedit', {
      cell: cell,
      input: self.input
    });
  };

  self.createInlineStyle = function (el, className) {
    var css = {
      'canvas-datagrid-button-wrapper': {
        display: 'inline-block',
        padding: self.style.buttonPadding,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: self.style.buttonBorderColor,
        cursor: 'pointer',
        background: self.style.buttonBackgroundColor,
        userSelect: 'none'
      },
      'canvas-datagrid-button-wrapper:hover': {
        borderColor: self.style.buttonBorderColor,
        background: self.style.buttonHoverBackgroundColor
      },
      'canvas-datagrid-button-wrapper:active': {
        borderColor: self.style.buttonActiveBorderColor,
        background: self.style.buttonActiveBackgroundColor
      },
      'canvas-datagrid-button-icon': {
        width: '18px',
        height: '18px',
        display: 'inline-block',
        verticalAlign: 'middle'
      },
      'canvas-datagrid-button-arrow': {
        display: 'inline-block',
        color: self.style.buttonArrowColor,
        fontSize: '9px'
      },
      'canvas-datagrid-button-menu-item-mobile': {
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontFamily: self.style.contextMenuFontFamily,
        fontSize: self.style.contextMenuFontSize,
        color: 'inherit',
        background: 'inherit',
        margin: self.style.contextMenuItemMargin,
        borderRadius: self.style.contextMenuItemBorderRadius,
        verticalAlign: 'middle'
      },
      'canvas-datagrid-button-menu-item': {
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontFamily: self.style.contextMenuFontFamily,
        fontSize: self.style.contextMenuFontSize,
        color: 'inherit',
        background: 'inherit',
        margin: self.style.contextMenuItemMargin,
        borderRadius: self.style.contextMenuItemBorderRadius,
        verticalAlign: 'middle'
      },
      'canvas-datagrid-button-menu-item:hover': {
        background: self.style.contextMenuHoverBackground,
        color: self.style.contextMenuHoverColor
      },
      'canvas-datagrid-button-menu-label': {
        margin: self.style.contextMenuLabelMargin,
        display: self.style.contextMenuLabelDisplay,
        minWidth: self.style.contextMenuLabelMinWidth,
        maxWidth: self.style.contextMenuLabelMaxWidth
      },
      'canvas-datagrid-button-menu-mobile': {
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontFamily: self.style.contextMenuFontFamily,
        fontSize: self.style.contextMenuFontSize,
        background: self.style.contextMenuBackground,
        color: self.style.contextMenuColor,
        border: self.style.contextMenuBorder,
        padding: self.style.contextMenuPadding,
        borderRadius: self.style.contextMenuBorderRadius,
        opacity: self.style.contextMenuOpacity,
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      },
      'canvas-datagrid-button-menu': {
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontFamily: self.style.contextMenuFontFamily,
        fontSize: self.style.contextMenuFontSize,
        background: self.style.contextMenuBackground,
        color: self.style.contextMenuColor,
        border: self.style.contextMenuBorder,
        padding: self.style.contextMenuPadding,
        borderRadius: self.style.contextMenuBorderRadius,
        opacity: self.style.contextMenuOpacity,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        cursor: self.style.contextMenuCursor
      },
      'canvas-datagrid-context-menu-filter-input': {
        height: '19px',
        verticalAlign: 'bottom',
        marginLeft: '2px',
        padding: '0',
        background: self.style.contextFilterInputBackground,
        color: self.style.contextFilterInputColor,
        border: self.style.contextFilterInputBorder,
        borderRadius: self.style.contextFilterInputBorderRadius,
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontFamily: self.style.contextFilterInputFontFamily,
        fontSize: self.style.contextFilterInputFontSize
      },
      'canvas-datagrid-context-menu-filter-button': {
        height: '19px',
        verticalAlign: 'bottom',
        marginLeft: '2px',
        padding: '0',
        background: self.style.contextMenuBackground,
        color: self.style.contextMenuColor,
        border: self.style.contextFilterButtonBorder,
        borderRadius: self.style.contextFilterButtonBorderRadius,
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontFamily: self.style.contextMenuFilterButtonFontFamily,
        fontSize: self.style.contextMenuFilterButtonFontSize
      },
      'canvas-datagrid-context-child-arrow': {
        cssFloat: 'right',
        color: self.style.childContextMenuArrowColor,
        fontSize: self.style.contextMenuChildArrowFontSize,
        fontFamily: self.style.contextMenuFontFamily,
        verticalAlign: 'middle'
      },
      'canvas-datagrid-autocomplete': {
        fontFamily: self.style.contextMenuFontFamily,
        fontSize: self.style.contextMenuFontSize,
        background: self.style.contextMenuBackground,
        color: self.style.contextMenuColor,
        border: self.style.contextMenuBorder,
        padding: self.style.contextMenuPadding,
        borderRadius: self.style.contextMenuBorderRadius,
        opacity: self.style.contextMenuOpacity,
        position: 'absolute',
        zIndex: 9999,
        overflow: 'hidden'
      },
      'canvas-datagrid-autocomplete-item': {
        background: self.style.contextMenuBackground,
        color: self.style.contextMenuColor
      },
      'canvas-datagrid-autocomplete-item:hover': {
        background: self.style.contextMenuHoverBackground,
        color: self.style.contextMenuHoverColor
      },
      'canvas-datagrid-canvas': {
        position: 'absolute',
        zIndex: '-1'
      },
      'canvas-datagrid': {
        display: 'block'
      },
      'canvas-datagrid-control-input': {
        position: 'fixed',
        top: '-5px',
        left: '-5px',
        border: 'none',
        opacity: '0',
        cursor: 'pointer',
        width: '1px',
        height: '1px',
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontFamily: self.style.contextMenuFontFamily,
        fontSize: self.style.contextMenuFontSize
      },
      'canvas-datagrid-edit-mobile-input': {
        boxSizing: 'content-box',
        outline: 'none',
        margin: '0',
        padding: '0 0 0 0',
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontFamily: self.style.mobileEditFontFamily,
        fontSize: self.style.mobileEditFontSize,
        border: self.style.editCellBorder,
        color: self.style.editCellColor,
        background: self.style.editCellBackgroundColor,
        appearance: 'none',
        webkitAppearance: 'none',
        mozAppearance: 'none',
        borderRadius: '0'
      },
      'canvas-datagrid-edit-input': {
        boxSizing: 'content-box',
        outline: 'none',
        margin: '0',
        padding: '0 0 0 ' + self.style.editCellPaddingLeft + 'px',
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontFamily: self.style.editCellFontFamily,
        fontSize: self.style.editCellFontSize,
        boxShadow: self.style.editCellBoxShadow,
        border: self.style.editCellBorder,
        color: self.style.editCellColor,
        background: self.style.editCellBackgroundColor,
        appearance: 'none',
        webkitAppearance: 'none',
        mozAppearance: 'none',
        borderRadius: '0'
      },
      'canvas-datagrid-context-menu-item-mobile': {
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontFamily: self.style.contextMenuFontFamily,
        fontSize: self.style.contextMenuFontSize,
        color: 'inherit',
        background: 'inherit',
        margin: self.style.contextMenuItemMargin,
        borderRadius: self.style.contextMenuItemBorderRadius,
        verticalAlign: 'middle'
      },
      'canvas-datagrid-context-menu-item': {
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontFamily: self.style.contextMenuFontFamily,
        fontSize: self.style.contextMenuFontSize,
        color: 'inherit',
        background: 'inherit',
        margin: self.style.contextMenuItemMargin,
        borderRadius: self.style.contextMenuItemBorderRadius,
        verticalAlign: 'middle'
      },
      'canvas-datagrid-context-menu-item:hover': {
        background: self.style.contextMenuHoverBackground,
        color: self.style.contextMenuHoverColor
      },
      'canvas-datagrid-context-menu-label': {
        margin: self.style.contextMenuLabelMargin,
        display: self.style.contextMenuLabelDisplay,
        minWidth: self.style.contextMenuLabelMinWidth,
        maxWidth: self.style.contextMenuLabelMaxWidth
      },
      'canvas-datagrid-context-menu-mobile': {
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontFamily: self.style.contextMenuFontFamily,
        fontSize: self.style.contextMenuFontSize,
        background: self.style.contextMenuBackground,
        color: self.style.contextMenuColor,
        border: self.style.contextMenuBorder,
        padding: self.style.contextMenuPadding,
        borderRadius: self.style.contextMenuBorderRadius,
        opacity: self.style.contextMenuOpacity,
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      },
      'canvas-datagrid-context-menu': {
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontFamily: self.style.contextMenuFontFamily,
        fontSize: self.style.contextMenuFontSize,
        background: self.style.contextMenuBackground,
        color: self.style.contextMenuColor,
        border: self.style.contextMenuBorder,
        padding: self.style.contextMenuPadding,
        borderRadius: self.style.contextMenuBorderRadius,
        opacity: self.style.contextMenuOpacity,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        cursor: self.style.contextMenuCursor
      },
      'canvas-datagrid-invalid-search-regExp': {
        background: self.style.contextMenuFilterInvalidExpresion
      }
    };

    if (css[className]) {
      Object.keys(css[className]).map(function (prop) {
        el.style[prop] = css[className][prop];
      });
    }

    return;
  };

  self.appendTo = function (e) {
    self.parentNode = e;
    self.setDom();
  };

  self.setDom = function () {
    if (self.isChildGrid) {
      self.parentGrid = self.parentNode.parentGrid;
      self.ctx = self.parentGrid.context;
      self.canvas = self.parentGrid.canvas;
      self.controlInput = self.parentGrid.controlInput;
      self.eventParent = self.canvas;
    } else {
      self.controlInput = self.controlInput || document.createElement('input');
      self.controlInput.onblur = self.intf.blur;
      self.createInlineStyle(self.controlInput, 'canvas-datagrid-control-input');
      self.isChildGrid = false;
      self.parentDOMNode = self.parentNode;
      self.parentIsCanvas = /^canvas$/i.test(self.parentDOMNode.tagName);

      if (self.parentIsCanvas) {
        self.canvas = self.parentDOMNode;
      } else {
        self.canvas = document.createElement('canvas');
        self.parentDOMNode.appendChild(self.canvas);
      }

      document.body.appendChild(self.controlInput);
      self.createInlineStyle(self.canvas, 'canvas-datagrid');
      self.ctx = self.canvas.getContext('2d');
      self.ctx.textBaseline = 'alphabetic';
      self.eventParent = self.canvas;
    }

    self.parentNodeStyle = self.canvas.style;
    self.controlInput.setAttribute('readonly', true);
    self.controlInput.addEventListener('blur', function (e) {
      if (e.target !== self.canvas) {
        self.hasFocus = false;
      }
    });
    self.eventParent.addEventListener('scroll', self.resize, false);
    self.eventParent.addEventListener('touchstart', self.touchstart, false);
    self.eventParent.addEventListener('mousedown', self.mousedown, false);
    self.eventParent.addEventListener('dblclick', self.dblclick, false);
    self.eventParent.addEventListener('click', self.click, false);
    window.addEventListener('mouseup', self.mouseup, false);
    window.addEventListener('mousemove', self.mousemove);
    self[self.isChildGrid ? 'parentGrid' : 'eventParent'].addEventListener('wheel', self.scrollWheel, false);
    self.canvas.addEventListener('contextmenu', self.contextmenuEvent, false);
    self.controlInput.addEventListener('copy', self.copy);
    self.controlInput.addEventListener('cut', self.cut);
    self.controlInput.addEventListener('paste', self.paste);
    self.controlInput.addEventListener('keypress', self.keypress, false);
    self.controlInput.addEventListener('keyup', self.keyup, false);
    self.controlInput.addEventListener('keydown', self.keydown, false);
    window.addEventListener('resize', self.resize);
  };
}

/***/ }),

/***/ "./lib/draw.js":
/*!*********************!*\
  !*** ./lib/draw.js ***!
  \*********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/*jslint browser: true, unparam: true, todo: true*/

/*globals XMLSerializer: false, define: true, Blob: false, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(self) {
  var perfCounters = [],
      cachedImagesDrawn = false,
      drawCount = 0,
      perfWindowSize = 300,
      entityCount = [],
      hiddenFrozenColumnCount = 0,
      scrollDebugCounters = [],
      touchPPSCounters = [];
  self.htmlImageCache = {}; // more heavyweight version than fillArray defined in intf.js

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
        cacheKey = v.toString() + cell.rowIndex.toString() + cell.columnIndex.toString(),
        x = Math.round(cell.x + self.canvasOffsetLeft),
        y = Math.round(cell.y + self.canvasOffsetTop);

    if (self.htmlImageCache[cacheKey]) {
      img = self.htmlImageCache[cacheKey].img;

      if (self.htmlImageCache[cacheKey].height !== cell.height || self.htmlImageCache[cacheKey].width !== cell.width) {
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
      img: img,
      width: cell.width,
      height: cell.height
    };

    img.onload = function () {
      self.ctx.drawImage(img, x, y);
      drawOnAllImagesLoaded();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="' + cell.width + '" height="' + cell.height + '">\n' + '<foreignObject class="node" x="0" y="0" width="100%" height="100%">\n' + '<body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0;">\n' + v + '\n' + '</body>' + '</foreignObject>\n' + '</svg>\n');
  }
  /**
   * @param {number[]} coords [x0,y0, x1,y1, x2,y2, ...]
   * @param {boolean} [fill] fill the area that construct by these lines but not stroke
   */


  function drawLines(coords, fill) {
    if (coords.length < 4) return;
    self.ctx.beginPath();
    self.ctx.moveTo(coords[0] + self.canvasOffsetLeft, coords[1] + self.canvasOffsetTop);

    for (var i = 2; i < coords.length; i += 2) {
      var x = coords[i] + self.canvasOffsetLeft;
      var y = coords[i + 1] + self.canvasOffsetTop;
      self.ctx.lineTo(x, y);
    }

    if (fill) self.ctx.fill();else self.ctx.stroke();
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
    var cx = x + width * 0.5;
    var cy = y + width * 0.5;
    drawLines([x + width * 0.2, cy, x + width * 0.78, cy]);
    if (collapsed) drawLines([cx, y + width * 0.22, cx, y + width * 0.8]);
  }
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} size
   * @param {string} dir Direction of the triangle, one of the 't','b','l' and 'r'
   * @param {boolean} [active]
   */


  function drawUnhideIndicator(x, y, size, dir, active) {
    var minPadding = size * 0.2;
    var maxPadding = size * 0.3;
    /** The long edge width of the triangle */

    var longEdge = size - 2 * minPadding;
    /** The median width of the triangle */

    var median = size - 2 * maxPadding;
    var halfLongEdge = longEdge * 0.5;
    var x0, y0;
    var coords, borderCoords;

    switch (dir) {
      case 'r':
        x0 = x + maxPadding;
        y0 = y + minPadding;
        borderCoords = [x, y, x + size, y, x + size, y + size, x, y + size];
        coords = [x0, y0, x0, y0 + longEdge, x0 + median, y0 + halfLongEdge];
        break;

      case 'l':
        x0 = x + size - maxPadding;
        y0 = y + minPadding;
        borderCoords = [x + size, y, x, y, x, y + size, x + size, y + size];
        coords = [x0, y0, x0, y0 + longEdge, x0 - median, y0 + halfLongEdge];
        break;

      case 't':
        x0 = x + minPadding;
        y0 = y + size - maxPadding;
        borderCoords = [x, y + size, x, y, x + size, y, x + size, y + size];
        coords = [x0, y0, x0 + longEdge, y0, x0 + halfLongEdge, y0 - median];
        break;

      case 'b':
        x0 = x + minPadding;
        y0 = y + maxPadding;
        borderCoords = [x, y, x, y + size, x + size, y + size, x + size, y];
        coords = [x0, y0, x0 + longEdge, y0, x0 + halfLongEdge, y0 + median];
        break;
    }

    if (active) {
      self.ctx.strokeStyle = self.style.unhideIndicatorBorderColor;
      self.ctx.lineWidth = 2;
      drawLines(borderCoords);
      self.ctx.fillStyle = self.style.unhideIndicatorBackgroundColor;
      var offset = dir === 'r' || dir === 'b' ? 1 : 0;
      if (dir === 'l' || dir === 'r') fillRect(x - offset, y, size + offset, size);else fillRect(x, y - offset, size, size + offset);
    }

    self.ctx.fillStyle = self.style.unhideIndicatorColor;
    drawLines(coords, true);
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

  function drawCellTreeIcon(cell, tree, rowTree) {
    var parentCount = rowTree ? tree.parentCount : 0;
    var iconSize = self.style.cellTreeIconWidth * self.scale,
        marginTop = self.style.cellTreeIconMarginTop * self.scale,
        marginRight = self.style.cellTreeIconMarginRight * self.scale,
        marginLeft = self.style.cellTreeIconMarginLeft * self.scale + parentCount * (iconSize + cell.paddingLeft);
    var x = cell.x + cell.paddingLeft + self.canvasOffsetLeft + marginLeft,
        y = cell.y + self.canvasOffsetTop + marginTop;

    if (tree.icon) {
      self.ctx.beginPath();
      var oldFillStyle = self.ctx.fillStyle;
      var oldStrokeStyle = self.ctx.strokeStyle;

      if (cell.hovered && self.hovers.onCellTreeIcon) {
        self.ctx.fillStyle = self.style.cellTreeIconHoverFillColor;
      } else {
        self.ctx.fillStyle = self.style.cellTreeIconFillColor;
      }

      self.ctx.fillRect(x, y, iconSize, iconSize);
      self.ctx.strokeStyle = self.style.cellTreeIconBorderColor;
      self.ctx.rect(x, y, iconSize, iconSize);
      self.ctx.stroke();
      self.ctx.beginPath();

      if (tree.expand) {
        self.ctx.moveTo(x + 3, y + iconSize * 0.5);
        self.ctx.lineTo(x + iconSize - 3, y + iconSize * 0.5);
      } else {
        self.ctx.moveTo(x + 2, y + iconSize * 0.5);
        self.ctx.lineTo(x + iconSize - 2, y + iconSize * 0.5);
        self.ctx.moveTo(x + iconSize * 0.5, y + 2);
        self.ctx.lineTo(x + iconSize * 0.5, y + iconSize - 2);
      }

      self.ctx.lineWidth = self.style.cellTreeIconLineWidth;
      self.ctx.strokeStyle = self.style.cellTreeIconLineColor;
      self.ctx.stroke();
      self.ctx.strokeStyle = oldStrokeStyle;
      self.ctx.fillStyle = oldFillStyle;
    }

    return marginLeft + iconSize + marginRight;
  }

  function drawFilterButtonArrow(x, y) {
    var mt = (self.style.filterButtonHeight - self.style.filterButtonArrowHeight) / 2 * self.scale,
        ml = (self.style.filterButtonWidth - self.style.filterButtonArrowWidth) / 2 * self.scale,
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
      tr: function tr() {
        fillHandle(c.x + c.width, c.y, hw);
        strokeHandle(c.x + c.width, c.y, hw);
      },
      br: function br() {
        fillHandle(c.x + c.width, c.y + c.height, hw);
        strokeHandle(c.x + c.width, c.y + c.height, hw);
      },
      tl: function tl() {
        fillHandle(c.x, c.y, hw);
        strokeHandle(c.x, c.y, hw);
      },
      bl: function bl() {
        fillHandle(c.x, c.y + c.height, hw);
        strokeHandle(c.x, c.y + c.height, hw);
      }
    };
    p[pos]();
  }

  function addBorderLine(c, pos) {
    self.ctx.beginPath();
    var p = {
      t: function t() {
        self.ctx.moveTo(c.x + self.canvasOffsetLeft, c.y + self.canvasOffsetTop);
        self.ctx.lineTo(c.x + self.canvasOffsetLeft + c.width, c.y + self.canvasOffsetTop);
      },
      r: function r() {
        self.ctx.moveTo(c.x + self.canvasOffsetLeft + c.width, c.y + self.canvasOffsetTop);
        self.ctx.lineTo(c.x + self.canvasOffsetLeft + c.width, c.y + self.canvasOffsetTop + c.height);
      },
      b: function b() {
        self.ctx.moveTo(c.x + self.canvasOffsetLeft, c.y + self.canvasOffsetTop + c.height);
        self.ctx.lineTo(c.x + self.canvasOffsetLeft + c.width, c.y + self.canvasOffsetTop + c.height);
      },
      l: function l() {
        self.ctx.moveTo(c.x + self.canvasOffsetLeft, c.y + self.canvasOffsetTop);
        self.ctx.lineTo(c.x + self.canvasOffsetLeft, c.y + self.canvasOffsetTop + c.height);
      }
    };
    p[pos]();
    self.ctx.stroke();
  }

  function addEllipsis(text, width) {
    var c,
        w = 0;

    if (self.ellipsisCache[text] && self.ellipsisCache[text][width]) {
      return self.ellipsisCache[text][width];
    } //TODO Add ellipsis back when there is a fast way to do it


    w = self.ctx.measureText(text).width;
    self.ellipsisCache[text] = self.ellipsisCache[text] || {};
    c = {
      value: text,
      width: w
    };
    self.ellipsisCache[text][width] = c;
    return c;
  }

  function wrapText(cell, splitChar) {
    if (!cell.formattedValue) {
      return {
        lines: [{
          width: 0,
          value: ''
        }],
        width: 0,
        height: cell.calculatedLineHeight
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
      value: ''
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
      } // if there is a hyphenated word that is too long
      // split it and add the split set to the array
      // then back up and re-read new split set
      // this behavior seems right, it might not be


      if (/\w-\w/.test(word) && cell.paddedWidth < measure.width) {
        var arr = word.split('-');
        arr = arr.map(function (item, index) {
          return index === arr.length - 1 ? item : item + '-';
        });
        words.splice.apply(words, [x, 1].concat(_toConsumableArray(arr)));
        x -= 1;
        continue;
      }

      line = {
        width: measure.width,
        value: word + curSplitChar
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
            clippedVal = originText.substr(0, stepLength * direction + clippedVal.length);
            plWidth = self.ctx.measureText(clippedVal + et).width;
            direction = plWidth > cell.paddedWidth ? -1 : 1;
            stepLength = parseInt(stepLength / 2);
          }
        }

        clippedVal = clippedVal + (originText.length != clippedVal.length ? et : '');
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
      height: cell.calculatedLineHeight * lines.length
    };
  }

  function drawText(cell) {
    var treeCellPadding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var ll = cell.text.lines.length,
        h = cell.fontHeight * cell.lineHeight,
        x,
        line,
        wrap = self.style.cellWhiteSpace !== 'nowrap',
        textHeight = 0;

    for (x = 0; x < cell.text.lines.length; x += 1) {
      line = cell.text.lines[x];
      var vPos = Math.max((cell.height - (wrap ? cell.text.height : cell.calculatedLineHeight)) * 0.5, 0) + h,
          hPos = cell.paddingLeft + treeCellPadding + cell.treeArrowWidth + cell.orderByArrowWidth;

      if (cell.horizontalAlignment === 'right') {
        hPos = cell.paddingLeft + treeCellPadding + cell.paddedWidth - line.width;
      } else if (cell.horizontalAlignment === 'center') {
        hPos = cell.paddingLeft + treeCellPadding + (cell.paddedWidth + cell.paddingRight) / 2 - line.width / 2;
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
        fillText(JSON.stringify({
          x: cell.x,
          y: cell.y,
          h: cell.height,
          w: cell.width,
          pw: cell.paddedWidth,
          idx: cell.columnIndex,
          idx_ord: cell.sortColumnIndex
        }, null, '\t'), cell.x + 14, cell.y + 14);
        fillText(JSON.stringify(cell.text.lines.map(function (l) {
          return {
            w: l.width,
            v: l.value.length
          };
        }), null, '\t'), cell.x + 14, cell.y + 30);
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
        var isCollapsed = collapsedGroups.findIndex(function (group) {
          return x >= group.from && x <= group.to;
        }) >= 0;

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
    } // initial values


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
        cellHeight = self.style.cellHeight,
        currentRowIndexOffset = 0,

    /** @type {Array<{from:number,plus:number}>} */
    rowIndexOffsetByHiddenRows = self.hiddenRowRanges.map(function (range) {
      return {
        from: range[0],
        plus: range[1] - range[0] + 1
      };
    }).sort(function (a, b) {
      return a.from - b.from;
    });
    drawCount += 1;
    p = performance.now();
    self.visibleRowHeights = []; // if data length has changed, there is no way to know

    if (viewData.length > self.orders.rows.length) {
      self.createRowOrders();
    }

    function saveRowGroupsRectInfo(cell) {
      var index = cell.boundRowIndex;
      if (index >= -1 === false) if (cell.rowIndex === -1) index = -1;else return;
      if (rowGroupsRectInfo[index]) return;
      rowGroupsRectInfo[index] = {
        y: cell.y,
        h: cell.height
      };
    }

    function saveColumnGroupsRectInfo(cell) {
      var index = cell.columnIndex;
      if (columnGroupsRectInfo[index]) return;
      columnGroupsRectInfo[index] = {
        x: cell.x,
        w: cell.width
      };
    }
    /**
     * @param {number} columnIndex
     * @returns {boolean}
     */


    function isColumnCollapsedByGroup(columnIndex) {
      return collapsedColumnGroups.findIndex(function (group) {
        return columnIndex >= group.from && columnIndex <= group.to;
      }) >= 0;
    }

    function drawScrollBars() {
      var drawCorner,
          en = self.scrollBox.entities,
          m = self.style.scrollBarBoxMargin * 2;
      self.ctx.strokeStyle = self.style.scrollBarBorderColor;
      self.ctx.lineWidth = self.style.scrollBarBorderWidth;

      if (self.frozenColumn > 0) {
        en.horizontalBox.x = rowHeaderCellWidth + self.style.scrollBarBoxMargin + self.scrollCache.x[self.frozenColumn - 1] + (en.horizontalBar.width - self.scrollCache.x[self.frozenColumn - 1] - self.scrollBox.scrollBoxWidth) * (self.scrollBox.scrollLeft / self.scrollBox.scrollWidth);
      } else {
        en.horizontalBox.x = rowHeaderCellWidth + self.style.scrollBarBoxMargin + (en.horizontalBar.width - self.scrollBox.scrollBoxWidth) * (self.scrollBox.scrollLeft / self.scrollBox.scrollWidth);
      }

      en.verticalBox.y = columnHeaderCellHeight + self.style.scrollBarBoxMargin + self.scrollCache.y[self.frozenRow] + (en.verticalBar.height - self.scrollBox.scrollBoxHeight - self.scrollCache.y[self.frozenRow]) * (self.scrollBox.scrollTop / self.scrollBox.scrollHeight);

      if (self.scrollBox.horizontalBarVisible) {
        self.ctx.fillStyle = self.style.scrollBarBackgroundColor;
        fillRect(en.horizontalBar.x, en.horizontalBar.y, en.horizontalBar.width + m, en.horizontalBar.height);
        strokeRect(en.horizontalBar.x, en.horizontalBar.y, en.horizontalBar.width + m, en.horizontalBar.height);
        self.ctx.fillStyle = self.style.scrollBarBoxColor;

        if (self.scrollBox.horizontalBoxVisible) {
          if (/horizontal/.test(u.context)) {
            self.ctx.fillStyle = self.style.scrollBarActiveColor;
          }

          radiusRect(en.horizontalBox.x, en.horizontalBox.y, en.horizontalBox.width, en.horizontalBox.height, self.style.scrollBarBoxBorderRadius);
          self.ctx.stroke();
          self.ctx.fill();
        }

        drawCorner = true;
        self.visibleCells.unshift(en.horizontalBar);
        self.visibleCells.unshift(en.horizontalBox);
      }

      if (self.scrollBox.verticalBarVisible) {
        self.ctx.fillStyle = self.style.scrollBarBackgroundColor;
        fillRect(en.verticalBar.x, en.verticalBar.y, en.verticalBar.width, en.verticalBar.height + m);
        strokeRect(en.verticalBar.x, en.verticalBar.y, en.verticalBar.width, en.verticalBar.height + m);

        if (self.scrollBox.verticalBoxVisible) {
          self.ctx.fillStyle = self.style.scrollBarBoxColor;

          if (/vertical/.test(u.context)) {
            self.ctx.fillStyle = self.style.scrollBarActiveColor;
          }

          radiusRect(en.verticalBox.x, en.verticalBox.y, en.verticalBox.width, en.verticalBox.height, self.style.scrollBarBoxBorderRadius);
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
        radiusRect(en.corner.x, en.corner.y, en.corner.width, en.corner.height, 0);
        self.ctx.stroke();
        self.ctx.fill();
        self.visibleCells.unshift(en.corner);
      }
    }

    function createHandlesOverlayArray(cell) {
      if (self.attributes.allowMovingSelection || self.mobile) {
        if (cell.selectionBorderTop && cell.selectionBorderRight && self.mobile) {
          selectionHandles.push([cell, 'tr']);
          cell.selectionHandle = 'tr';
        }

        if (cell.selectionBorderTop && cell.selectionBorderLeft) {
          if (self.mobile) {
            selectionHandles.push([cell, 'tl']);
            cell.selectionHandle = 'tl';
          }

          if (self.fillOverlay.handle) {
            self.fillOverlay.snapTo = {
              x: cell.x,
              y: cell.y
            };
          }
        }

        if (cell.selectionBorderBottom && cell.selectionBorderLeft && self.mobile) {
          selectionHandles.push([cell, 'bl']);
          cell.selectionHandle = 'bl';
        }

        if (cell.selectionBorderBottom && cell.selectionBorderRight && (self.attributes.selectionHandleBehavior !== 'none' || self.mobile)) {
          selectionHandles.push([cell, 'br']);
          cell.selectionHandle = 'br';

          if (self.fillOverlay.handle) {
            self.fillOverlay.handle.x = cell.x + cell.width;
            self.fillOverlay.handle.y = cell.y + cell.height;
          }
        }

        if (self.fillOverlay.handle) {
          // Some corners may not be displaying, so we get at least
          // one correct axis in order to display a fill overlay.
          if (self.fillOverlay.snapTo.x === -1 && cell.selectionBorderLeft) {
            self.fillOverlay.snapTo.x = cell.x;
          }

          if (self.fillOverlay.snapTo.y === -1 && cell.selectionBorderTop) {
            self.fillOverlay.snapTo.y = cell.y;
          }
        }
      }
    }

    function createBorderOverlayArray(cell, drawArray, propPrefix, offsetPoint) {
      offsetPoint = offsetPoint || {
        x: 0,
        y: 0
      };
      cell.selectionBorder = '';

      if (!cell.isRowHeader && self.selections[cell.rowIndex + -offsetPoint.y] && self.selections[cell.rowIndex + -offsetPoint.y].indexOf(cell.columnIndex + -offsetPoint.x) !== -1) {
        if ((!self.selections[cell.rowIndex - 1 + -offsetPoint.y] || self.selections[cell.rowIndex - 1 + -offsetPoint.y].indexOf(cell.columnIndex + -offsetPoint.x) === -1 || cell.rowIndex === 0) && !cell.isHeader) {
          drawArray.push([cell, 't']);
          cell[propPrefix + 'BorderTop'] = true;
          cell[propPrefix + 'Border'] += 't';
        }

        if (!self.selections[cell.rowIndex + 1 + -offsetPoint.y] || self.selections[cell.rowIndex + 1 + -offsetPoint.y].indexOf(cell.columnIndex + -offsetPoint.x) === -1) {
          drawArray.push([cell, 'b']);
          cell[propPrefix + 'BorderBottom'] = true;
          cell[propPrefix + 'Border'] += 'b';
        }

        if (!self.selections[cell.rowIndex + -offsetPoint.y] || cell.columnIndex === 0 || self.selections[cell.rowIndex + -offsetPoint.y].indexOf(cell.columnIndex - 1 + -offsetPoint.x) === -1) {
          drawArray.push([cell, 'l']);
          cell[propPrefix + 'BorderLeft'] = true;
          cell[propPrefix + 'Border'] += 'l';
        }

        if (!self.selections[cell.rowIndex + -offsetPoint.y] || cell.columnIndex === schema.length || self.selections[cell.rowIndex + -offsetPoint.y].indexOf(cell.columnIndex + 1 + -offsetPoint.x) === -1) {
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
            isFilterable = self.filterable.rows.includes(rowIndex) && self.filterable.columns.includes(headerIndex),
            wrap = self.style.cellWhiteSpace !== 'nowrap',
            selected = self.selections[rowOrderIndex] && self.selections[rowOrderIndex].indexOf(columnOrderIndex) !== -1,
            hovered = self.hovers.rowIndex === rowOrderIndex && (self.attributes.hoverMode === 'row' || self.hovers.columnIndex === columnOrderIndex),
            openedFilter = self.selectedFilterButton.rowIndex == rowIndex && self.selectedFilterButton.columnIndex == headerIndex,
            active = self.activeCell.rowIndex === rowOrderIndex && self.activeCell.columnIndex === columnOrderIndex,
            isColumnHeaderCellCap = cellStyle === 'columnHeaderCellCap',
            rawValue = rowData ? rowData[header.name] : undefined,
            isGrid = header.type === 'canvas-datagrid',
            activeHeader = (self.orders.rows[self.activeCell.rowIndex] === rowOrderIndex || self.selectedRows.indexOf(rowOrderIndex) >= 0 || self.orders.columns[self.activeCell.columnIndex] === headerIndex || self.selectedColumns.indexOf(headerIndex) >= 0) && (columnOrderIndex === -1 || rowOrderIndex === -1) ? isRowHeader ? 'activeRowHeaderCell' : 'activeColumnHeaderCell' : false,
            val,
            f = self.formatters[header.type || 'string'],
            orderByArrowSize = 0,
            treeArrowSize = 0,
            cellWidth = self.sizes.columns[headerIndex] || header.width,
            ev = {
          value: rawValue,
          row: rowData,
          header: header
        };

        if (isColumnHeaderCellCap) {
          cellWidth = w - x;
        } // if no data or schema are defined, a width is provided to the stub column


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
          paddingLeft: (self.style[cellStyle + 'PaddingLeft'] || 0) * self.scale,
          paddingTop: (self.style[cellStyle + 'PaddingTop'] || 0) * self.scale,
          paddingRight: (self.style[cellStyle + 'PaddingRight'] || 0) * self.scale,
          paddingBottom: (self.style[cellStyle + 'PaddingBottom'] || 0) * self.scale,
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
          boundColumnIndex: self.getBoundColumnIndexFromViewColumnIndex(columnOrderIndex),
          sortColumnIndex: headerIndex,
          sortRowIndex: rowIndex,
          isGrid: isGrid,
          isNormal: !isGrid && !isCorner && !isHeader,
          gridId: (self.attributes.name || '') + rowIndex + ':' + headerIndex,
          parentGrid: self.intf,
          innerHTML: '',
          activeHeader: activeHeader,
          value: isHeader && !isRowHeader ? header.title || header.name : rawValue,
          isRowTree: rowOrderIndex >= 0 && columnOrderIndex == self.cellTree.rowTreeColIndex && self.cellTree.rows.length > 0 && self.cellTree.rows[rowOrderIndex].icon,
          isColumnTree: columnOrderIndex >= 0 && self.cellTree.columns[rowOrderIndex] && self.cellTree.columns[rowOrderIndex][columnOrderIndex].icon
        };
        cell.calculatedLineHeight = cell.fontHeight * cell.lineHeight + cell.lineSpacing;
        cell.paddedWidth = cell.width - cell.paddingRight - cell.paddingLeft;
        cell.paddedHeight = cell.height - cell.paddingTop - cell.paddingBottom;
        ev.cell = cell;
        cell.userHeight = cell.isHeader ? self.sizes.rows[-1] : rowHeight;
        cell.userWidth = cell.isHeader ? self.sizes.columns.cornerCell : self.sizes.columns[headerIndex];
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
          self.ctx.fillStyle = self.style[cellStyle + 'SelectedBackgroundColor'];
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

          cell.width = self.sizes.columns[headerIndex] || self.style.cellWidthWithChildGrid;
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
            treeArrowSize = drawTreeArrow(cell, self.style[cellStyle + 'PaddingLeft'], cy, 0);
          }
        }

        if (self.attributes.showRowNumbers && isRowHeader || !isRowHeader) {
          if (cell.isGrid && !self.dispatchEvent('beforerendercellgrid', ev)) {
            if (!self.childGrids[cell.gridId]) {
              // HACK: this only allows setting of the child grids styles if data is set _after_
              // this is less than desirable.  An interface needs to be made to effect the
              // style of all cell grids.  One for individual grids already exists.
              cellGridAttributes = self.cellGridAttributes;
              cellGridAttributes.name = self.attributes.saveAppearance ? cell.gridId : undefined;
              cellGridAttributes.component = false;
              cellGridAttributes.parentNode = cell;
              cellGridAttributes.data = rawValue;
              ev.cellGridAttributes = cellGridAttributes;

              if (self.dispatchEvent('beforecreatecellgrid', ev)) {
                return;
              }

              self.childGrids[cell.gridId] = self.createGrid(cellGridAttributes);
              self.sizes.rows[rowIndex] = self.sizes.rows[rowIndex] || self.style.cellGridHeight;
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
                orderByArrowSize = drawOrderByArrow(cx + self.style[cellStyle + 'PaddingLeft'], 0);
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
            cell.orderByArrowWidth = orderByArrowSize; // create text ref to see if height needs to expand

            val = val !== undefined ? val : f ? f(ev) : '';

            if (val === undefined && !f) {
              val = '';
              console.warn('canvas-datagrid: Unknown format ' + header.type + ' add a cellFormater');
            }

            cell.formattedValue = (val !== undefined && val !== null ? val : '').toString();

            if (self.columnFilters && self.columnFilters[val] !== undefined && isHeader) {
              cell.formattedValue = self.attributes.filterTextPrefix + val;
            }

            self.ctx.font = self.style[cellStyle + 'FontHeight'] * self.scale + 'px ' + self.style[cellStyle + 'FontName'];

            if (!self.dispatchEvent('formattext', ev)) {
              cell.text = wrapText(cell, ' ');
            }

            if (!self.dispatchEvent('rendertext', ev)) {
              if (cell.innerHTML || header.type === 'html') {
                drawHtml(cell);
              } else {
                var treeCellPadding = 0,
                    isDrawText = true;
                if (cell.columnIndex == self.cellTree.rowTreeColIndex && !cell.isColumnHeader && self.cellTree.rows.length > 0 && Object.keys(self.cellTree.rows[cell.rowIndex]).length > 1) treeCellPadding = drawCellTreeIcon(cell, self.cellTree.rows[cell.rowIndex], true);

                if (!cell.isRowHeader && cell.rowIndex > 0 && self.cellTree.columns[cell.rowIndex - 1] && self.cellTree.columns[cell.rowIndex - 1][cell.columnIndex].icon) {
                  for (var r = cell.rowIndex - 1; r >= 0; r--) {
                    if (!self.cellTree.columns[r]) break;
                    if (!self.cellTree.columns[r][cell.columnIndex].icon) break;

                    if (!self.cellTree.columns[r][cell.columnIndex].expand) {
                      isDrawText = false;
                      break;
                    }
                  }
                }

                if (isDrawText && !cell.isRowHeader && self.cellTree.columns[cell.rowIndex] && self.cellTree.columns[cell.rowIndex][cell.columnIndex].icon) {
                  if (self.viewData.length > 0 && self.viewData[cell.rowIndex][cell.columnIndex].length > 0) treeCellPadding = drawCellTreeIcon(cell, self.cellTree.columns[cell.rowIndex][cell.columnIndex], false);
                }

                if (isDrawText) drawText(cell, treeCellPadding);
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

        createBorderOverlayArray(cell, selectionBorders, 'selection'); // createBorderOverlayArray calculates data for createHandlesOverlayArray so it must go 2nd

        createHandlesOverlayArray(cell);

        if (self.movingSelection) {
          createBorderOverlayArray(cell, moveBorders, 'move', self.moveOffset);
        }

        self.ctx.restore();

        if (isFilterable) {
          drawFilterButton(cell);
        } // Gaps may occur in row numbers between consecutively rendered rows
        // when we are filtering. We draw attention to this by drawing a thick
        // border overlapping the two consecutive row headers. If sorting, visible
        // row numbers stay the same (i.e. they don't correspond to the underlying
        // data's row number), so we do not show row gaps in that case.


        var isSorting = self.orderings.columns && self.orderings.columns.length > 0;

        if (isRowHeader && self.attributes.showRowNumbers && self.attributes.showRowNumberGaps && isSorting === false) {
          var previousRowNumber = self.getBoundRowIndexFromViewRowIndex(rowOrderIndex - 1);
          var hasRowGap = previousRowNumber !== undefined && cell.boundRowIndex > 0 && cell.boundRowIndex - previousRowNumber > 1;

          if (hasRowGap && collapsedRowGroups.length > 0) {
            hasRowGap = collapsedRowGroups.find(function (group) {
              return group.from === previousRowNumber && group.to === cell.boundRowIndex;
            }) >= 0;
          } // We don't treat the row index difference from hidden rows as the row gap.


          if (hasRowGap && self.hiddenRowRanges.length > 0) {
            for (var i = 0; i < self.hiddenRowRanges.length; i++) {
              var _self$hiddenRowRanges = _slicedToArray(self.hiddenRowRanges[i], 2),
                  beginRowIndex = _self$hiddenRowRanges[0],
                  endRowIndex = _self$hiddenRowRanges[1];

              if (cell.boundRowIndex === endRowIndex + 1 && previousRowNumber === beginRowIndex - 1) {
                hasRowGap = false;
                break;
              }
            }
          }

          if (hasRowGap) {
            var barHeight = self.style.rowHeaderCellRowNumberGapHeight;
            var barColor = self.style.rowHeaderCellRowNumberGapColor;
            self.ctx.save();
            self.ctx.fillStyle = barColor;
            fillRect(cell.x, cell.y - barHeight / 2, cell.width, barHeight);
            self.ctx.restore();
          }
        } //#region draw unhide indicator for column headers


        if (isColumnHeader && self.attributes.showUnhideColumnsIndicator) {
          var _hovered = self.hovers.unhideIndicator;
          var size = self.style.unhideIndicatorSize;
          var cellX = x;
          var topY = cell.y + Math.max(0.5 * (cell.height - size), 0);

          var isActive = function isActive(orderIndex) {
            return _hovered && (_hovered.dir === 'l' || _hovered.dir === 'r') && orderIndex >= _hovered.orderIndex0 && orderIndex <= _hovered.orderIndex1;
          };

          var isHiddenColumn = function isHiddenColumn(columnIndex) {
            return columnIndex >= 0 && schema[columnIndex] && schema[columnIndex].hidden;
          };

          var orderIndex0, orderIndex1;

          var drawIndicator = function drawIndicator(leftX, dir, active) {
            self.visibleUnhideIndicators.push({
              x: leftX - 1,
              y: topY - 1,
              x2: leftX + size + 2,
              y2: topY + size + 2,
              orderIndex0: orderIndex0,
              orderIndex1: orderIndex1,
              dir: dir
            });

            if (!active) {
              var line = cell.text && cell.text.lines && cell.text.lines[0];

              if (line) {
                var iconsWidth = orderByArrowSize + treeArrowSize;
                var lineX0 = iconsWidth > 0 ? iconsWidth : line.x;
                var lineX1 = line.x + line.width;
                if (leftX + size >= lineX0 && leftX <= lineX1) return;
              }
            }

            drawUnhideIndicator(leftX, topY, size, dir, active);
          }; // end of drawIndicator


          var orderIndexPtr = columnOrderIndex - 1;
          var prevColumnIndex = self.orders.columns[orderIndexPtr];

          if (isHiddenColumn(prevColumnIndex)) {
            var _active = isActive(prevColumnIndex);

            orderIndex0 = orderIndexPtr;
            orderIndex1 = orderIndexPtr;

            while (--orderIndexPtr >= 0) {
              if (isHiddenColumn(self.orders.columns[orderIndexPtr])) orderIndex0 = orderIndexPtr;else break;
            }

            drawIndicator(cellX, 'r', _active);
          }

          orderIndexPtr = columnOrderIndex + 1;
          var nextColumnIndex = self.orders.columns[orderIndexPtr];

          if (isHiddenColumn(nextColumnIndex)) {
            var _active2 = isActive(nextColumnIndex);

            orderIndex0 = orderIndexPtr;
            orderIndex1 = orderIndexPtr;

            while (++orderIndexPtr < self.orders.columns.length) {
              if (isHiddenColumn(self.orders.columns[orderIndexPtr])) orderIndex1 = orderIndexPtr;else break;
            }

            var indicatorX = x + cell.width - size;
            drawIndicator(indicatorX, 'l', _active2);
          }
        } //#endregion draw unhide indicator for column headers
        //#region draw unhide indicator for row headers


        if (isRowHeader && self.attributes.showUnhideRowsIndicator && self.hiddenRowRanges.length > 0) {
          // Leo's comment:
          // from the first row to the last row, `rowIndex` is from 0 to the count of rows
          // but `boundRowIndex` can be disordered if there are any ordered columns or filtered columns
          // Like this statement:
          // console.log(rowIndex, cell.boundRowIndex, cell.formattedValue);
          // can output the result like this:
          // 0 1 '2'
          // 1 3 '4'
          var _hovered2 = self.hovers.unhideIndicator;
          var _size = self.style.unhideIndicatorSize;
          var leftX = cell.x + cell.width - _size - 2;
          var cellY = y;
          var topIndicators = {};
          var bottomIndicators = {};
          self.hiddenRowRanges.forEach(function (it) {
            topIndicators[it[0] - 1] = it;
            bottomIndicators[it[1] + 1] = it;
          });

          var _rowIndex = cell.rowIndex + currentRowIndexOffset;

          var _isActive = function _isActive() {
            return _hovered2 && (_hovered2.dir === 't' || _hovered2.dir === 'b') && _rowIndex >= _hovered2.orderIndex0 - 1 && _rowIndex <= _hovered2.orderIndex1 + 1;
          };

          var _orderIndex, _orderIndex2;

          var _drawIndicator = function _drawIndicator(topY, dir, active) {
            self.visibleUnhideIndicators.push({
              x: leftX - 1,
              y: topY - 1,
              x2: leftX + _size + 2,
              y2: topY + _size + 2,
              orderIndex0: _orderIndex,
              orderIndex1: _orderIndex2,
              dir: dir
            });
            drawUnhideIndicator(leftX, topY, _size, dir, active);
          }; // end of drawIndicator


          var matched = topIndicators[_rowIndex];

          if (matched) {
            var indicatorY = cellY + cell.height - _size;
            var _matched = matched;

            var _matched2 = _slicedToArray(_matched, 2);

            _orderIndex = _matched2[0];
            _orderIndex2 = _matched2[1];

            _drawIndicator(indicatorY, 't', _isActive());
          }

          matched = bottomIndicators[_rowIndex];

          if (matched) {
            var _indicatorY = cellY;
            var _matched3 = matched;

            var _matched4 = _slicedToArray(_matched3, 2);

            _orderIndex = _matched4[0];
            _orderIndex2 = _matched4[1];

            _drawIndicator(_indicatorY, 'b', _isActive());
          }
        } //#endregion draw unhide indicator for row headers


        x += cell.width + (bc ? 0 : self.style.cellBorderWidth);
        return cell.width;
      }; // end of drawEach
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

      radiusRect(posX, posY, self.style.filterButtonWidth, self.style.filterButtonHeight, self.style.filterButtonBorderRadius);
      self.ctx.stroke();
      self.ctx.fill();
      drawFilterButtonArrow(posX, posY);
      self.ctx.clip();
      self.dispatchEvent('afterrenderfilterbutton', ev);
      self.ctx.restore();
    }

    function drawRowHeader(rowData, rowIndex, rowOrderIndex) {
      if (self.attributes.showRowHeaders) {
        x = 0; // When filtering we'd like to display the actual row numbers,
        // as it is in the unfiltered data, instead of simply the viewed
        // row index + 1. If rowIndex > viewData.length, it's a new row
        // added to the end, and we want to render that new row's number

        var filteredRowNumber;
        if (self.viewData && rowIndex < self.viewData.length) filteredRowNumber = self.getBoundRowIndexFromViewRowIndex(rowIndex) + 1;else filteredRowNumber = self.originalData ? self.originalData.length + 1 : rowOrderIndex + 1;
        var rowHeaderValue = self.hasActiveFilters() || self.hasCollapsedRowGroup() ? filteredRowNumber : rowIndex + 1;
        rowHeaderValue += currentRowIndexOffset;
        var _rowHeaderCell = {
          rowHeaderCell: rowHeaderValue
        };
        var headerDescription = {
          name: 'rowHeaderCell',
          width: self.sizes.columns[-1] || self.style.rowHeaderCellWidth,
          style: 'rowHeaderCell',
          type: 'string',
          data: rowHeaderValue,
          index: -1
        };
        rowOpen = self.openChildren[rowIndex];
        drawCell(_rowHeaderCell, rowOrderIndex, rowIndex)(headerDescription, -1, -1);

        if (rowIndexOffsetByHiddenRows[0] && rowHeaderValue >= rowIndexOffsetByHiddenRows[0].from) {
          var _rowIndexOffsetByHidd = rowIndexOffsetByHiddenRows.shift(),
              plus = _rowIndexOffsetByHidd.plus;

          currentRowIndexOffset += plus;
        }
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
              order: i
            };
            columnHeaderCell = {
              columnHeaderCell: header.title || header.name
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
          radiusRect(0, self.lastFrozenRowPixel, self.width, self.height - self.lastFrozenRowPixel, 0);
          self.ctx.clip();
        }

        drawRowHeader(rArgs[0], rArgs[1], rArgs[2]);
      });
      self.ctx.restore();

      if (self.attributes.showColumnHeaders) {
        x = -self.scrollBox.scrollLeft + self.scrollPixelLeft + self.style.columnHeaderCellBorderWidth;

        if (self.attributes.showRowHeaders) {
          x += rowHeaderCellWidth;
        }

        y = 0; // cell height might have changed during drawing

        cellHeight = self.getColumnHeaderCellHeight();
        drawHeaderColumnRange(self.scrollIndexLeft, g);
        nonFrozenHeaderWidth = x;
        x = self.style.columnHeaderCellBorderWidth;

        if (self.attributes.showRowHeaders) {
          x += rowHeaderCellWidth;
        }

        drawHeaderColumnRange(0, self.frozenColumn); // fill in the space right of the headers

        x = nonFrozenHeaderWidth;

        if (x < w) {
          c = {
            name: '',
            width: self.style.scrollBarWidth,
            style: 'columnHeaderCellCap',
            isColumnHeaderCell: true,
            isColumnHeaderCellCap: true,
            type: 'string',
            index: schema.length
          };
          drawCell({
            endCap: ''
          }, -1, -1)(c, -1, -1);
        } // fill in the space right of the headers


        if (self.attributes.showRowHeaders) {
          cornerCell = {
            cornerCell: ''
          };
          x = 0;
          c = {
            name: 'cornerCell',
            width: self.style.rowHeaderCellWidth,
            style: 'cornerCell',
            type: 'string',
            index: -1
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
      rowSansTreeHeight = (self.sizes.rows[rowOrderIndex] || self.style.cellHeight) * self.scale;
      treeHeight = (rowOpen ? self.sizes.trees[rowOrderIndex] : 0) * self.scale;
      rowHeight = rowSansTreeHeight + treeHeight;

      if (y < -rowHeight) {
        return false;
      }

      if (self.attributes.showRowHeaders) {
        x += rowHeaderCellWidth;
      }

      cellHeight = rowHeight; //draw normal columns

      for (columnOrderIndex = self.scrollIndexLeft; columnOrderIndex < g; columnOrderIndex += 1) {
        if (!isColumnCollapsedByGroup(columnOrderIndex)) {
          headerIndex = self.orders.columns[columnOrderIndex];
          x += drawCell(rowData, rowOrderIndex, rowIndex)(schema[headerIndex], headerIndex, columnOrderIndex);
        }

        if (x > self.width) {
          self.scrollIndexRight = columnOrderIndex;
          self.scrollPixelRight = x;
          break;
        }
      } //draw frozen columns


      x = 1;

      if (self.attributes.showRowHeaders) {
        x += rowHeaderCellWidth;
      }

      for (columnOrderIndex = 0; columnOrderIndex < self.frozenColumn; columnOrderIndex += 1) {
        if (!isColumnCollapsedByGroup(columnOrderIndex)) {
          headerIndex = self.orders.columns[columnOrderIndex];
          x += drawCell(rowData, rowOrderIndex, rowIndex)(schema[headerIndex], headerIndex, columnOrderIndex);
        }

        if (x > self.width) {
          break;
        }
      }

      self.lastFrozenColumnPixel = x; // cell height might have changed during drawing

      cellHeight = rowHeight;
      x = -self.scrollBox.scrollLeft + self.scrollPixelLeft + self.style.cellBorderWidth; // don't draw a tree for the new row

      treeGrid = self.childGrids[rowOrderIndex];

      if (rowOrderIndex !== viewData.length && rowOpen) {
        treeGrid.visible = true;
        treeGrid.parentNode = {
          offsetTop: y + rowSansTreeHeight + self.canvasOffsetTop,
          offsetLeft: rowHeaderCellWidth - 1 + self.canvasOffsetLeft,
          offsetHeight: treeHeight,
          offsetWidth: self.width - rowHeaderCellWidth - self.style.scrollBarWidth - 1,
          offsetParent: self.intf.parentNode,
          parentNode: self.intf.parentNode,
          style: self.style,
          nodeType: 'canvas-datagrid-tree',
          scrollTop: self.scrollBox.scrollTop,
          scrollLeft: self.scrollBox.scrollLeft,
          rowIndex: rowOrderIndex,
          columnGroupsAreaHeight: columnGroupsAreaHeight,
          rowGroupsAreaWidth: rowGroupsAreaWidth
        };

        if (self.intf.parentNode) {
          var _self$intf$parentNode = self.intf.parentNode,
              _columnGroupsAreaHeight = _self$intf$parentNode.columnGroupsAreaHeight,
              _rowGroupsAreaWidth = _self$intf$parentNode.rowGroupsAreaWidth;
          treeGrid.parentNode.columnGroupsAreaHeight += _columnGroupsAreaHeight || 0;
          treeGrid.parentNode.rowGroupsAreaWidth += _rowGroupsAreaWidth || 0;
        }

        self.visibleCells.unshift({
          rowIndex: rowOrderIndex,
          columnIndex: 0,
          y: treeGrid.parentNode.offsetTop,
          x: treeGrid.parentNode.offsetLeft,
          height: treeGrid.height,
          width: treeGrid.width,
          style: 'tree-grid',
          type: treeGrid.parentNode.nodeType
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
      self.visibleUnhideIndicators = [];
      self.canvasOffsetTop = self.isChildGrid ? self.parentNode.offsetTop : 0.5;
      self.canvasOffsetLeft = self.isChildGrid ? self.parentNode.offsetLeft : -0.5;
      h = self.height;
      w = self.width; // patch for first row being hidden

      var firstRowIndexOffset = rowIndexOffsetByHiddenRows[0];

      if (firstRowIndexOffset && firstRowIndexOffset.from === 0) {
        currentRowIndexOffset = firstRowIndexOffset.plus;
        rowIndexOffsetByHiddenRows.shift();
      }
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
      var mx = rowGroupsAreaWidth;
      var my = columnGroupsAreaHeight;
      var frozenColumnsWidth = getFrozenColumnsWidth();
      var frozenRowsHeight = rowGroupsFrozenInfo.y + rowGroupsFrozenInfo.h - columnHeaderCellHeight;
      var onTheLeft = self.attributes.columnGroupIndicatorPosition === 'left';
      var onTheTop = self.attributes.rowGroupIndicatorPosition === 'top';
      /** @type {CanvasRenderingContext2D} */

      var ctx = self.ctx;
      ctx.save();
      ctx.fillStyle = self.style.groupingAreaBackgroundColor;
      fillRect(0, -my, w, my);
      fillRect(-mx, -my, mx, h);
      ctx.restore(); //#region Columns Grouping

      /** it extends `self.groupedRows` */

      var groupedColumns = [];

      for (var row = 0; row < self.groupedColumns.length; row++) {
        var groups = self.groupedColumns[row];

        for (var j = 0; j < groups.length; j++) {
          groupedColumns.push(Object.assign({
            row: row
          }, groups[j]));
        }
      }

      if (groupedColumns.length > 0) {
        (function () {
          var rowHeight = self.style.columnGroupRowHeight;
          var toggleHandleSize = rowHeight * 0.5;
          var toggleHandlePadding = (rowHeight - toggleHandleSize) * 0.5;

          var _loop = function _loop(i) {
            var group = groupedColumns[i];
            var row = group.row,
                collapsed = group.collapsed;
            var topY = -my + row * rowHeight;
            var centerY = topY + rowHeight * 0.5;
            var bottomY = topY + rowHeight - toggleHandlePadding;
            var leftmostX = rowHeaderCellWidth - toggleHandleSize - toggleHandlePadding;

            var drawGroupHandleAtX = function drawGroupHandleAtX(x) {
              return drawGroupHandle(x, topY + toggleHandlePadding, toggleHandleSize, group.collapsed);
            };

            var pushToVisibleGroups = function pushToVisibleGroups(leftX, rightX) {
              return self.visibleGroups.push({
                type: 'c',
                collapsed: collapsed,
                from: group.from,
                to: group.to,
                row: row,
                x: leftX + mx,
                y: topY + my,
                x2: rightX + mx,
                y2: bottomY + my
              });
            }; //#region check the relationship between this group and frozen columns


            var crossTheFrozen = group.from < self.frozenColumn && group.to >= self.frozenColumn;
            var notInFrozen = group.from >= self.frozenColumn; //#endregion

            if (collapsed) {
              var _leftX = leftmostX + toggleHandleSize; // This group is not sticking on the first column


              if (group.from > 0) {
                var colIndex = group.to + 1;
                var col = columnGroupsRectInfo[colIndex];

                if (!col) {
                  colIndex = group.from - 1;
                  col = columnGroupsRectInfo[colIndex];
                  if (!col) return "continue"; // don't draw this group indicator because it is invisible

                  _leftX = col.x + col.w - toggleHandleSize * 0.5;
                } else {
                  _leftX = col.x + toggleHandlePadding;
                }

                if (colIndex >= self.frozenColumn) {
                  var compare = frozenColumnsWidth + rowHeaderCellWidth - toggleHandlePadding; // don't draw this group indicator because it is hidden by frozen columns

                  if (_leftX < compare) return "continue";
                }
              }

              var _rightX = _leftX + toggleHandleSize;

              ctx.save();
              ctx.strokeStyle = self.style.groupIndicatorColor;
              ctx.fillStyle = self.style.groupIndicatorBackgroundColor;
              drawGroupHandleAtX(_leftX);
              ctx.restore();
              pushToVisibleGroups(_leftX, _rightX);
            } // end of collapsed group

            /** @type {number} pointer for loop */


            var ptr = void 0;
            var left = columnGroupsRectInfo[group.from];
            var right = columnGroupsRectInfo[group.to];
            var containsBegining = true;
            var containsEnd = true;
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

            if (!left || !right) return "continue";
            var rightX = right.x + right.w;
            var leftX = left.x;

            if (crossTheFrozen) {
              var rightCompare = columnGroupsRectInfo[self.frozenColumn - 1];

              if (rightCompare) {
                var compareX = rightCompare.x + rightCompare.w;
                if (!onTheLeft) compareX += toggleHandleSize;

                if (compareX >= rightX) {
                  right = rightCompare;
                  rightX = right.x + right.w;
                  containsEnd = false;
                }
              }
            }

            var minLeftX = rowHeaderCellWidth + (notInFrozen ? frozenColumnsWidth : 0);
            if (rightX + (onTheLeft ? 0 : toggleHandleSize) < minLeftX) return "continue";
            rightX -= toggleHandlePadding;
            leftX += toggleHandlePadding;
            ctx.save();
            ctx.strokeStyle = self.style.groupIndicatorColor;
            ctx.fillStyle = self.style.groupIndicatorBackgroundColor;
            var lineCoords = [];

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
              drawGroupHandleAtX(leftX); // add more clickable area into `visibleGroups`

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
              } // add more clickable area into `visibleGroups`


              leftX -= toggleHandlePadding + 1;
              if (containsEnd) rightX += toggleHandleSize;
            }

            drawLines(lineCoords);
            ctx.restore();
            pushToVisibleGroups(leftX, rightX);
          };

          for (var i = 0; i < groupedColumns.length; i++) {
            var _ret = _loop(i);

            if (_ret === "continue") continue;
          }
        })();
      } //#endregion Columns Grouping
      //#region Rows Grouping

      /** it extends `self.groupedRows` */


      var groupedRows = [];

      for (var col = 0; col < self.groupedRows.length; col++) {
        var _groups = self.groupedRows[col];

        for (var _j = 0; _j < _groups.length; _j++) {
          groupedRows.push(Object.assign({
            col: col
          }, _groups[_j]));
        }
      }

      if (groupedRows.length > 0) {
        (function () {
          var colWidth = self.style.rowGroupColumnWidth;
          var toggleHandleSize = colWidth * 0.5;
          var toggleHandlePadding = (colWidth - toggleHandleSize) * 0.5;

          var _loop2 = function _loop2(i) {
            var group = groupedRows[i];
            var col = group.col,
                collapsed = group.collapsed;
            var leftX = -mx + col * colWidth;
            var centerX = leftX + colWidth * 0.5;
            var rightX = leftX + colWidth - toggleHandlePadding;
            var topmostY = columnHeaderCellHeight - toggleHandleSize - toggleHandlePadding;

            var drawGroupHandleAtY = function drawGroupHandleAtY(y) {
              return drawGroupHandle(leftX + toggleHandlePadding, y, toggleHandleSize, group.collapsed);
            };

            var pushToVisibleGroups = function pushToVisibleGroups(topY, bottomY) {
              return self.visibleGroups.push({
                type: 'r',
                collapsed: collapsed,
                from: group.from,
                to: group.to,
                col: col,
                x: leftX + mx,
                y: topY + my,
                x2: rightX + mx,
                y2: bottomY + my
              });
            }; //#region check the relationship between this group and frozen columns


            var crossTheFrozen = group.from < self.frozenRow && group.to >= self.frozenRow;
            var notInFrozen = group.from >= self.frozenRow; //#endregion

            if (collapsed) {
              var _topY = topmostY + toggleHandleSize; // This group is not sticking on the first column


              if (group.from > 0) {
                var _rowIndex2 = group.to + 1;

                var _row = rowGroupsRectInfo[_rowIndex2];

                if (!_row) {
                  _rowIndex2 = group.from - 1;
                  _row = rowGroupsRectInfo[_rowIndex2];
                  if (!_row) return "continue"; // don't draw this group indicator because it is invisible

                  _topY = _row.y + _row.h - toggleHandleSize * 0.5;
                } else {
                  _topY = _row.y;
                }

                if (_rowIndex2 >= self.frozenRow) {
                  var compare = frozenRowsHeight + columnHeaderCellHeight - toggleHandlePadding; // don't draw this group indicator because it is hidden by frozen columns

                  if (_topY < compare) return "continue";
                }
              }

              var _bottomY = _topY + toggleHandleSize;

              ctx.save();
              ctx.strokeStyle = self.style.groupIndicatorColor;
              ctx.fillStyle = self.style.groupIndicatorBackgroundColor;
              drawGroupHandleAtY(_topY);
              ctx.restore();
              pushToVisibleGroups(_topY, _bottomY);
            } // end of collapsed group

            /** @type {number} pointer for loop */


            var ptr = void 0;
            var top = rowGroupsRectInfo[group.from];
            var bottom = rowGroupsRectInfo[group.to];
            var containsBegining = true;
            var containsEnd = true;
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

            if (!top || !bottom) return "continue";
            var bottomY = bottom.y + bottom.h;
            var topY = top.y;

            if (crossTheFrozen) {
              var bottomCompare = rowGroupsRectInfo[self.frozenRow - 1];

              if (bottomCompare) {
                var compareY = bottomCompare.y + bottomCompare.h;
                if (!onTheTop) compareY += toggleHandleSize;

                if (compareY >= bottomY) {
                  bottom = bottomCompare;
                  bottomY = bottom.y + bottom.h;
                  containsEnd = false;
                }
              }
            }

            var minTopY = columnHeaderCellHeight + (notInFrozen ? frozenRowsHeight : 0);
            if (bottomY + (onTheTop ? 0 : toggleHandleSize) < minTopY) return "continue";
            bottomY -= toggleHandlePadding;
            topY += toggleHandlePadding;
            ctx.save();
            ctx.strokeStyle = self.style.groupIndicatorColor;
            ctx.fillStyle = self.style.groupIndicatorBackgroundColor;
            var lineCoords = [];

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
              drawGroupHandleAtY(topY); // add more clickable area into `visibleGroups`

              bottomY += toggleHandlePadding - 1;
            } else {
              // handle on the bottom
              if (topY < minTopY) topY = minTopY;
              if (group.from === 0) topY -= toggleHandlePadding * 2;

              if (containsEnd) {
                if (group.to === self.frozenRow - 1) {
                  bottomY -= toggleHandleSize;
                } else {// bottomY += toggleHandlePadding * 2;
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
                lineCoords.push(centerX, topY, centerX, bottomY); // add more clickable area into `visibleGroups`

                topY -= toggleHandlePadding + 1;
              } // add more clickable area into `visibleGroups`


              if (containsEnd) bottomY += toggleHandleSize;
            }

            drawLines(lineCoords);
            ctx.restore();
            pushToVisibleGroups(topY, bottomY);
          };

          for (var i = 0; i < groupedRows.length; i++) {
            var _ret2 = _loop2(i);

            if (_ret2 === "continue") continue;
          }
        })();
      } //#endregion Rows Grouping

    }

    function drawFrozenRows() {
      var rowOrderIndex,
          ln = Math.min(viewData.length, self.frozenRow);
      x = -self.scrollBox.scrollLeft + self.scrollPixelLeft + self.style.cellBorderWidth;
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
        if (y > columnHeaderCellHeight) y += self.style.frozenMarkerWidth;
        y += self.style.frozenMarkerBorderWidth - 0.4999999999;
      }

      self.lastFrozenRowPixel = y;
    }

    function drawRows() {
      self.ctx.save();

      if (self.frozenRow > 0) {
        radiusRect(0, self.lastFrozenRowPixel, self.width, self.height - self.lastFrozenRowPixel, 0);
        self.ctx.clip();
      }

      var columnOrderIndex,
          rowOrderIndex,
          headerIndex,
          g = schema.length;
      x = -self.scrollBox.scrollLeft + self.scrollPixelLeft + self.style.cellBorderWidth;

      if (!self.attributes.snapToRow) {
        y += -self.scrollBox.scrollTop + self.scrollPixelTop + self.style.cellBorderWidth;
      }

      for (rowIndex = self.frozenRow + self.scrollIndexTop; rowIndex < l; rowIndex += 1) {
        rowOrderIndex = self.orders.rows[rowIndex];
        self.scrollIndexBottom = rowIndex;
        self.scrollPixelBottom = y;
        if (self.cellTree.rows.length > 0 && Object.keys(self.cellTree.rows[rowOrderIndex]).length > 0 && self.cellTree.rows[rowOrderIndex].hide) continue;

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

        for (columnOrderIndex = self.scrollIndexLeft; columnOrderIndex < g; columnOrderIndex += 1) {
          if (!isColumnCollapsedByGroup(columnOrderIndex)) {
            headerIndex = self.orders.columns[columnOrderIndex];
            x += drawCell(self.newRow, viewData.length, viewData.length)(schema[headerIndex], headerIndex, columnOrderIndex);
          }

          if (x > self.width + self.scrollBox.scrollLeft) {
            break;
          }
        }

        rowHeaders.push([self.newRow, viewData.length, viewData.length, y, rowHeight]);
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
        y: self.reorderObject.y + self.reorderObject.dragOffset.y
      },
          m = {
        width: w,
        height: h,
        x: 0,
        y: 0
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

        if (self.selectedRows.indexOf(self.reorderTarget.sortRowIndex) === -1 && self.currentCell.rowIndex !== self.reorderObject.rowIndex && self.currentCell.rowIndex > -1 && self.currentCell.rowIndex < l) {
          addBorderLine(m, self.reorderTarget.sortRowIndex > self.reorderObject.sortRowIndex ? 'b' : 't');
        }
      } else if (self.dragMode === 'column-reorder' && self.reorderObject) {
        var selectedColumns = self.selections[0];

        if (selectedColumns) {
          for (var k = 1; k < selectedColumns.length; k++) {
            b.width += self.getColumnWidth(self.orders.columns[selectedColumns[k]]);
          }
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

        if (self.selectedColumns.indexOf(self.reorderTarget.sortColumnIndex) === -1 && self.currentCell.sortColumnIndex !== self.reorderObject.sortColumnIndex && self.reorderTarget.columnIndex !== self.reorderObject.columnIndex && self.currentCell.sortColumnIndex > -1 && self.currentCell.sortColumnIndex < schema.length) {
          addBorderLine(m, self.reorderTarget.columnIndex > self.reorderObject.columnIndex ? 'r' : 'l');
        }
      }
    }

    function drawBorder() {
      self.ctx.lineWidth = self.style.gridBorderWidth;
      self.ctx.strokeStyle = self.style.gridBorderColor;
      strokeRect(0, 0, self.width, self.height);
    }

    function drawSelectionBorders() {
      function dsb(c) {
        if (!self.fillOverlay.handle) {
          self.ctx.lineWidth = self.style.selectionOverlayBorderWidth;
          self.ctx.strokeStyle = self.style.selectionOverlayBorderColor;
          addBorderLine(c[0], c[1]);
        }
      }

      selectionBorders.filter(function (c) {
        return c[0].rowIndex < self.frozenRow && c[0].columnIndex < self.frozenColumn;
      }).forEach(dsb);
      self.ctx.save();
      clipFrozenArea(0);
      selectionBorders.filter(function (c) {
        return c[0].rowIndex >= self.frozenRow && c[0].columnIndex >= self.frozenColumn;
      }).forEach(dsb);
      self.ctx.restore();
      self.ctx.save();
      clipFrozenArea(1);
      selectionBorders.filter(function (c) {
        return c[0].rowIndex >= self.frozenRow && c[0].columnIndex < self.frozenColumn;
      }).forEach(dsb);
      self.ctx.restore();
      self.ctx.save();
      clipFrozenArea(2);
      selectionBorders.filter(function (c) {
        return c[0].rowIndex < self.frozenRow && c[0].columnIndex >= self.frozenColumn;
      }).forEach(dsb);
      self.ctx.restore();
      drawFillOverlay();
    }

    function drawSelectionHandles() {
      if ((self.mobile || self.attributes.allowMovingSelection) && self.attributes.editable) {
        self.ctx.lineWidth = self.style.selectionHandleBorderWidth;
        self.ctx.strokeStyle = self.style.selectionHandleBorderColor;
        self.ctx.fillStyle = self.style.selectionHandleColor;
        selectionHandles.forEach(function (c) {
          addselectionHandle(c[0], c[1]);
          var az = self.attributes.touchSelectHandleZone / 2,
              ax = c[0].x + (c[1] === 'tl' || c[1] === 'bl' ? 0 : c[0].width) - az,
              ay = c[0].y + (c[1] === 'bl' || c[1] === 'br' ? c[0].height : 0) - az;
          self.visibleCells.unshift({
            x: ax,
            y: ay,
            height: self.style.selectionHandleSize + az,
            width: self.style.selectionHandleSize + az,
            style: 'selection-handle-' + c[1]
          });
        });
      }
    }

    function drawFillOverlay() {
      if (!self.fillOverlay.handle || !self.fillOverlay.snapTo) {
        return;
      }

      self.ctx.save();
      var overlay = self.fillOverlay;
      var handle = overlay.handle;
      var toX = overlay.snapTo.x;
      var toY = overlay.snapTo.y; // The cell that the cursor is moving over. This may be unavailable
      // when the cursor is outside the grid or is pointing to something else.
      //
      // When unavailable, we use the actual position of the cursor to draw
      // the overlay.

      var snap = overlay.snap; // Calculate the X, Y coordinates of the cursor with snap positions and
      // the direction of the movement in mind.
      //
      // When the movement is horizontal, we get the Y coordinate from the handle,
      // and vice-versa.

      var cursorX = overlay.direction === 'x' ? snap ? snap.x + (overlay.x < toX ? 0 : snap.width) : overlay.x : handle.x;
      var cursorY = overlay.direction === undefined || overlay.direction === 'y' ? snap ? snap.y + (overlay.y < toY ? 0 : snap.height) : overlay.y : handle.y; // The final coordinates of the rect. We use 'minX' and 'minY' to avoid
      // drawing on the frozen area.

      var x = Math.max(Math.min(toX, cursorX), overlay.minX);
      var y = Math.max(Math.min(toY, cursorY), overlay.minY); // Width and height of the rect are the difference between the
      // coordinates of both the rect and the cursor. The user may be pointing
      // behind and/or upwards of the rect, so we need to take that into
      // account.

      var width = Math.max(toX, cursorX) - x;
      var height = Math.max(toY, cursorY) - y;
      self.ctx.strokeStyle = self.style.fillOverlayBorderColor;
      self.ctx.lineWidth = self.style.fillOverlayBorderWidth;
      self.ctx.setLineDash([3, 3]);
      strokeRect(x, y, width, height);
      self.ctx.setLineDash([]);
      self.ctx.restore();
    }

    function drawActiveCell() {
      if (!aCell) {
        return;
      }

      self.ctx.save();
      var cl = self.activeCell.columnIndex + 1 > self.frozenColumn || self.activeCell.rowIndex + 1 > self.frozenRow,
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
          strokeRect(1, aCell.y, self.getHeaderWidth() + rowHeaderCellWidth, self.visibleRowHeights[aCell.rowIndex]);
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
          mx = self.lastFrozenColumnPixel - self.style.frozenMarkerWidth,
          xHover = self.currentCell && self.currentCell.style === 'frozen-row-marker',
          yHover = self.currentCell && self.currentCell.style === 'frozen-column-marker';
      var rowHeaderCellWidth = self.getRowHeaderCellWidth();
      self.ctx.lineWidth = self.style.frozenMarkerBorderWidth;

      if (self.attributes.allowFreezingColumns) {
        if (!self.freezeMarkerPosition || self.freezeMarkerPosition && self.dragMode === 'frozen-row-marker') {
          if (mx > self.style.rowHeaderCellWidth) {
            self.ctx.fillStyle = self.style.frozenMarkerColor;
            self.ctx.strokeStyle = self.style.frozenMarkerBorderColor;
            fillRect(mx, 0, self.style.frozenMarkerWidth, self.height);
            strokeRect(mx, 0, self.style.frozenMarkerWidth, self.height);
          }

          self.ctx.fillStyle = yHover ? self.style.frozenMarkerHoverColor : self.style.frozenMarkerHeaderColor;
          self.ctx.strokeStyle = yHover ? self.style.frozenMarkerHoverBorderColor : self.style.frozenMarkerHeaderColor;
          fillRect(mx, 0, self.style.frozenMarkerWidth, self.style.columnHeaderCellHeight);
          strokeRect(mx, 0, self.style.frozenMarkerWidth, self.style.columnHeaderCellHeight);
        }

        if (!self.dragStartObject || self.dragStartObject && self.dragStartObject.style !== 'rowHeaderCell') {
          self.visibleCells.unshift({
            x: mx,
            y: 0,
            height: self.height,
            width: self.style.frozenMarkerWidth,
            // + self.style.frozenMarkerBorderWidth,
            style: 'frozen-column-marker'
          });
        }
      }

      if (self.attributes.allowFreezingRows) {
        if (!self.freezeMarkerPosition || self.freezeMarkerPosition && self.dragMode === 'frozen-column-marker') {
          if (my > rowHeaderCellWidth) {
            self.ctx.fillStyle = self.style.frozenMarkerColor;
            self.ctx.strokeStyle = self.style.frozenMarkerBorderColor;
            fillRect(0, my, self.width, self.style.frozenMarkerWidth);
            strokeRect(0, my, self.width, self.style.frozenMarkerWidth);
          }

          self.ctx.fillStyle = xHover ? self.style.frozenMarkerHoverColor : self.style.frozenMarkerHeaderColor;
          self.ctx.strokeStyle = xHover ? self.style.frozenMarkerHoverBorderColor : self.style.frozenMarkerHeaderColor;
          fillRect(0, my, rowHeaderCellWidth, self.style.frozenMarkerWidth);
          strokeRect(0, my, rowHeaderCellWidth, self.style.frozenMarkerWidth);
        }

        var height = self.style.frozenMarkerWidth + self.style.frozenMarkerBorderWidth;

        if (!self.dragStartObject || self.dragStartObject && self.dragStartObject.style !== 'columnHeaderCell') {
          self.visibleCells.unshift({
            x: 0,
            y: my,
            height: height,
            width: self.width,
            style: 'frozen-row-marker'
          });
        }

        rowGroupsFrozenInfo = {
          y: my,
          h: height
        };
      }

      if (self.freezeMarkerPosition) {
        self.ctx.fillStyle = self.style.frozenMarkerActiveColor;
        self.ctx.strokeStyle = self.style.frozenMarkerActiveBorderColor;

        if (self.dragMode === 'frozen-column-marker') {
          var posX = self.freezeMarkerPosition.x;
          var nearCell = self.getCellAt(posX, 0);
          if (self.freezeMarkerPosition.isGrab) posX = mx;

          if (posX > rowHeaderCellWidth) {
            var _x = nearCell.x - self.style.frozenMarkerWidth - self.style.frozenMarkerBorderWidth;

            if (posX > _x + nearCell.width / 2) _x = _x + nearCell.width;
            self.ctx.fillStyle = self.style.frozenMarkerColor;
            self.ctx.strokeStyle = self.style.frozenMarkerBorderColor;
            fillRect(_x, 0, self.style.frozenMarkerWidth, self.height);
            strokeRect(_x, 0, self.style.frozenMarkerWidth, self.height);
            self.ctx.fillStyle = self.style.frozenMarkerHeaderColor;
            self.ctx.strokeStyle = self.style.frozenMarkerHeaderColor;
            fillRect(_x, 0, self.style.frozenMarkerWidth, self.style.columnHeaderCellHeight);
            strokeRect(_x, 0, self.style.frozenMarkerWidth, self.style.columnHeaderCellHeight);
          }

          self.ctx.fillStyle = self.style.frozenMarkerActiveHeaderColor;
          self.ctx.strokeStyle = self.style.frozenMarkerActiveBorderColor;
          fillRect(posX, 0, self.style.frozenMarkerWidth, self.style.columnHeaderCellHeight);
          strokeRect(posX, 0, self.style.frozenMarkerWidth, self.style.columnHeaderCellHeight);
          self.ctx.fillStyle = self.style.frozenMarkerActiveColor;
          fillRect(posX, 0, self.style.frozenMarkerWidth, self.height);
          strokeRect(posX, 0, self.style.frozenMarkerWidth, self.height);
        } else {
          var posY = self.freezeMarkerPosition.y;

          var _nearCell = self.getCellAt(0, posY);

          if (self.freezeMarkerPosition.isGrab) posY = my;

          if (posY > self.style.columnHeaderCellHeight) {
            var _y = _nearCell.y - self.style.frozenMarkerWidth - self.style.frozenMarkerBorderWidth;

            if (posY > _y + _nearCell.height / 2) _y = _y + _nearCell.height;
            self.ctx.fillStyle = self.style.frozenMarkerColor;
            self.ctx.strokeStyle = self.style.frozenMarkerBorderColor;
            fillRect(0, _y, self.width, self.style.frozenMarkerWidth);
            strokeRect(0, _y, self.width, self.style.frozenMarkerWidth);
            self.ctx.fillStyle = self.style.frozenMarkerHeaderColor;
            self.ctx.strokeStyle = self.style.frozenMarkerHeaderColor;
            fillRect(0, _y, rowHeaderCellWidth, self.style.frozenMarkerWidth);
            strokeRect(0, _y, rowHeaderCellWidth, self.style.frozenMarkerWidth);
          }

          self.ctx.fillStyle = self.style.frozenMarkerActiveHeaderColor;
          self.ctx.strokeStyle = self.style.frozenMarkerActiveBorderColor;
          fillRect(0, posY, rowHeaderCellWidth, self.style.frozenMarkerWidth);
          strokeRect(0, posY, rowHeaderCellWidth, self.style.frozenMarkerWidth);
          self.ctx.fillStyle = self.style.frozenMarkerActiveColor;
          fillRect(0, posY, self.width, self.style.frozenMarkerWidth);
          strokeRect(0, posY, self.width, self.style.frozenMarkerWidth);
        }
      }
    }

    function drawPerfLines() {
      if (!self.attributes.showPerformance) {
        return;
      }

      var pw = 250,
          px = self.width - pw - self.style.scrollBarWidth - self.style.scrollBarBorderWidth * 2,
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
        fillText(name + ' ' + (isNaN(v) ? 0 : v).toFixed(3), 14 + px, py + 16 + rowIndex * 11);
      }

      self.ctx.textAlign = 'left';
      self.ctx.font = self.style.debugFont;
      self.ctx.fillStyle = self.style.debugPerfChartBackground;
      fillRect(px, py, pw, ph);
      [['Scroll Height', scrollDebugCounters, 0, self.scrollBox.scrollHeight, self.style.debugScrollHeightColor, false], ['Scroll Width', scrollDebugCounters, 1, self.scrollBox.scrollWidth, self.style.debugScrollWidthColor, false], ['Performance', perfCounters, undefined, 200, self.style.debugPerformanceColor, false], ['Entities', entityCount, undefined, 1500, self.style.debugEntitiesColor, false], ['TouchPPSX', touchPPSCounters, 0, 1000, self.style.debugTouchPPSXColor, true], ['TouchPPSY', touchPPSCounters, 1, 1000, self.style.debugTouchPPSYColor, true]].forEach(function (i, index) {
        i.push(index);
        dpl.apply(null, i);
      });
      self.ctx.fillStyle = self.style.debugPerfChartBackground;
      entityCount.pop();
      entityCount.unshift(self.visibleCells.length);
      scrollDebugCounters.pop();
      scrollDebugCounters.unshift([self.scrollBox.scrollTop, self.scrollBox.scrollLeft]);
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
      d.perf = (perfCounters.reduce(function (a, b) {
        return a + b;
      }, 0) / Math.min(drawCount, perfCounters.length)).toFixed(1);
      d.perfDelta = perfCounters[0].toFixed(1);
      d.frozenColumnsWidth = getFrozenColumnsWidth();
      d.htmlImages = Object.keys(self.htmlImageCache).length;
      d.reorderObject = 'x: ' + (self.reorderObject || {
        columnIndex: 0
      }).columnIndex + ', y: ' + (self.reorderObject || {
        rowIndex: 0
      }).rowIndex;
      d.reorderTarget = 'x: ' + (self.reorderTarget || {
        columnIndex: 0
      }).columnIndex + ', y: ' + (self.reorderTarget || {
        rowIndex: 0
      }).rowIndex;
      d.scale = self.scale;
      d.startScale = self.startScale;
      d.scaleDelta = self.scaleDelta;
      d.zoomDeltaStart = self.zoomDeltaStart;
      d.touchLength = self.touchLength;
      d.touches = 'y0: ' + (self.touchPosition || {
        y: 0
      }).y + ' y1: ' + (self.touchPosition1 || {
        y: 0
      }).y;
      d.scrollBox = self.scrollBox.toString();
      d.scrollIndex = 'x: ' + self.scrollIndexLeft + ', y: ' + self.scrollIndexTop;
      d.scrollPixel = 'x: ' + self.scrollPixelLeft + ', y: ' + self.scrollPixelTop;
      d.canvasOffset = 'x: ' + self.canvasOffsetLeft + ', y: ' + self.canvasOffsetTop;
      d.touchDelta = 'x: ' + self.touchDelta.x + ', y: ' + self.touchDelta.y;
      d.touchAnimateTo = 'x: ' + self.touchAnimateTo.x + ', y: ' + self.touchAnimateTo.y;
      d.scrollAnimation = 'x: ' + self.scrollAnimation.x + ', y: ' + self.scrollAnimation.y;
      d.touchPPS = 'x: ' + self.xPPS + ', y: ' + self.yPPS;
      d.touchPPST = 'x: ' + self.xPPST + ', y: ' + self.yPPST;
      d.touchDuration = self.touchDuration;
      d.pointerLockPosition = self.pointerLockPosition ? self.pointerLockPosition.x + ', ' + self.pointerLockPosition.y : '';
      d.size = 'w: ' + self.width + ', h: ' + self.height;
      d.mouse = 'x: ' + self.mouse.x + ', y: ' + self.mouse.y;
      d.touch = !self.touchStart ? '' : 'x: ' + self.touchStart.x + ', y: ' + self.touchStart.y;
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
        fillText(m, w - 20, (self.attributes.showPerformance ? 140 : 24) + index * lh);
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

/***/ }),

/***/ "./lib/events/index.js":
/*!*****************************!*\
  !*** ./lib/events/index.js ***!
  \*****************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var is_printable_key_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! is-printable-key-event */ "./node_modules/is-printable-key-event/dist/index.js");
/* harmony import */ var is_printable_key_event__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(is_printable_key_event__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./lib/events/util.js");
/*jslint browser: true, unparam: true, todo: true, plusplus: true*/

/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(self) {
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
    return Math.min(self.attributes.maxPixelRatio, (window.devicePixelRatio || 1) / (self.ctx.webkitBackingStorePixelRatio || self.ctx.mozBackingStorePixelRatio || self.ctx.msBackingStorePixelRatio || self.ctx.oBackingStorePixelRatio || self.ctx.backingStorePixelRatio || 1));
  };
  /**
   * @returns {number} dataWidth
   */


  self.refreshScrollCacheX = function () {
    var s = self.getSchema();
    self.scrollCache.x = [];
    /** @type {number} it will be used in `reduceSchema` only  */

    var frozenWidth = 0;
    var collapsedColumnGroups = self.getCollapsedColumnGroups();

    var isColumnCollapsed = function isColumnCollapsed(columnIndex) {
      return collapsedColumnGroups.findIndex(function (group) {
        return columnIndex >= group.from && columnIndex <= group.to;
      }) >= 0;
    };

    var dataWidth = s.reduce(function reduceSchema(accumulator, column, columnIndex) {
      // intentional redefintion of column.  This causes scrollCache to be in the correct order
      var schemaIndex = self.orders.columns[columnIndex];
      var columnWidth = self.getColumnWidth(schemaIndex);
      column = s[schemaIndex];
      if (!column.hidden && !isColumnCollapsed(columnIndex)) accumulator += columnWidth;

      if (columnIndex < self.frozenColumn) {
        self.scrollCache.x[columnIndex] = accumulator;
        frozenWidth = accumulator;
      } else {
        self.scrollCache.x[columnIndex] = Math.max(frozenWidth + columnWidth, accumulator);
      }

      return accumulator;
    }, 0) || 0;
    return dataWidth;
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
      style: 'vertical-scroll-bar'
    },
        n = {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      style: 'horizontal-scroll-bar'
    },
        vb = {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      style: 'vertical-scroll-box'
    },
        nb = {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      style: 'horizontal-scroll-box'
    },
        co = {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      isCorner: true,
      isScrollBoxCorner: true,
      style: 'scroll-box-corner'
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
        ch = self.style.cellHeight; // sets actual DOM canvas element

    function checkScrollBoxVisibility() {
      self.scrollBox.horizontalBarVisible = self.style.width !== 'auto' && dataWidth > self.scrollBox.width && self.style.overflowX !== 'hidden' || self.style.overflowX === 'scroll';
      self.scrollBox.horizontalBoxVisible = dataWidth > self.scrollBox.width;
      self.scrollBox.verticalBarVisible = self.style.height !== 'auto' && dataHeight > self.scrollBox.height && self.style.overflowY !== 'hidden' || self.style.overflowY === 'scroll';
      self.scrollBox.verticalBoxVisible = dataHeight > self.scrollBox.height;
    }

    function setScrollBoxSize() {
      self.scrollBox.width = self.width - rowHeaderCellWidth - leftGroupAreaWidth;
      self.scrollBox.height = self.height - columnHeaderCellHeight - topGroupAreaHeight;
    }

    function setCanvasSize() {
      if (self.isChildGrid) {
        return;
      }

      dims = {
        // HACK +1 ? maybe it's a magic cell border?  Required to line up properly in auto height mode.
        height: columnHeaderCellHeight + topGroupAreaHeight + dataHeight + cellBorder + 1,
        width: dataWidth + rowHeaderCellWidth + cellBorder + leftGroupAreaWidth
      };
      ['width', 'height'].forEach(function (dim) {
        //TODO: support inherit
        if (['auto', undefined].indexOf(self.style[dim]) !== -1 && ['auto', undefined].indexOf(self.appliedInlineStyles[dim]) !== -1) {
          self.parentNodeStyle[dim] = dims[dim] + 'px';
        } else if (['auto', undefined].indexOf(self.style[dim]) == -1 && ['auto', undefined].indexOf(self.appliedInlineStyles[dim]) == -1) {
          self.parentNodeStyle[dim] = self.style[dim];

          if (self.isComponent) {
            self.canvas.style[dim] = self.style[dim];
          }
        }
      });
    }

    dataWidth = self.refreshScrollCacheX();
    self.scrollCache.y = [];

    for (x = 0; x < l; x += 1) {
      self.scrollCache.y[x] = dataHeight;
      dataHeight += ((self.sizes.rows[x] || ch) + (self.sizes.trees[x] || 0)) * self.scale + ( // HACK? if an expanded tree row is frozen it is necessary to add the tree row's height a second time.
      self.frozenRow > x ? self.sizes.trees[x] || 0 : 0);
    }

    if (l > 1) {
      self.scrollCache.y[x] = dataHeight;
    }

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
    } else if (self.height !== self.canvas.offsetHeight || self.width !== self.canvas.offsetWidth) {
      self.height = self.canvas.offsetHeight;
      self.width = self.canvas.offsetWidth;
      self.canvasOffsetLeft = self.args.canvasOffsetLeft || 0;
      self.canvasOffsetTop = self.args.canvasOffsetTop || 0;
    } /// calculate scroll bar dimensions
    // non-controversial


    self.scrollBox.top = columnHeaderCellHeight + topGroupAreaHeight + columnHeaderCellBorder;
    self.scrollBox.left = rowHeaderCellWidth + leftGroupAreaWidth; // width and height of scroll box

    setScrollBoxSize(); // is the data larger than the scroll box

    checkScrollBoxVisibility(); // if the scroll box is visible, make room for it by expanding the size of the element
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
    } // set again after bar visibility checks


    setScrollBoxSize();
    self.scrollBox.scrollWidth = dataWidth - self.scrollBox.width;
    self.scrollBox.scrollHeight = dataHeight - self.scrollBox.height;

    if (self.frozenColumn > 0) {
      self.scrollBox.widthBoxRatio = (self.scrollBox.width - self.scrollCache.x[self.frozenColumn - 1]) / dataWidth;
    } else {
      self.scrollBox.widthBoxRatio = self.scrollBox.width / dataWidth;
    }

    self.scrollBox.scrollBoxWidth = self.scrollBox.width * self.scrollBox.widthBoxRatio - self.style.scrollBarWidth - b - d; // TODO: This heightBoxRatio number is terribly wrong.
    // They should be a result of the size of the grid/canvas?
    // it being off causes the scroll bar to "slide" under
    // the dragged mouse.
    // https://github.com/TonyGermaneri/canvas-datagrid/issues/97

    self.scrollBox.heightBoxRatio = (self.scrollBox.height - columnHeaderCellHeight - topGroupAreaHeight - self.scrollCache.y[self.frozenRow]) / dataHeight;
    self.scrollBox.scrollBoxHeight = self.scrollBox.height * self.scrollBox.heightBoxRatio - self.style.scrollBarWidth - b - d;
    self.scrollBox.scrollBoxWidth = Math.max(self.scrollBox.scrollBoxWidth, self.style.scrollBarBoxMinSize);
    self.scrollBox.scrollBoxHeight = Math.max(self.scrollBox.scrollBoxHeight, self.style.scrollBarBoxMinSize); // horizontal

    n.x += rowHeaderCellWidth;
    n.y += self.height - self.style.scrollBarWidth - d - topGroupAreaHeight;
    n.width = self.width - self.style.scrollBarWidth - rowHeaderCellWidth - leftGroupAreaWidth - d - m;
    n.height = self.style.scrollBarWidth + self.style.scrollBarBorderWidth + d; // horizontal box

    nb.y = n.y + self.style.scrollBarBoxMargin;
    nb.width = self.scrollBox.scrollBoxWidth;
    nb.height = self.style.scrollBarBoxWidth; // vertical

    v.x += self.width - leftGroupAreaWidth - self.style.scrollBarWidth - self.style.scrollBarBorderWidth - d;
    v.y += columnHeaderCellHeight + self.scrollCache.y[self.frozenRow];
    v.width = self.style.scrollBarWidth + self.style.scrollBarBorderWidth + d;
    v.height = self.height - columnHeaderCellHeight - topGroupAreaHeight - self.style.scrollBarWidth - d - m; // vertical box

    vb.x = v.x + self.style.scrollBarBoxMargin;
    vb.y += self.scrollCache.y[self.frozenRow];
    vb.width = self.style.scrollBarBoxWidth;
    vb.height = self.scrollBox.scrollBoxHeight; // corner

    co.x = n.x + n.width + m;
    co.y = v.y + v.height + m;
    co.width = self.style.scrollBarWidth + self.style.scrollBarBorderWidth;
    co.height = self.style.scrollBarWidth + self.style.scrollBarBorderWidth;
    self.scrollBox.entities = {
      horizontalBar: n,
      horizontalBox: nb,
      verticalBar: v,
      verticalBox: vb,
      corner: co
    };
    self.scrollBox.bar = {
      v: v,
      h: n
    };
    self.scrollBox.box = {
      v: vb,
      h: nb
    }; /// calculate page and dom elements

    self.page = Math.max(1, self.visibleRows.length - 3 - self.attributes.pageUpDownOverlap); // set canvas drawing related items

    if (!self.isChildGrid) {
      var newWidth = self.width * ratio;
      var newHeight = self.height * ratio; // We need to check is settings size to canvas necessary,
      // because settings the canvas'size will cause the canvas and its state be cleared
      // even if the size is the same.
      // Notes: Please don't call `self.resize()` without a subsequent call to `self.draw()`

      if (self.canvas.width !== newWidth || self.canvas.height !== newHeight) {
        self.canvas.width = newWidth;
        self.canvas.height = newHeight;
        self.ctx.scale(ratio, ratio);
      }
    } // resize any open dom elements (input/textarea)


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
        ch = self.style.cellHeight; // go too far in leaps, then get focused

    self.scrollIndexTop = Math.floor(l * (self.scrollBox.scrollTop / self.scrollBox.scrollHeight) - 100);
    self.scrollIndexTop = Math.max(self.scrollIndexTop, 0);
    self.scrollPixelTop = self.scrollCache.y[self.scrollIndexTop]; // sometimes the grid is rendered but the height is zero

    if (self.scrollBox.scrollHeight === 0) {
      self.scrollIndexTop = 0;
    }

    self.scrollPixelTop = 0;
    self.scrollIndexLeft = self.frozenColumn;
    self.scrollPixelLeft = 0;

    while (self.scrollPixelTop < self.scrollBox.scrollTop && self.scrollIndexTop < self.viewData.length) {
      // start on index +1 since index 0 was used in "go too far" section above
      self.scrollIndexTop += 1;
      self.scrollPixelTop = self.scrollCache.y[self.scrollIndexTop];
    }

    while (self.scrollPixelLeft < self.scrollBox.scrollLeft + 1 && self.scrollIndexLeft < s.length) {
      self.scrollPixelLeft = self.scrollCache.x[self.scrollIndexLeft];
      self.scrollIndexLeft += 1;
    }

    if (s.length > 0) {
      self.scrollIndexLeft = Math.max(self.scrollIndexLeft - 1, 0);
      self.scrollPixelLeft -= self.getColumnWidth(self.orders.columns[self.scrollIndexLeft]);
    }

    if ((self.viewData || []).length > 0) {
      self.scrollIndexTop = Math.max(self.scrollIndexTop - 1, 0);
      self.scrollPixelTop = Math.max(self.scrollPixelTop - (self.viewData[self.scrollIndexTop] ? (self.sizes.rows[self.scrollIndexTop] || ch) + (self.sizes.trees[self.scrollIndexTop] || 0) : ch) * self.scale, 0);
    }

    self.ellipsisCache = {};

    if (!dontDraw) {
      self.draw(true);
    } //TODO: figure out why this has to be delayed for child grids
    //BUG: wheeling event on 3rd level hierarchy fails to move input box


    requestAnimationFrame(self.resizeEditInput);
    self.dispatchEvent('scroll', {
      top: self.scrollBox.scrollTop,
      left: self.scrollBox.scrollLeft
    });
  };

  self.mousemove = function (e, overridePos) {
    if (self.contextMenu || self.input) {
      return;
    } // Cancel dragging action if user ventures outside grid


    if (self.draggingItem && e.which === 0) {
      self.stopFreezeMove(e);
      self.mouseup(e);
      return;
    }

    self.mouse = overridePos || self.getLayerPos(e);
    var ctrl = (e.ctrlKey || e.metaKey || self.attributes.persistantSelectionMode) && !self.attributes.singleSelectionMode,
        i,
        s = self.getSchema(),
        dragBounds,
        sBounds,
        x = self.mouse.x,
        y = self.mouse.y,
        cell = self.getCellAt(x, y),
        delta,
        disallowVerticalAutoScroll = false,
        disallowHorizontalAutoScroll = false,
        ev = {
      NativeEvent: e,
      cell: cell,
      x: x,
      y: y
    },
        previousCell = self.currentCell;
    clearTimeout(self.scrollTimer);

    if (!self.isInGrid({
      x: x,
      y: y
    })) {
      self.hasFocus = false;
    }

    if (self.dispatchEvent('mousemove', ev)) {
      return;
    }

    if (cell && self.currentCell) {
      self.rowBoundaryCrossed = self.currentCell.rowIndex !== cell.rowIndex;
      self.columnBoundaryCrossed = self.currentCell.columnIndex !== cell.columnIndex;
      self.cellBoundaryCrossed = self.rowBoundaryCrossed || self.columnBoundaryCrossed;
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

    if (!self.draggingItem && // It is not in dragging mode (avoid changing hovers frequent)
    cell && (cell.context === 'cell' || cell.context === self.cursorGrab)) {
      var indicator = self.getUnhideIndicator(self.mouse.x, self.mouse.y);

      if (indicator) {
        self.cursor = 'pointer';
        self.hovers = {
          unhideIndicator: indicator
        };
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
          onCellTreeIcon: false
        };

        if (cell.isFilterable && x > cell.x + cell.width + self.canvasOffsetLeft - self.style.filterButtonWidth && x < cell.x + cell.width + self.canvasOffsetLeft && y > cell.y + cell.height + self.canvasOffsetTop - self.style.filterButtonHeight && y < cell.y + cell.height + self.canvasOffsetTop) {
          self.hovers.onFilterButton = true;
          self.draw();
        }

        if (cell.isRowTree || cell.isColumnTree) {
          var pc = cell.isRowTree ? self.cellTree.rows[cell.rowIndex].parentCount : 0;
          var rc = self.style.cellTreeIconWidth * self.scale,
              rx = cell.x + cell.paddingLeft + self.canvasOffsetLeft + self.style.cellTreeIconMarginLeft + pc * (rc + cell.paddingLeft),
              ry = cell.y + self.canvasOffsetTop + self.style.cellTreeIconMarginTop * self.scale;

          if (x >= rx && x <= rx + rc && y >= ry && y < ry + rc) {
            self.hovers.onCellTreeIcon = true;
            self.draw();
          }
        }
      }

      if (self.selecting || self.reorderObject) {
        delta = {
          x: Math.abs(self.dragStart.x - x),
          y: Math.abs(self.dragStart.y - y)
        };

        if (self.dragStartObject.columnIndex !== -1 && e.shiftKey) {
          self.dragStartObject = {
            rowIndex: self.activeCell.rowIndex,
            columnIndex: self.activeCell.columnIndex
          };
        }

        dragBounds = {
          top: Math.min(self.dragStartObject.rowIndex, cell.rowIndex),
          left: Math.min(self.dragStartObject.columnIndex, cell.columnIndex),
          bottom: Math.max(self.dragStartObject.rowIndex, cell.rowIndex),
          right: Math.max(self.dragStartObject.columnIndex, cell.columnIndex)
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
          dragBounds.left = cell.columnIndex === undefined ? sBounds.left : Math.min(sBounds.left, cell.columnIndex);
          dragBounds.right = cell.columnIndex === undefined ? sBounds.right : Math.max(sBounds.right, cell.columnIndex);
          dragBounds.top = -1;
          dragBounds.bottom = self.viewData.length - 1;
          if (dragBounds.left < 0) dragBounds.left = 0;
          if (dragBounds.left != dragBounds.right) self.isMultiColumnsSelected = true;else self.isMultiRowsSelected = false;
        }

        if (self.dragStartObject.rowIndex !== cell.rowIndex || self.dragStartObject.columnIndex !== cell.columnIndex) {
          self.ignoreNextClick = true;
        }

        if (self.cellBoundaryCrossed || delta.x === 0 && delta.y === 0 || self.attributes.selectionMode === 'row') {
          if (cell.rowIndex !== undefined && (self.attributes.selectionMode === 'row' || self.dragStartObject.columnIndex === -1) && self.rowBoundaryCrossed) {
            if (self.dragStartObject.rowIndex < cell.rowIndex) {
              dragBounds.top = self.dragStartObject.rowIndex;
              dragBounds.bottom = cell.rowIndex;
            } else {
              dragBounds.top = cell.rowIndex;
              dragBounds.bottom = self.dragStartObject.rowIndex;
            }
          } else if (cell.rowIndex !== undefined && (self.attributes.selectionMode === 'column' || self.dragStartObject.rowIndex === -1) && self.columnBoundaryCrossed) {
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
                  rowIndex: -1
                };
              } else {
                self.selectedFilterButton.rowIndex = cell.rowIndex;
                self.selectedFilterButton.columnIndex = cell.columnIndex;
                self.contextmenuEvent(e, {
                  x: cell.x + cell.width - self.style.filterButtonWidth,
                  y: cell.y + cell.height,
                  rect: {
                    left: 0,
                    top: 0
                  }
                });
              }

              self.draw();
              return;
            } else if (cell.hovered && self.hovers.onCellTreeIcon && e.type == 'mousedown') {
              self.toggleCollapseTree(cell.rowIndex, cell.columnIndex);
              return;
            } else {
              self.selectedFilterButton = {
                columnIndex: -1,
                rowIndex: -1
              };
              if (self.hovers.onFilterButton) return;
              if (self.hovers.onCellTreeIcon) return;

              if (!self.dragAddToSelection && cell.rowIndex !== undefined) {
                if (self.selections[cell.rowIndex] && self.selections[cell.rowIndex].indexOf(cell.columnIndex) !== -1) {
                  self.selections[cell.rowIndex].splice(self.selections[cell.rowIndex].indexOf(cell.columnIndex), 1);
                }
              } else {
                self.selections[cell.rowIndex] = self.selections[cell.rowIndex] || [];

                if (self.selections[cell.rowIndex].indexOf(cell.columnIndex) === -1) {
                  self.selections[cell.rowIndex].push(cell.columnIndex);
                  var event = {
                    selections: self.selections,
                    selectedData: self.getSelectedData(),
                    selectedCells: self.getSelectedCells(),
                    selectionBounds: self.getSelectionBounds()
                  };
                  self.dispatchEvent('selectionchanged', event);
                }
              }
            }
          }
        }

        if ((!self.selectionBounds || dragBounds.top !== self.selectionBounds.top || dragBounds.left !== self.selectionBounds.left || dragBounds.bottom !== self.selectionBounds.bottom || dragBounds.right !== self.selectionBounds.right) && !ctrl) {
          if (!(cell.hovered && self.hovers.onFilterButton)) {
            self.selections = [];
            self.selectedRows = [];
            self.selectedColumns = [];
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
            self.activeCell.rowIndex = sBounds.top;
            self.activeCell.columnIndex = sBounds.left;

            if (sBounds.left == -1 && sBounds.top !== sBounds.bottom) {
              self.activeCell.columnIndex = 0;
              self.isMultiRowsSelected = true;
              self.isMultiColumnsSelected = false;
            }
          }
        }
      } else if (self.movingSelectionHandle) {
        delta = {
          x: Math.abs(self.dragStart.x - x),
          y: Math.abs(self.dragStart.y - y)
        }; // Disallow auto-scroll to the direction that overlay is not
        // moving towards.

        if (self.fillOverlay.direction === 'y') {
          disallowHorizontalAutoScroll = true;
        } else if (self.fillOverlay.direction === 'x') {
          disallowVerticalAutoScroll = true;
        }
      }

      if (delta) {
        if (self.attributes.autoScrollOnMousemove || disallowVerticalAutoScroll || disallowHorizontalAutoScroll) {
          var movedVertically = !disallowVerticalAutoScroll && delta.y > self.attributes.autoScrollMargin;
          var movedHorizontally = !disallowHorizontalAutoScroll && delta.x > self.attributes.autoScrollMargin;
          if (movedVertically && !movedHorizontally) self.autoScrollZone(e, -1, y, ctrl);else if (movedHorizontally && !movedVertically) self.autoScrollZone(e, x, -1, ctrl);else if (movedHorizontally && movedVertically) self.autoScrollZone(e, x, y, ctrl);
        } else {
          self.autoScrollZone(e, x, y, ctrl);
        }
      }
    }

    var columnGroup = self.getColumnGroupAt(self.mouse.x, self.mouse.y);
    if (columnGroup) self.cursor = 'pointer';
    var rowGroup = self.getRowGroupAt(self.mouse.x, self.mouse.y);
    if (rowGroup) self.cursor = 'pointer';
    self.cellBoundaryCrossed = false;
    self.rowBoundaryCrossed = false;
    self.columnBoundaryCrossed = false;
    self.draw(true);
  };

  self.click = function (e, overridePos) {
    var i,
        startingBounds = JSON.stringify(self.getSelectionBounds()),
        ctrl = (e.ctrlKey || e.metaKey || self.attributes.persistantSelectionMode) && !self.attributes.singleSelectionMode,
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
        selectedCells: self.getSelectedCells()
      };
      Object.defineProperty(ev, 'selectedData', {
        get: function get() {
          return self.getSelectedData();
        }
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

    if (self.dispatchEvent('click', {
      NativeEvent: e,
      cell: self.currentCell
    })) {
      return;
    }

    var unhideIndicator = self.getUnhideIndicator(pos.x, pos.y);

    if (unhideIndicator) {
      var dir = unhideIndicator.dir,
          orderIndex0 = unhideIndicator.orderIndex0,
          orderIndex1 = unhideIndicator.orderIndex1;
      if (dir === 'l' || dir === 'r') self.unhideColumns(orderIndex0, orderIndex1);else self.unhideRows(orderIndex0, orderIndex1);
      return;
    }

    var group = self.getColumnGroupAt(pos.x, pos.y);
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

    var leftOffset = self.getRowGroupAreaWidth();
    var topOffset = self.getColumnGroupAreaHeight();
    var xInGrid = pos.x - leftOffset;
    var yInGrid = pos.y - topOffset;

    if (['rowHeaderCell', 'columnHeaderCell'].indexOf(self.currentCell.style) === -1 && !ctrl) {
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
            self.orderDirection = self.orderDirection === 'asc' ? 'desc' : 'asc';
          } else {
            self.orderDirection = 'asc';
          }

          self.order(i.header.name, self.orderDirection);
          checkSelectionChange();
          return;
        }
      }

      self.selections[i.rowIndex] = self.selections[i.rowIndex] || [];

      if (self.attributes.selectionMode === 'row' || self.currentCell.style === 'rowHeaderCell') {
        if (self.currentCell.style === 'rowHeaderCell' && self.attributes.tree && xInGrid > 0 && xInGrid - self.currentCell.x < self.style.treeArrowWidth + self.style.treeArrowMarginLeft + self.style.treeArrowMarginRight + self.style.treeArrowClickRadius && yInGrid - self.currentCell.y < self.style.treeArrowHeight + self.style.treeArrowMarginTop + self.style.treeArrowClickRadius && yInGrid > 0) {
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

    if (self.dispatchEvent('resizecolumn', {
      x: x,
      y: y,
      draggingItem: self.draggingItem
    })) {
      return false;
    }

    if (self.scrollBox.scrollLeft > self.scrollBox.scrollWidth - self.attributes.resizeScrollZone && self.dragMode === 'ew-resize') {
      self.resize(true);
    }

    if (self.dragMode === 'ew-resize') {
      self.sizes.columns[self.draggingItem.header.style === 'rowHeaderCell' ? 'cornerCell' : self.draggingItem.sortColumnIndex] = x;

      if (['rowHeaderCell', 'cornerCell'].indexOf(self.draggingItem.header.style) !== -1) {
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

      self.dispatchEvent('resizerow', {
        row: y
      });
      self.resizeChildGrids();
      return;
    }

    self.ellipsisCache = {};
  };

  self.stopDragResize = function (event) {
    var pos = self.getLayerPos(event);

    if (self.dragMode === 'ew-resize') {
      var hasMoved = !!(pos.x - self.dragStart.x); // Check that dragItem is selected or part of selection.

      var dragItemIsSelected = self.isColumnSelected(self.dragItem.columnIndex);

      if (hasMoved && dragItemIsSelected) {
        var width = Math.max(self.resizingStartingWidth + pos.x - self.dragStart.x, self.style.minColumnWidth); // If the column is selected, resize it to width plus any other selected columns.

        self.fitSelectedColumns(width);
      }
    }

    self.resize();
    window.removeEventListener('mousemove', self.dragResizeColumn, false);
    window.removeEventListener('mouseup', self.stopDragResize, false);
    self.setStorageData();
    self.draw(true);
    self.ignoreNextClick = true;
  };

  self.scrollGrid = function (e) {
    var pos = self.getLayerPos(e);

    if (self.attributes.scrollPointerLock && self.pointerLockPosition && ['horizontal-scroll-box', 'vertical-scroll-box'].indexOf(self.scrollStartMode) !== -1) {
      self.pointerLockPosition.x += e.movementX;
      self.pointerLockPosition.y += e.movementY;
      self.pointerLockPosition.x = Math.min(self.width - self.style.scrollBarWidth, Math.max(0, self.pointerLockPosition.x));
      self.pointerLockPosition.y = Math.min(self.height - self.style.scrollBarWidth, Math.max(0, self.pointerLockPosition.y));
      pos = self.pointerLockPosition;
    }

    self.scrollMode = self.getCellAt(pos.x, pos.y).context;

    if (self.scrollMode === 'horizontal-scroll-box' && self.scrollStartMode !== 'horizontal-scroll-box') {
      self.scrollStartMode = 'horizontal-scroll-box';
      self.dragStart = pos;
      self.scrollStart.left = self.scrollBox.scrollLeft;
      clearTimeout(self.scrollTimer);
      return;
    }

    if (self.scrollMode === 'vertical-scroll-box' && self.scrollStartMode !== 'vertical-scroll-box') {
      self.scrollStartMode = 'vertical-scroll-box';
      self.dragStart = pos;
      self.scrollStart.top = self.scrollBox.scrollTop;
      clearTimeout(self.scrollTimer);
      return;
    }

    if (self.scrollStartMode === 'vertical-scroll-box' && self.scrollMode !== 'vertical-scroll-box') {
      self.scrollMode = 'vertical-scroll-box';
    }

    if (self.scrollStartMode === 'horizontal-scroll-box' && self.scrollMode !== 'horizontal-scroll-box') {
      self.scrollMode = 'horizontal-scroll-box';
    }

    clearTimeout(self.scrollTimer);

    if (self.scrollModes.indexOf(self.scrollMode) === -1) {
      return;
    }

    if (self.scrollMode === 'vertical-scroll-box') {
      self.scrollBox.scrollTop = self.scrollStart.top + (pos.y - self.dragStart.y) / self.scrollBox.heightBoxRatio;
    } else if (self.scrollMode === 'vertical-scroll-top') {
      self.scrollBox.scrollTop -= self.page * self.style.cellHeight;
      self.scrollTimer = setTimeout(self.scrollGrid, self.attributes.scrollRepeatRate, e);
    } else if (self.scrollMode === 'vertical-scroll-bottom') {
      self.scrollBox.scrollTop += self.page * self.style.cellHeight;
      self.scrollTimer = setTimeout(self.scrollGrid, self.attributes.scrollRepeatRate, e);
    }

    if (self.scrollMode === 'horizontal-scroll-box') {
      self.scrollBox.scrollLeft = self.scrollStart.left + (pos.x - self.dragStart.x) / self.scrollBox.widthBoxRatio;
    } else if (self.scrollMode === 'horizontal-scroll-right') {
      self.scrollBox.scrollLeft += self.attributes.selectionScrollIncrement;
      self.scrollTimer = setTimeout(self.scrollGrid, self.attributes.scrollRepeatRate, e);
    } else if (self.scrollMode === 'horizontal-scroll-left') {
      self.scrollBox.scrollLeft -= self.attributes.selectionScrollIncrement;
      self.scrollTimer = setTimeout(self.scrollGrid, self.attributes.scrollRepeatRate, e);
    }
  };

  self.stopScrollGrid = function () {
    clearTimeout(self.scrollTimer);

    if (document.exitPointerLock) {
      document.exitPointerLock();
    }

    window.removeEventListener('mousemove', self.scrollGrid, false);
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
      if (self.dragMode === 'column-reorder' && !self.isMultiColumnsSelected) {
        self.selectColumn(self.draggingItem.header.index, false, false);
      }
    }

    if (self.dispatchEvent('reordering', {
      NativeEvent: e,
      source: self.dragStartObject,
      target: self.currentCell,
      dragMode: self.dragMode
    })) {
      return;
    }

    if (Math.abs(x) > self.attributes.reorderDeadZone || Math.abs(y) > self.attributes.reorderDeadZone) {
      self.reorderObject = self.draggingItem;
      if (self.isMultiRowsSelected) self.reorderObject = self.getVisibleCellByIndex(-1, self.activeCell.rowIndex);
      if (self.isMultiColumnsSelected) self.reorderObject = self.getVisibleCellByIndex(self.activeCell.columnIndex, -1);
      if (!self.reorderObject) return;
      self.reorderTarget = self.currentCell;
      self.reorderObject.dragOffset = {
        x: x,
        y: y
      };
      self.autoScrollZone(e, columReorder ? pos.x : -1, rowReorder ? pos.y : -1, false);
    }
  };

  self.stopDragReorder = function (e) {
    var oIndex,
        tIndex,
        odata = [],
        cr = {
      'row-reorder': self.orders.rows,
      'column-reorder': self.orders.columns
    },
        i = {
      'row-reorder': 'rowIndex',
      'column-reorder': 'sortColumnIndex'
    }[self.dragMode];
    window.removeEventListener('mousemove', self.dragReorder, false);
    window.removeEventListener('mouseup', self.stopDragReorder, false);

    if (self.reorderObject && self.reorderTarget && (self.dragMode === 'column-reorder' && self.reorderTarget.sortColumnIndex > -1 && self.reorderTarget.sortColumnIndex < self.getSchema().length || self.dragMode === 'row-reorder' && self.reorderTarget.rowIndex > -1 && self.reorderTarget.rowIndex < self.viewData.length) && self.reorderObject[i] !== self.reorderTarget[i] && !self.dispatchEvent('reorder', {
      NativeEvent: e,
      source: self.reorderObject,
      target: self.reorderTarget,
      dragMode: self.dragMode
    })) {
      self.ignoreNextClick = true;
      oIndex = cr[self.dragMode].indexOf(self.reorderObject[i]);
      tIndex = cr[self.dragMode].indexOf(self.reorderTarget[i]);

      if (self.dragMode === 'column-reorder') {
        var sortColumnIndices = [];
        var selectedColumnIndices = [];

        if (self.selections[0]) {
          oIndex = self.selections[0][0];
          self.selections[0].forEach(function (value) {
            sortColumnIndices.push(self.orders.columns[value]);
          });
        }

        var deleteCount = sortColumnIndices.length;

        if (tIndex < oIndex || tIndex > oIndex && Math.abs(tIndex - oIndex) >= deleteCount) {
          cr[self.dragMode].splice(oIndex, deleteCount);
          if (tIndex > oIndex) tIndex = tIndex - (deleteCount - 1);
          self.selectedColumns = [];

          for (var i = 0; i < sortColumnIndices.length; i++) {
            if (i === 0) self.activeCell.columnIndex = tIndex;
            selectedColumnIndices.push(tIndex + i);
            self.selectedColumns.push(sortColumnIndices[i]);
            cr[self.dragMode].splice(tIndex + i, 0, sortColumnIndices[i]);
          }

          self.orders.columns = cr[self.dragMode];
          self.viewData.forEach(function (row, rowIndex) {
            self.selections[rowIndex] = selectedColumnIndices;
          });
        }
      } else {
        var selectedRows = [];
        self.selections.forEach(function (row, rowIndex) {
          if (row) {
            selectedRows.push(row);
            odata.push(self.viewData[rowIndex]);
          }
        });

        if (tIndex < oIndex || tIndex > oIndex && Math.abs(tIndex - oIndex) >= odata.length) {
          self.viewData.splice(oIndex, odata.length);
          self.selections = [];
          self.selectedRows = [];
          if (tIndex > oIndex) tIndex = tIndex - (odata.length - 1);
          self.activeCell.rowIndex = tIndex;

          for (var i = 0; i < odata.length; i++) {
            self.viewData.splice(tIndex + i, 0, odata[i]);
            self.selections[tIndex + i] = selectedRows[i];
            self.selectedRows.push(tIndex + i);
          }
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
    if (self.dispatchEvent('moving', {
      NativeEvent: e,
      cell: self.currentCell
    })) {
      return;
    }

    var pos = self.getLayerPos(e);
    self.moveOffset = {
      x: self.currentCell.columnIndex - self.dragStartObject.columnIndex,
      y: self.currentCell.rowIndex - self.dragStartObject.rowIndex
    };

    if (Math.abs(pos.x) > self.attributes.reorderDeadZone || Math.abs(pos.y) > self.attributes.reorderDeadZone) {
      setTimeout(function () {
        self.autoScrollZone(e, pos.x, pos.y, false);
      }, 1);
    }
  };

  self.stopDragMove = function (e) {
    window.removeEventListener('mousemove', self.dragMove, false);
    window.removeEventListener('mouseup', self.stopDragMove, false);
    var b = self.getSelectionBounds();

    if (self.dispatchEvent('endmove', {
      NativeEvent: e,
      cell: self.currentCell
    })) {
      self.movingSelection = undefined;
      self.moveOffset = undefined;
      self.draw(true);
      return;
    }

    if (self.moveOffset) {
      self.moveTo(self.movingSelection, b.left + self.moveOffset.x, b.top + self.moveOffset.y);
      self.moveSelection(self.moveOffset.x, self.moveOffset.y);
    }

    self.movingSelection = undefined;
    self.moveOffset = undefined;
    self.draw(true);
  };

  self.freezeMove = function (e) {
    if (self.dispatchEvent('freezemoving', {
      NativeEvent: e,
      cell: self.currentCell
    })) {
      return;
    }

    var pos = self.getLayerPos(e);
    self.ignoreNextClick = true;
    self.freezeMarkerPosition = pos;
    pos.x -= self.getRowGroupAreaWidth();
    pos.y -= self.getColumnGroupAreaHeight();

    if (Math.abs(pos.x) > self.attributes.reorderDeadZone || Math.abs(pos.y) > self.attributes.reorderDeadZone) {
      setTimeout(function () {
        self.autoScrollZone(e, pos.x, pos.y, false);
      }, 1);
    }
  };

  self.stopFreezeMove = function (e) {
    var pos = self.getLayerPos(e),
        bm = self.style.gridBorderCollapse === 'collapse' ? 1 : 2,
        columnHeaderCellBorder = self.style.columnHeaderCellBorderWidth * bm,
        columnHeaderCellHeight = self.getColumnHeaderCellHeight(),
        rowHeaderCellWidth = self.getRowHeaderCellWidth();
    pos.x -= self.getRowGroupAreaWidth();
    pos.y -= self.getColumnGroupAreaHeight();

    if (self.currentCell && self.currentCell.rowIndex !== undefined && self.dragMode === 'frozen-row-marker') {
      self.scrollBox.scrollTop = 0;
      self.frozenRow = self.currentCell.rowIndex + 1;
      self.scrollBox.bar.v.y = columnHeaderCellHeight + columnHeaderCellBorder + self.scrollCache.y[self.frozenRow];
      self.scrollBox.box.v.y = columnHeaderCellHeight + columnHeaderCellBorder + self.scrollCache.y[self.frozenRow];
      var dataHeight = self.scrollCache.y[self.scrollCache.y.length - 1];
      self.scrollBox.heightBoxRatio = (self.scrollBox.height - columnHeaderCellHeight - self.scrollCache.y[self.frozenRow]) / dataHeight;
      self.scrollBox.scrollBoxHeight = self.scrollBox.height * self.scrollBox.heightBoxRatio - self.style.scrollBarWidth;
      self.scrollBox.scrollBoxHeight = Math.max(self.scrollBox.scrollBoxHeight, self.style.scrollBarBoxMinSize);
      self.scrollBox.box.v.height = self.scrollBox.scrollBoxHeight;
    }

    if (self.currentCell && self.currentCell.columnIndex !== undefined && self.dragMode === 'frozen-column-marker') {
      var dataWidth = self.refreshScrollCacheX();
      self.scrollBox.scrollLeft = 0;
      var x = self.currentCell.x - self.style.frozenMarkerWidth - self.style.frozenMarkerBorderWidth;
      if (pos.x > x + self.currentCell.width / 2) self.frozenColumn = self.currentCell.columnIndex + 1;else if (self.currentCell.columnIndex >= 0) self.frozenColumn = self.currentCell.columnIndex;
      self.scrollBox.bar.h.x = rowHeaderCellWidth + self.scrollCache.x[self.frozenColumn];
      self.scrollBox.widthBoxRatio = (self.scrollBox.width - self.scrollCache.x[self.frozenColumn]) / dataWidth;
      self.scrollBox.scrollBoxWidth = self.scrollBox.width * self.scrollBox.widthBoxRatio - self.style.scrollBarWidth;
      self.scrollBox.scrollBoxWidth = Math.max(self.scrollBox.scrollBoxWidth, self.style.scrollBarBoxMinSize);
      self.scrollBox.box.h.width = self.scrollBox.scrollBoxWidth;
    }

    if (Math.abs(pos.x) > self.attributes.reorderDeadZone || Math.abs(pos.y) > self.attributes.reorderDeadZone) {
      setTimeout(function () {
        self.autoScrollZone(e, pos.x, pos.y, false);
      }, 1);
    }

    window.removeEventListener('mousemove', self.freezeMove, false);
    window.removeEventListener('mouseup', self.stopFreezeMove, false);
    self.freezeMarkerPosition = undefined;

    if (self.dispatchEvent('endfreezemove', {
      NativeEvent: e,
      cell: self.currentCell
    })) {
      self.frozenRow = self.startFreezeMove.x;
      self.frozenColumn = self.startFreezeMove.y;
      self.draw(true);
      return;
    }

    self.draw(true);
    self.resize();
  };

  self.mousedown = function (e, overridePos) {
    self.lastMouseDownTarget = e.target;

    if (self.dispatchEvent('mousedown', {
      NativeEvent: e,
      cell: self.currentCell
    })) {
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
        resize = /-resize/.test(self.dragMode),
        selectionHandleMove = /selection-handle-br/.test(self.dragMode);
    var onUnhideIndicator = self.hovers && self.hovers.unhideIndicator;
    self.dragStart = overridePos || self.getLayerPos(e);
    self.scrollStart = {
      left: self.scrollBox.scrollLeft,
      top: self.scrollBox.scrollTop
    };
    self.dragStartObject = self.getCellAt(self.dragStart.x, self.dragStart.y);
    self.dragAddToSelection = !self.dragStartObject.selected;

    if (!ctrl && !e.shiftKey && !/(vertical|horizontal)-scroll-(bar|box)/.test(self.dragStartObject.context) && self.currentCell && !self.currentCell.isColumnHeader && !move && !freeze && !resize && !selectionHandleMove) {
      if (!(self.dragMode == 'row-reorder' && self.isMultiRowsSelected) && !(self.currentCell.hovered && self.hovers.onFilterButton)) {
        self.selections = [];
        self.selectedRows = [];
        self.selectedColumns = [];
      }
    }

    if (self.dragStartObject.isGrid) {
      return;
    }

    if (self.scrollModes.indexOf(self.dragStartObject.context) !== -1 && !onUnhideIndicator) {
      self.scrollMode = self.dragStartObject.context;
      self.scrollStartMode = self.dragStartObject.context;
      self.scrollGrid(e);

      if (self.attributes.scrollPointerLock && ['horizontal-scroll-box', 'vertical-scroll-box'].indexOf(self.scrollStartMode) !== -1) {
        self.pointerLockPosition = {
          x: self.dragStart.x,
          y: self.dragStart.y
        };
        self.canvas.requestPointerLock();
      }

      window.addEventListener('mousemove', self.scrollGrid, false);
      window.addEventListener('mouseup', self.stopScrollGrid, false);
      self.ignoreNextClick = true;
      return;
    }

    if (self.dragMode === 'cell') {
      self.selecting = true;

      if ((self.attributes.selectionMode === 'row' || self.dragStartObject.columnIndex === -1) && self.dragStartObject.rowIndex > -1) {
        self.selectRow(self.dragStartObject.rowIndex, ctrl, null);
      } else if ((self.attributes.selectionMode === 'column' || self.dragStartObject.rowIndex === -1) && self.dragStartObject.columnIndex > -1) {
        self.selectColumn(self.currentCell.header.index, ctrl, e.shiftKey);
        return;
      }

      if (self.attributes.selectionMode !== 'row') {
        self.mousemove(e);
      }

      return;
    }

    if (selectionHandleMove) {
      self.movingSelectionHandle = true;
      self.fillOverlay = {
        handle: {
          x: self.dragStartObject.x + self.dragStartObject.width / 2,
          y: self.dragStartObject.y + self.dragStartObject.height / 2
        },
        snapTo: {
          x: -1,
          y: -1
        },
        selection: self.getSelectionBounds()
      };

      if (self.dispatchEvent('beginselectionhandlemove', {
        NativeEvent: e
      })) {
        return;
      }

      window.addEventListener('mousemove', self.selectionHandleMove, false);
      window.addEventListener('mouseup', self.stopSelectionHandleMove, false);
      return self.selectionHandleMove(e);
    }

    if (move) {
      self.draggingItem = self.dragItem;
      self.movingSelection = self.selections.concat([]);
      self.dragging = self.dragStartObject;

      if (self.dispatchEvent('beginmove', {
        NativeEvent: e,
        cell: self.currentCell
      })) {
        return;
      }

      window.addEventListener('mousemove', self.dragMove, false);
      window.addEventListener('mouseup', self.stopDragMove, false);
      return self.mousemove(e);
    }

    if (freeze) {
      self.draggingItem = self.dragItem;
      self.startFreezeMove = {
        x: self.frozenRow,
        y: self.frozenColumn
      };

      if (self.dispatchEvent('beginfreezemove', {
        NativeEvent: e
      })) {
        return;
      }

      self.freezeMarkerPosition = self.getLayerPos(e);
      self.freezeMarkerPosition.isGrab = true;
      window.addEventListener('mousemove', self.freezeMove, false);
      window.addEventListener('mouseup', self.stopFreezeMove, false);
      return self.mousemove(e);
    }

    if (resize && !onUnhideIndicator) {
      self.draggingItem = self.dragItem;

      if (self.draggingItem.rowOpen) {
        self.resizingStartingHeight = self.sizes.trees[self.draggingItem.rowIndex];
      } else {
        self.resizingStartingHeight = self.sizes.rows[self.draggingItem.rowIndex] || self.style.cellHeight;
      }

      self.resizingStartingWidth = self.sizes.columns[self.draggingItem.header.style === 'rowHeaderCell' ? 'cornerCell' : self.draggingItem.sortColumnIndex] || self.draggingItem.width;
      window.addEventListener('mousemove', self.dragResizeColumn, false);
      window.addEventListener('mouseup', self.stopDragResize, false);
      return;
    }

    if (['row-reorder', 'column-reorder'].indexOf(self.dragMode) !== -1) {
      self.draggingItem = self.dragStartObject;

      if (self.dragMode === 'column-reorder' && !self.isMultiColumnsSelected) {
        self.selectColumn(self.currentCell.header.index, ctrl, e.shiftKey);
      } else if (self.dragMode === 'row-reorder' && !self.isMultiRowsSelected) {
        self.selectRow(self.dragStartObject.rowIndex, ctrl, null);
      }

      window.addEventListener('mousemove', self.dragReorder, false);
      window.addEventListener('mouseup', self.stopDragReorder, false);
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

    if (self.dispatchEvent('mouseup', {
      NativeEvent: e,
      cell: self.currentCell
    })) {
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
  }; // gets the horizontal adjacent cells as well as first/last based on column visibility


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
      cell: self.currentCell
    });

    if (defaultPrevented) {
      return;
    }

    if (!self.attributes.keepFocusOnMouseOut && !self.hasFocus) {
      return;
    } // If a user starts typing content, switch to "Enter" mode


    if (is_printable_key_event__WEBPACK_IMPORTED_MODULE_0___default()(e) && !ctrl) {
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
    } else if (e.key === 'ArrowLeft' && !ctrl || e.shiftKey && e.key === 'Tab') {
      x = adjacentCells.left;
    } else if (e.key === 'ArrowRight' && !ctrl || !e.shiftKey && e.key === 'Tab') {
      x = adjacentCells.right;
    } else if (e.key === 'PageUp') {
      y -= self.page;
      e.preventDefault();
    } else if (e.key === 'PageDown') {
      y += self.page;
      e.preventDefault();
    } else if (e.key === 'Home' || ctrl && e.key === 'ArrowUp') {
      y = 0;
    } else if (e.key === 'End' || ctrl && e.key === 'ArrowDown') {
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
    } // TODO - most likely some column order related bugs in key based selection
    // Arrows


    var isArrowKey = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key); // Shrinking and expanding selection using shift and arrow keys

    if (e.shiftKey && isArrowKey) {
      var firstSelectedRowIndex = self.selections.findIndex(function (el) {
        return !!el;
      });
      var firstSelectedRow = self.selections[firstSelectedRowIndex];
      var firstSelectedColumnIndex = firstSelectedRow[0];
      var lastSelectedColumn = firstSelectedRow[firstSelectedRow.length - 1];
      var yAtTop = y === 0;
      var yAtBottom = y === last;
      var xAtLeft = x === 0;
      var xAtRight = x === cols;

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

      var _iterator = _createForOfIteratorHelper(self.selections),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var selection = _step.value;

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
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      self.selectionBounds = self.getSelectionBounds();
      self.selectArea(undefined, ctrl);
      self.draw(true);
    }

    if (x !== self.activeCell.columnIndex || y !== self.activeCell.rowIndex) {
      self.scrollIntoView(x !== self.activeCell.columnIndex ? x : undefined, y !== self.activeCell.rowIndex && !Number.isNaN(y) ? y : undefined);
      self.setActiveCell(x, y);

      if (!e.shiftKey && self.attributes.selectionFollowsActiveCell) {
        if (!ctrl) {
          self.selections = [];
          self.selectedRows = [];
          self.selectedColumns = [];
        }

        self.selections[y] = self.selections[y] || [];
        self.selections[y].push(x);
        ev = {
          selectedData: self.getSelectedData(),
          selections: self.selections,
          selectionBounds: self.getSelectionBounds(),
          selectedCells: self.getSelectedCells()
        };
        Object.defineProperty(ev, 'selectedData', {
          get: function get() {
            return self.getSelectedData();
          }
        });
        self.dispatchEvent('selectionchanged', ev);
      }

      self.draw(true);
    }
  };

  self.keyup = function (e) {
    if (self.dispatchEvent('keyup', {
      NativeEvent: e,
      cell: self.currentCell
    })) {
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

    if (self.dispatchEvent('keypress', {
      NativeEvent: e,
      cell: self.currentCell
    })) {
      return;
    }
  };

  self.dblclick = function (e) {
    if (self.dispatchEvent('dblclick', {
      NativeEvent: e,
      cell: self.currentCell
    })) {
      return;
    }

    if (!self.hasFocus) {
      return;
    }

    if (self.currentCell.context === 'ew-resize' && self.currentCell.style === 'columnHeaderCell') {
      // Check that double-clicked cell is selected or part of selection.
      var currentCellIsSelected = self.isColumnSelected(self.currentCell.columnIndex);

      if (currentCellIsSelected) {
        // There might be more
        self.fitSelectedColumns();
      } else {
        self.fitColumnToValues(self.currentCell.header.name);
      }
    } else if (self.currentCell.context === 'ew-resize' && self.currentCell.style === 'cornerCell') {
      self.autosize();
    } else if (['cell', 'activeCell'].includes(self.currentCell.style) && !self.hovers.onFilterButton && !self.hovers.onCellTreeIcon) {
      if (self.currentCell.isRowTree || self.currentCell.isColumnTree) {
        self.cellTreeExpandCollapse(self.currentCell.rowIndex, self.currentCell.columnIndex);
        self.draw();
      } else {
        self.beginEditAt(self.currentCell.columnIndex, self.currentCell.rowIndex);
      }
    }
  };

  self.scrollWheel = function (e) {
    var l,
        t,
        ev = e,
        deltaX = e.deltaX === undefined ? e.NativeEvent.deltaX : e.deltaX,
        deltaY = e.deltaY === undefined ? e.NativeEvent.deltaY : e.deltaY,
        deltaMode = e.deltaMode === undefined ? e.NativeEvent.deltaMode : e.deltaMode;
    var e = e.NativeEvent || e;

    if (wheeling) {
      ev.preventDefault(e);
      return;
    }

    if (self.dispatchEvent('wheel', {
      NativeEvent: e
    })) {
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

      if (self.scrollBox.scrollTop < self.scrollBox.scrollHeight && deltaY > 0 || self.scrollBox.scrollLeft < self.scrollBox.scrollWidth && deltaX > 0 || self.scrollBox.scrollTop > 0 && deltaY < 0 || self.scrollBox.scrollLeft > 0 && deltaX < 0) {
        ev.preventDefault(e);
      }

      wheeling = setTimeout(function () {
        wheeling = undefined;
        self.scrollBox.scrollTo(deltaX + l, deltaY + t);
      }, 1);
    }
  };

  self.pasteData = function (pasteValue, mimeType, startRowIndex, startColIndex) {
    var minRowsLength = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var minColumnsLength = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

    if (mimeType === 'text/html' && !(0,_util__WEBPACK_IMPORTED_MODULE_1__.isSupportedHtml)(pasteValue)) {
      console.warn('Unrecognized HTML format. HTML must be a simple table, e.g.: <table><tr><td>data</td></tr></table>.');
      console.warn('Data with the mime type text/html not in this format will not be imported as row data.');
      return;
    }

    self.selectedRows = [];
    self.selectedColumns = [];
    var rows = (0,_util__WEBPACK_IMPORTED_MODULE_1__.parseData)(pasteValue, mimeType);
    var columnsLength = rows[0].length; // selected cell. This mimics Excel's paste functionality, and works
    // as a poor-man's fill-down.

    if (rows.length === 1 && columnsLength === 1 && minRowsLength <= 1 && minColumnsLength <= 1) {
      var cellData = rows[0][0].value.map(function (item) {
        return item.value;
      }).join();
      self.forEachSelectedCell(function (data, rowIndex, colName) {
        data[rowIndex][colName] = cellData;
      });
    } else {
      var direction = null;

      if (minRowsLength > rows.length && minColumnsLength > columnsLength) {
        direction = 'both';
      } else if (minRowsLength > rows.length) {
        direction = 'vertical';
      } else if (minColumnsLength > columnsLength) {
        direction = 'horizontal';
      }

      self.insert({
        rows: rows,
        startRowIndex: startRowIndex,
        startColumnIndex: startColIndex,
        minRowsLength: minRowsLength,
        minColumnsLength: minColumnsLength,
        reverseRows: false,
        reverseColumns: false,
        clearSelections: true,
        alwaysFilling: false,
        direction: direction
      });
    } // selections is a sparse array, so we condense:


    var affectedCells = [];
    self.selections.forEach(function (row, rowIndex) {
      if (rowIndex === undefined) return;
      row.forEach(function (columnIndex) {
        affectedCells.push([rowIndex, columnIndex, self.getBoundRowIndexFromViewRowIndex(rowIndex), self.getBoundColumnIndexFromViewColumnIndex(columnIndex)]);
      });
    });
    self.dispatchEvent('afterpaste', {
      cells: affectedCells
    });
    return rows.length;
  };

  self.insert = function (_ref) {
    var _ref$rows = _ref.rows,
        rows = _ref$rows === void 0 ? [] : _ref$rows,
        _ref$startRowIndex = _ref.startRowIndex,
        startRowIndex = _ref$startRowIndex === void 0 ? 0 : _ref$startRowIndex,
        _ref$startColumnIndex = _ref.startColumnIndex,
        startColumnIndex = _ref$startColumnIndex === void 0 ? 0 : _ref$startColumnIndex,
        _ref$minRowsLength = _ref.minRowsLength,
        minRowsLength = _ref$minRowsLength === void 0 ? 0 : _ref$minRowsLength,
        _ref$minColumnsLength = _ref.minColumnsLength,
        minColumnsLength = _ref$minColumnsLength === void 0 ? 0 : _ref$minColumnsLength,
        _ref$reverseRows = _ref.reverseRows,
        reverseRows = _ref$reverseRows === void 0 ? false : _ref$reverseRows,
        _ref$reverseColumns = _ref.reverseColumns,
        reverseColumns = _ref$reverseColumns === void 0 ? false : _ref$reverseColumns,
        _ref$clearSelections = _ref.clearSelections,
        clearSelections = _ref$clearSelections === void 0 ? false : _ref$clearSelections,
        _ref$alwaysFilling = _ref.alwaysFilling,
        alwaysFilling = _ref$alwaysFilling === void 0 ? false : _ref$alwaysFilling,
        _ref$direction = _ref.direction,
        direction = _ref$direction === void 0 ? 'both' : _ref$direction;
    var schema = self.getSchema();
    var rowsLength = Math.max(rows.length, minRowsLength);
    var fillCellCallback = self.fillCellCallback;
    var selections = clearSelections ? [] : self.selections;
    var filledCells = [];

    for (var rowPosReal = 0, rowDataPos = 0; rowPosReal < rowsLength; rowPosReal++, rowDataPos++) {
      if (rowDataPos >= rows.length) {
        rowDataPos = 0;
      }

      var fillingRow = rowPosReal >= rows.length;
      var rowPosition = reverseRows ? rowsLength - rowPosReal - 1 : rowPosReal; // Rows may have been moved by user, so get the actual row index
      // (instead of the row index at which the row is rendered):

      var realRowIndex = self.orders.rows[startRowIndex + rowPosition];
      var cells = rows[rowDataPos];
      var cellsLength = Math.max(cells.length, minColumnsLength);
      var existingRowData = self.viewData[realRowIndex];
      var newRowData = Object.assign({}, existingRowData);
      var fillArgs = fillCellCallback ? {
        rows: rows,
        direction: direction,
        rowData: newRowData,
        existingRowData: existingRowData,
        rowIndex: realRowIndex,
        rowOffset: rowDataPos,
        cells: cells,
        reversed: direction === 'horizontal' ? reverseColumns : reverseRows,
        isFillingRow: fillingRow || alwaysFilling,
        fillingRowPosition: alwaysFilling ? rowPosReal : fillingRow ? rowPosReal - rows.length : -1,
        fillingRowLength: alwaysFilling ? rowsLength : fillingRow ? rowsLength - rows.length : -1
      } : undefined;
      self.selectedRows.push(realRowIndex);

      if (selections[realRowIndex] === undefined) {
        selections[realRowIndex] = [];
      }

      for (var colPosReal = 0, cellDataPos = 0; colPosReal < cellsLength; colPosReal++, cellDataPos++) {
        if (cellDataPos >= cells.length) {
          cellDataPos = 0;
        }

        var fillingColumn = colPosReal >= cells.length;
        var colPosition = reverseColumns ? cellsLength - colPosReal - 1 : colPosReal;
        var columnIndex = startColumnIndex + colPosition;
        var column = schema[columnIndex];

        if (!column) {
          console.warn('Paste data exceeded grid bounds. Skipping.');
          continue;
        }

        var columnName = column.name;
        var cellData = cells[cellDataPos];

        if (cellData && cellData.value) {
          cellData = cellData.value.map(function (item) {
            return item.value;
          }).join('');
        }

        var existingCellData = existingRowData[columnName];

        if (fillCellCallback && (fillingColumn || fillingRow || alwaysFilling)) {
          newRowData[columnName] = fillCellCallback(_objectSpread(_objectSpread({}, fillArgs), {}, {
            column: column,
            columnIndex: columnIndex,
            columnOffset: cellDataPos,
            newCellData: cellData,
            existingCellData: existingCellData,
            isFillingColumn: fillingColumn || alwaysFilling,
            fillingColumnPosition: alwaysFilling ? colPosReal : fillingColumn ? colPosReal - cells.length : -1,
            fillingColumnLength: alwaysFilling ? cellsLength : fillingColumn ? cellsLength - cells.length : -1
          }));
        } else {
          newRowData[columnName] = cellData === undefined || cellData === null ? existingCellData : cellData;
        }

        selections[realRowIndex].push(columnIndex);

        if (alwaysFilling || fillingRow || fillingColumn) {
          filledCells.push([realRowIndex, columnIndex, self.getBoundRowIndexFromViewRowIndex(realRowIndex), self.getBoundColumnIndexFromViewColumnIndex(columnIndex)]);
        }

        if (self.selectedColumns.indexOf(columnIndex) === -1) self.selectedColumns.push(columnIndex);
      }

      self.originalData[self.boundRowIndexMap.get(realRowIndex)] = newRowData; // Update view date here to avoid a full refresh of `viewData`.
      // To stay in line with Excel and Google Sheet behaviour,
      // don't perform a full refresh (and filter/sort results)
      // as this would make any pasted values disappear and/or suddenly change position.

      self.viewData[realRowIndex] = newRowData;
    }

    self.selections = selections;

    if (filledCells.length > 0 || alwaysFilling) {
      self.dispatchEvent('afterfill', {
        filledCells: filledCells
      });
    }
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

  self.getSelectionIndex = function () {
    for (var rowIndex = 0, len = self.selections.length; rowIndex < len; rowIndex++) {
      var row = self.selections[rowIndex];

      if (row) {
        if (row[0] === undefined) break;
        return {
          row: rowIndex,
          column: row[0] < 0 ? row[1] : row[0],
          rowLength: len - rowIndex,
          columnLength: row.length - (row[0] < 0 ? 1 : 0)
        };
      }
    }

    return null;
  };

  self.paste = function (event) {
    if (!self.attributes.editable) {
      return;
    }

    var defaultPrevented = self.dispatchEvent('beforepaste', {
      NativeEvent: event
    });

    if (defaultPrevented) {
      return;
    }

    var clipboardItems = new Map(Array.from(event.clipboardData.items).map(function (item) {
      return [item.type, item];
    })); // Supported MIME types, in order of preference:

    var supportedMimeTypes = ['text/html', 'text/csv', 'text/plain']; // The clipboard will often contain the same data in multiple formats,
    // which can be used depending on the context in which it's pasted. Here
    // we'll prefere more structured (HTML/CSV) over less structured, when
    // available, so we try to find those first:

    var pasteableItems = supportedMimeTypes.map(function (mimeType) {
      return clipboardItems.get(mimeType);
    }).filter(function (item) {
      return !!item;
    }); // filter out not-found MIME types (= undefined)

    if (pasteableItems.length === 0) {
      console.warn('Cannot find supported clipboard data type. Supported types are:', supportedMimeTypes.join(', '));
      return;
    }

    var selectionIndex = self.getSelectionIndex();
    if (!selectionIndex) return;
    var itemToPaste = pasteableItems[0]; // itemToPaste is cleared once accessed (getData or getAsString),
    // so we need to store the type here, before reading its value:

    var pasteType = itemToPaste.type;
    itemToPaste.getAsString(function (pasteValue) {
      self.pasteData(pasteValue, pasteType, selectionIndex.row, selectionIndex.column, selectionIndex.rowLength, selectionIndex.columnLength);
      self.draw();
    });
  };

  self.cut = function (event) {
    if (self.dispatchEvent('cut', {
      NativeEvent: event
    })) {
      return;
    } // Expecting instance of `ClipboardEvent` with `clipboardData` attribute


    if (!self.hasFocus || !event.clipboardData) {
      return;
    }

    self.copySelectedCellsToClipboard(event.clipboardData);
    var affectedCells = self.clearSelectedCells();
    self.dispatchEvent('aftercut', {
      cells: affectedCells
    });
    requestAnimationFrame(function () {
      return self.draw();
    });
    event.preventDefault();
  };

  self.copy = function (event) {
    if (self.dispatchEvent('copy', {
      NativeEvent: event
    })) {
      return;
    } // Expecting instance of `ClipboardEvent` with `clipboardData` attribute


    if (!self.hasFocus || !event.clipboardData) {
      return;
    }

    self.copySelectedCellsToClipboard(event.clipboardData);
    event.preventDefault();
  };

  self.selectionHandleMove = function (e) {
    if (!self.movingSelectionHandle) {
      return;
    }

    var clippingRect = self.getClippingRect(e);
    var rowIndex = self.currentCell.rowIndex;
    var columnIndex = self.currentCell.columnIndex;
    var isInSelectionBounds = rowIndex >= -1 && columnIndex >= -1 && self.fillOverlay.selection.left <= columnIndex && self.fillOverlay.selection.right >= columnIndex && self.fillOverlay.selection.top <= rowIndex && self.fillOverlay.selection.bottom >= rowIndex;
    self.fillOverlay.minX = clippingRect.x;
    self.fillOverlay.minY = clippingRect.y;
    self.fillOverlay.x = Math.max(clippingRect.x, e.clientX);
    self.fillOverlay.y = Math.max(clippingRect.y, e.clientY); // If we are in the selection bounds, allow user to change directions.

    if (isInSelectionBounds) {
      self.fillOverlay.lastInBoundsLocation = {
        x: e.clientX,
        y: e.clientY
      };
    } else if (self.fillOverlay.lastInBoundsLocation || !self.fillOverlay.direction) {
      var lastInBoundsLocation = self.fillOverlay.lastInBoundsLocation;
      self.fillOverlay.lastInBoundsLocation = undefined;
      var x = lastInBoundsLocation ? lastInBoundsLocation.x : self.fillOverlay.handle.x;
      var y = lastInBoundsLocation ? lastInBoundsLocation.y : self.fillOverlay.handle.y;
      var dx = Math.abs(e.clientX - x);
      var dy = Math.abs(e.clientY - y);

      if (dx > 5 || dy > 5) {
        self.fillOverlay.direction = dx > dy ? 'x' : 'y';
      }
    }

    if (rowIndex >= 0) {
      self.fillOverlay.rowIndex = rowIndex;
    }

    if (columnIndex >= 0) {
      self.fillOverlay.columnIndex = columnIndex;

      if (rowIndex === -1 && self.visibleRows.length) {
        self.fillOverlay.rowIndex = self.visibleRows[0];
      }
    }

    if (rowIndex >= -1 && columnIndex >= -1) {
      self.fillOverlay.snap = self.currentCell;
    } else {
      self.fillOverlay.snap = undefined;
    }
  };

  self.stopSelectionHandleMove = function (e) {
    if (!self.fillOverlay.handle) {
      return false;
    }

    self.ignoreNextClick = true;
    window.removeEventListener('mousemove', self.selectionHandleMove, false);
    window.removeEventListener('mouseup', self.stopSelectionHandleMove, false);
    var overlay = self.fillOverlay;
    var selectionIndex = self.getSelectionIndex();
    var bounds = overlay.selection;
    if (!selectionIndex) return;
    self.movingSelectionHandle = undefined;
    self.fillOverlay = {};

    if (overlay.rowIndex >= 0 && overlay.columnIndex >= 0) {
      var boundsOld = _objectSpread({}, bounds);

      var isVertical = overlay.direction === 'y';
      var isHorizontal = overlay.direction === 'x';
      var startRow,
          rowLength,
          startColumn,
          columnLength,
          reverseVertically = false,
          reverseHorizontally = false;

      if (isVertical) {
        if (overlay.rowIndex < bounds.top) {
          bounds.top = overlay.rowIndex;
          reverseVertically = true;
        } else if (overlay.rowIndex > bounds.bottom) {
          bounds.bottom = overlay.rowIndex;
        }

        startRow = bounds.top < boundsOld.top ? bounds.top : boundsOld.bottom + 1;
        rowLength = bounds.top < boundsOld.top ? boundsOld.top - bounds.top : bounds.bottom - boundsOld.bottom;
        startColumn = selectionIndex.column;
        columnLength = selectionIndex.columnLength;
      } else if (isHorizontal) {
        if (overlay.columnIndex < bounds.left) {
          bounds.left = overlay.columnIndex;
          reverseHorizontally = true;
        } else if (overlay.columnIndex > bounds.right) {
          bounds.right = overlay.columnIndex;
        }

        startColumn = bounds.left < boundsOld.left ? bounds.left : boundsOld.right + 1;
        columnLength = bounds.left < boundsOld.left ? boundsOld.left - bounds.left : bounds.right - boundsOld.right;
        startRow = selectionIndex.row;
        rowLength = selectionIndex.rowLength;
      }

      if (bounds.left <= bounds.right && bounds.top <= bounds.bottom && (bounds.left < boundsOld.left || bounds.top < boundsOld.top || bounds.right > boundsOld.right || bounds.bottom > boundsOld.bottom)) {
        var schema = self.getSchema();
        var rows = [];

        for (var rowIndex = 0; rowIndex < Math.min(rowLength, selectionIndex.rowLength); rowIndex++) {
          var rowData = self.viewData[selectionIndex.row + rowIndex];
          rows[rowIndex] = [];

          for (var columnIndex = 0; columnIndex < Math.min(columnLength, selectionIndex.columnLength); columnIndex++) {
            var column = schema[selectionIndex.column + columnIndex];
            if (!column) continue;
            var cellData = rowData[column.name];
            rows[rowIndex][columnIndex] = cellData;
          }
        }

        self.insert({
          rows: rows,
          startRowIndex: startRow,
          startColumnIndex: startColumn,
          minRowsLength: rowLength,
          minColumnsLength: columnLength,
          reverseRows: reverseVertically,
          reverseColumns: reverseHorizontally,
          clearSelections: false,
          alwaysFilling: true,
          direction: isHorizontal ? 'horizontal' : 'vertical'
        });
        self.draw();
      }
    }

    return true;
  };

  return;
}

/***/ }),

/***/ "./lib/events/util.js":
/*!****************************!*\
  !*** ./lib/events/util.js ***!
  \****************************/
/*! namespace exports */
/*! export createHTMLString [provided] [no usage info] [missing usage info prevents renaming] */
/*! export createTextString [provided] [no usage info] [missing usage info prevents renaming] */
/*! export htmlSafe [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isSupportedHtml [provided] [no usage info] [missing usage info prevents renaming] */
/*! export parseData [provided] [no usage info] [missing usage info prevents renaming] */
/*! export parseHtmlTable [provided] [no usage info] [missing usage info prevents renaming] */
/*! export parseHtmlText [provided] [no usage info] [missing usage info prevents renaming] */
/*! export parseText [provided] [no usage info] [missing usage info prevents renaming] */
/*! export sanitizeElementData [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTextString": function() { return /* binding */ createTextString; },
/* harmony export */   "createHTMLString": function() { return /* binding */ createHTMLString; },
/* harmony export */   "isSupportedHtml": function() { return /* binding */ isSupportedHtml; },
/* harmony export */   "htmlSafe": function() { return /* binding */ htmlSafe; },
/* harmony export */   "parseData": function() { return /* binding */ parseData; },
/* harmony export */   "parseHtmlTable": function() { return /* binding */ parseHtmlTable; },
/* harmony export */   "parseHtmlText": function() { return /* binding */ parseHtmlText; },
/* harmony export */   "parseText": function() { return /* binding */ parseText; },
/* harmony export */   "sanitizeElementData": function() { return /* binding */ sanitizeElementData; }
/* harmony export */ });


function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var isSupportedHtml = function isSupportedHtml(pasteValue) {
  // We need to match new lines in the HTML, .* won't match new line characters.
  // `s` regex modifier can't be used with `ecmaVersion === 2017`.
  // As a workaround using [\s\S]*. Fix when we upgrade `ecmaVersion`.
  var genericDiv = /(?:^(<meta[^>]*>)?[\s\S]*<div[^>]*>)/;
  var genericSpan = /(?:^(<meta[^>]*>)?[\s\S]*<span[^>]*>)/;
  var genericTable = /(?:^(<meta[^>]*>)?[\s\S]*<table[^>]*>)/; // Matches Google Sheets format clipboard data format too.

  var excelTable = /(?:<!--StartFragment-->[\s\S]*<tr[^>]*>)/;
  var excelTableRow = /(?:<!--StartFragment-->[\s\S]*<td[^>]*>)/;
  return [genericDiv, genericTable, genericSpan, excelTable, excelTableRow].some(function (expression) {
    return expression.test(pasteValue);
  });
}; // Explanation of nodeType here: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType


var IGNORE_NODETYPES = [8, 3]; // '#text' and '#comment'

var isHtmlTable = function isHtmlTable(pasteValue) {
  return /(?:<table[^>]*>)|(?:<tr[^]*>)/.test(pasteValue);
};

var sanitizeElementData = function sanitizeElementData(element) {
  // It is not entirely clear if this check on nodeType is required.
  var elementData = element.nodeType === 1 ? element.innerText : element.data;
  return String(elementData).replace(/\s+/g, ' ').trim();
};

var parseHtmlText = function parseHtmlText(data) {
  var doc = new DOMParser().parseFromString(data, 'text/html');
  var element = doc.querySelector('div') || doc.querySelector('span');
  var elementData = sanitizeElementData(element);
  return elementData.split('\n').map(function (item) {
    return item.split('\t').map(function (value) {
      return {
        value: [{
          value: value
        }]
      };
    });
  });
};

var parseHtmlTable = function parseHtmlTable(data) {
  var doc = new DOMParser().parseFromString(data, 'text/html');
  var trs = doc.querySelectorAll('table tr');
  var rows = [];

  var _iterator = _createForOfIteratorHelper(trs),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var tr = _step.value;
      var row = [];

      var _iterator2 = _createForOfIteratorHelper(tr.childNodes),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var childNode = _step2.value;
          if (IGNORE_NODETYPES.includes(childNode.nodeType)) continue;
          var col = {
            value: []
          };
          var value = sanitizeElementData(childNode);
          if (value) col.value.push({
            value: value
          });
          row.push(col);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      rows.push(row);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return rows;
};

var parseText = function parseText(data) {
  return data.split('\n').map(function (item) {
    return item.split('\t').map(function (value) {
      return {
        value: [{
          value: value
        }]
      };
    });
  });
};

var parseData = function parseData(data, mimeType) {
  if (mimeType === 'text/html' && isHtmlTable(data)) {
    return parseHtmlTable(data);
  } else if (mimeType === 'text/html') {
    return parseHtmlText(data);
  } // Default data format is string, so split on new line,
  // and then enclose in an array (a row with one cell):


  return parseText(data);
};

var htmlSafe = function htmlSafe(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

var createTextString = function createTextString(selectedData, isNeat) {
  // Selected like [[0, 1], [0, 1]] of [[0, 3]] is neat; Selected like [[0, 1], [1, 2]] is untidy.
  // If not isNeat we just return a simple string of concatenated values.
  if (!isNeat) return selectedData.map(function (row) {
    return Object.values(row).join('');
  }).join(''); // If isNeat, we can create tab separated mutti-line text.

  return selectedData.map(function (row) {
    return Object.values(row).join('\t');
  }).join('\n');
};

var createHTMLString = function createHTMLString(selectedData, isNeat) {
  if (!isNeat) return createTextString(selectedData, isNeat); // If isNeat, we can create a HTML table with the selected data.

  var htmlString = '<table>';
  htmlString += selectedData.map(function (row) {
    return '<tr>' + Object.values(row).map(function (value) {
      return ['<td>', htmlSafe(value), '</td>'].join('');
    }).join('') + '</tr>';
  }).join('');
  htmlString += '</table>';
  return htmlString;
};



/***/ }),

/***/ "./lib/groups/util.js":
/*!****************************!*\
  !*** ./lib/groups/util.js ***!
  \****************************/
/*! namespace exports */
/*! export mergeHiddenRowRanges [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mergeHiddenRowRanges": function() { return /* binding */ mergeHiddenRowRanges; }
/* harmony export */ });

/**
 * Merge a new hidden row range into existed ranges array
 * @param {any[]} hiddenRowRanges tuples: Array<[bgeinRowIndex, endRowIndex]>
 * @param {number[]} newRange tuple: [beginRowIndex, endRowIndex]
 * @returns {boolean}
 */

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var mergeHiddenRowRanges = function mergeHiddenRowRanges(hiddenRowRanges, newRange) {
  var _newRange = _slicedToArray(newRange, 2),
      beginRowIndex = _newRange[0],
      endRowIndex = _newRange[1];

  if (endRowIndex < beginRowIndex) return false;
  var inserted = false;

  for (var i = 0; i < hiddenRowRanges.length; i++) {
    var range = hiddenRowRanges[i];
    if (beginRowIndex > range[1] + 1) continue;

    if (beginRowIndex <= range[0] && endRowIndex >= range[0]) {
      hiddenRowRanges[i] = [beginRowIndex, Math.max(endRowIndex, range[1])];
      inserted = true;
      break;
    }

    if (beginRowIndex >= range[0]) {
      hiddenRowRanges[i] = [range[0], Math.max(endRowIndex, range[1])];
      inserted = true;
      break;
    }
  }

  if (!inserted) hiddenRowRanges.push([beginRowIndex, endRowIndex]); // merge intersections after sorting ranges

  hiddenRowRanges.sort(function (a, b) {
    return a[0] - b[0];
  });

  for (var _i2 = 0; _i2 < hiddenRowRanges.length - 1; _i2++) {
    var _range = hiddenRowRanges[_i2];
    var nextRange = hiddenRowRanges[_i2 + 1];

    if (nextRange[0] <= _range[1] + 1) {
      hiddenRowRanges[_i2] = [_range[0], Math.max(_range[1], nextRange[1])];
      hiddenRowRanges.splice(_i2 + 1, 1);
      _i2--;
    }
  }

  return true;
};



/***/ }),

/***/ "./lib/intf.js":
/*!*********************!*\
  !*** ./lib/intf.js ***!
  \*********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _events_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events/util */ "./lib/events/util.js");
/*jslint browser: true, unparam: true, todo: true*/

/*globals HTMLElement: false, Reflect: false, define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(self, ctor) {
  self.scale = 1;
  self.orders = {
    rows: [],
    columns: []
  };
  self.appliedInlineStyles = {};
  self.cellGridAttributes = {};
  self.treeGridAttributes = {};
  self.visibleRowHeights = [];
  self.hasFocus = false;
  self.activeCell = {
    columnIndex: 0,
    rowIndex: 0
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
    add: function add(orderBy, orderDirection, sortFunction) {
      self.orderings.columns = self.orderings.columns.filter(function (col) {
        return col.orderBy !== orderBy;
      });
      self.orderings.columns.push({
        orderBy: orderBy,
        orderDirection: orderDirection,
        sortFunction: sortFunction
      });
    },
    sort: function sort() {
      console.warn('grid.orderings.sort has been deprecated. Please use grid.refresh().');
      self.orderings.columns.forEach(function (col) {
        self.viewData.sort(col.sortFunction(col.orderBy, col.orderDirection));
      });
    }
  };
  self.columnFilters = {};
  self.filters = {};
  self.frozenRow = 0;
  self.frozenColumn = 0;
  self.ellipsisCache = {};
  self.scrollCache = {
    x: [],
    y: []
  };
  self.scrollBox = {};
  self.visibleRows = [];
  self.visibleCells = [];
  /**
   * Each item of this  array contains these properties:
   * - `x`, `y`, `x2`, `y2`
   * - `orderIndex0`, `orderIndex1`: The closed interval of the hiding rows/columns.
   * - `dir`: The directon of the unhide indicator. 'l' and 'r' for columns, 't' and 'b' for rows
   */

  self.visibleUnhideIndicators = [];
  /**
   * Each item is a tuple conatins two numbers:
   * its type difination: Array<[beginRowIndex, endRowIndex]>
   * Each tuple represents a closed Interval
   */

  self.hiddenRowRanges = [];
  /**
   * This array stored all groups information with context for drawing,
   * it is generated by drawing functions,
   * and be used for searching groups when users operate on the spreadsheet
   * Each item of this array contains these properties:
   * - `type`: its available values: 'c' and 'r'. indicates the type of this item, 'c' for column group
   *           and 'r' for row group.
   * - `x`,`y`: the left-top point of this group's rendering area.
   * - `x2`, `y2`: the right-bottom of this group's rendering area.
   * - `collapsed`: this value indicates the collapsed status of this group.
   * - `from`, `to`: The column index range of this group (We use this value for searching the group)
   * - `row`: The row index for column groups (We use this value for searching the group)
   */

  self.visibleGroups = [];
  self.sizes = {
    rows: {},
    columns: {},
    trees: {}
  };
  self.selections = [];
  self.selectedRows = [];
  self.selectedColumns = [];
  self.fillOverlay = {};
  self.filterable = {
    rows: [],
    columns: []
  };
  self.selectedFilterButton = {
    columnIndex: -1,
    rowIndex: -1
  };
  self.cellTree = {
    rows: [],
    columns: {},
    tempSchema: {},
    rowTreeColIndex: 0,
    columnTreeRowStartIndex: 0,
    columnTreeRowEndIndex: 0,
    origin: {
      rows: [],
      columns: {}
    }
  };
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
  /**
   * Array for grouped columns
   * Each item in this array is an array and it represents some grouping in one row
   * A grouping descriptor has three properties:
   * - `from`: The column index of the first column
   * - `to`: The column index of the last column
   * - `collapsed`: Is this group be collapsed
   * @example [[{ from: 1, to: 2, collapsed: false }]]
   */

  self.groupedColumns = [];
  /**
   * Array for grouped rows
   * Each item in this array is an array and it represents some grouping in one column
   * A grouping descriptor has three properties:
   * - `from`: The row index of the first row
   * - `to`: The row index of the last row
   * - `collapsed`: Is this group be collapsed
   * @example [[{ from: 1, to: 2, collapsed: false }]]
   */

  self.groupedRows = [];
  self.scrollModes = ['vertical-scroll-box', 'vertical-scroll-top', 'vertical-scroll-bottom', 'horizontal-scroll-box', 'horizontal-scroll-right', 'horizontal-scroll-left'];
  self.componentL1Events = {};
  self.eventNames = ['afterdraw', 'afterrendercell', 'afterrenderfilterbutton', 'aftercreategroup', 'attributechanged', 'beforebeginedit', 'beforecreatecellgrid', 'beforedraw', 'beforeendedit', 'beforerendercell', 'beforerendercellgrid', 'beforerenderfilterbutton', 'beginedit', 'cellmouseout', 'cellmouseover', 'click', 'collapsetree', 'columnhide', 'columnunhide', 'contextmenu', 'copy', 'datachanged', 'dblclick', 'endedit', 'expandtree', 'formatcellvalue', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseup', 'newrow', 'ordercolumn', 'rendercell', 'rendercellgrid', 'renderorderbyarrow', 'rendertext', 'rendertreearrow', 'reorder', 'reordering', 'resize', 'resizecolumn', 'resizerow', 'schemachanged', 'scroll', 'selectionchanged', 'stylechanged', 'touchcancel', 'touchend', 'touchmove', 'touchstart', 'wheel'];
  self.mouse = {
    x: 0,
    y: 0
  };

  self.getSelectedData = function (expandToRow) {
    var selectedData = [];
    var schema = self.getSchema();
    var viewDataLength = self.viewData.length;

    if (viewDataLength === 0) {
      return [];
    } // self.selections is a sparse array, so `viewRowIndex` here
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

        var orderedIndex = self.orders.columns[col];

        if (!expandToRow && schema[orderedIndex].hidden) {
          return;
        }

        if (self.viewData[viewRowIndex]) {
          selectedData[viewRowIndex][schema[orderedIndex].name] = self.viewData[viewRowIndex][schema[orderedIndex].name];
        }
      });
    });
    return selectedData;
  };

  self.getSelectedCells = function (expandToRow) {
    var selectedCells = [];
    var schema = self.getSchema();
    var viewDataLength = self.viewData.length;

    if (viewDataLength === 0) {
      return [];
    }

    var _iterator = _createForOfIteratorHelper(self.selections.entries()),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
            viewRowIndex = _step$value[0],
            row = _step$value[1];

        if (!row || row.length === 0) continue;

        var _iterator2 = _createForOfIteratorHelper(row.entries()),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                viewColumnIndex = _step2$value[1];

            if (viewColumnIndex === -1 || !schema[viewColumnIndex]) {
              continue;
            }

            var boundColumnIndex = self.getBoundColumnIndexFromViewColumnIndex(viewColumnIndex);

            if (!expandToRow && schema[boundColumnIndex].hidden) {
              continue;
            }

            if (self.viewData[viewRowIndex]) {
              var header = schema[boundColumnIndex];
              var value = self.viewData[viewRowIndex][header.name];
              var boundRowIndex = self.getBoundRowIndexFromViewRowIndex(viewRowIndex);
              var cell = {
                value: value,
                header: header,
                boundRowIndex: boundRowIndex,
                boundColumnIndex: boundColumnIndex,
                viewRowIndex: viewRowIndex,
                viewColumnIndex: viewColumnIndex
              };
              selectedCells.push(cell);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return selectedCells;
  };

  self.copySelectedCellsToClipboard = function (clipboardData) {
    var selectedData = [];
    var schema = self.getSchema();
    var firstRowAsString;
    var isNeat = true; // Selected like [[0, 1], [0, 1]] of [[0, 3]] is neat; Selected like [[0, 1], [1, 2]] is untidy

    var _iterator3 = _createForOfIteratorHelper(self.selections.entries()),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _step3$value = _slicedToArray(_step3.value, 2),
            rowIndex = _step3$value[0],
            row = _step3$value[1];

        // If no cells are selected for a particular rowIndex the selections array will contain an empty element for that rowIndex.
        if (!row) continue; // Convert to string for easy comparison to the first row.

        var rowAsString = row.join(',').toString();
        var rowDict = {};
        if (!firstRowAsString) firstRowAsString = row.join(',').toString();
        if (isNeat && rowAsString !== firstRowAsString) isNeat = false;
        var boundRowIndex = self.getBoundRowIndexFromViewRowIndex(rowIndex);

        var _iterator4 = _createForOfIteratorHelper(row),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var columnIndex = _step4.value;
            // If the whole row is selected the columnIndex for the rowHeader is -1.
            if (columnIndex < 0) continue;
            var boundColumnIndex = self.getBoundColumnIndexFromViewColumnIndex(columnIndex);
            var columnName = schema[boundColumnIndex].name;
            var value = self.originalData[boundRowIndex][columnName];
            rowDict[columnName] = value;
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        selectedData.push(rowDict);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    if (selectedData.length > 0) {
      var textString = (0,_events_util__WEBPACK_IMPORTED_MODULE_0__.createTextString)(selectedData, isNeat);
      var htmlString = (0,_events_util__WEBPACK_IMPORTED_MODULE_0__.createHTMLString)(selectedData, isNeat);
      var copiedData = {
        'text/plain': textString,
        'text/html': htmlString,
        'text/csv': textString,
        'application/json': JSON.stringify(selectedData)
      };

      for (var _i2 = 0, _Object$entries = Object.entries(copiedData); _i2 < _Object$entries.length; _i2++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
            mimeType = _Object$entries$_i[0],
            data = _Object$entries$_i[1];

        clipboardData.setData(mimeType, data);
      }
    }
  };

  self.clearSelectedCells = function () {
    var schema = self.getSchema();
    var affectedCells = [];

    var _iterator5 = _createForOfIteratorHelper(self.selections.entries()),
        _step5;

    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var _step5$value = _slicedToArray(_step5.value, 2),
            rowIndex = _step5$value[0],
            row = _step5$value[1];

        // If no cells are selected for a particular rowIndex the selections array will contain an empty element for that rowIndex.
        if (!row) continue;
        var boundRowIndex = self.getBoundRowIndexFromViewRowIndex(rowIndex);

        var _iterator6 = _createForOfIteratorHelper(row),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var columnIndex = _step6.value;
            // If the whole row is selected the columnIndex for the rowHeader is -1.
            if (columnIndex < 0) continue;
            var boundColumnIndex = self.getBoundColumnIndexFromViewColumnIndex(columnIndex);
            var columnName = schema[boundColumnIndex].name;
            self.viewData[boundRowIndex][columnName] = '';
            affectedCells.push([rowIndex, columnIndex, boundRowIndex, boundColumnIndex]);
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }

    return affectedCells;
  };

  self.getBoundRowIndexFromViewRowIndex = function (viewRowIndex) {
    if (self.boundRowIndexMap && self.boundRowIndexMap.has(viewRowIndex)) {
      return self.boundRowIndexMap.get(viewRowIndex);
    }

    return undefined;
  };

  self.getBoundColumnIndexFromViewColumnIndex = function (viewColumnIndex) {
    return self.orders.columns[viewColumnIndex];
  };
  /**
   * Get the height of the area about column groups for rendering and handling events.
   */


  self.getColumnGroupAreaHeight = function () {
    if (!self.attributes.allowGroupingColumns) {
      return 0;
    }

    var groups = self.groupedColumns.length;
    var base = self.style.columnGroupRowHeight * self.scale;
    return base * groups;
  };
  /**
   * Get the width of the area about row groups for rendering and handling events.
   */


  self.getRowGroupAreaWidth = function () {
    if (!self.attributes.allowGroupingRows) {
      return 0;
    }

    var groups = self.groupedRows.length;
    var base = self.style.rowGroupColumnWidth * self.scale;
    return base * groups;
  };

  self.getCollapsedColumnGroups = function () {
    var result = [];

    for (var rowIndex = 0; rowIndex < self.groupedColumns.length; rowIndex++) {
      var groups = self.groupedColumns[rowIndex];

      for (var groupIndex = 0; groupIndex < groups.length; groupIndex++) {
        var group = groups[groupIndex];
        if (group.collapsed) result.push(group);
      }
    }

    return result;
  };

  self.getCollapsedRowGroups = function () {
    var result = [];

    for (var rowIndex = 0; rowIndex < self.groupedRows.length; rowIndex++) {
      var groups = self.groupedRows[rowIndex];

      for (var groupIndex = 0; groupIndex < groups.length; groupIndex++) {
        var group = groups[groupIndex];
        if (group.collapsed) result.push(group);
      }
    }

    return result;
  };
  /**
   * Toggle the collapse status of a group (expanded/collapsed)
   * @param {{type:string,from:number,to:number}} group
   */


  self.toggleGroup = function (group) {
    if (group.type === 'c') {
      var from = group.from,
          to = group.to;
      /** @type {{from:number,to:number,collapsed:boolean}} */

      var matchedGroup;
      /** @type {Array<Array<{from:number,to:number,collapsed:boolean}>>} */

      var allGroups = self.groupedColumns;

      for (var i = 0; i < allGroups.length; i++) {
        var groups = allGroups[i];

        for (var gi = 0; gi < groups.length; gi++) {
          var _group = groups[gi];

          if (_group.from === from && _group.to === to) {
            matchedGroup = _group;
            break;
          }
        }

        if (matchedGroup) break;
      }

      if (!matchedGroup) return;
      var nextCollapsed = !matchedGroup.collapsed;
      matchedGroup.collapsed = nextCollapsed;
      return true;
    }

    if (group.type === 'r') {
      var _from = group.from,
          _to = group.to;
      /** @type {{from:number,to:number,collapsed:boolean}} */

      var _matchedGroup;
      /** @type {Array<Array<{from:number,to:number,collapsed:boolean}>>} */


      var _allGroups = self.groupedRows;

      for (var _i3 = 0; _i3 < _allGroups.length; _i3++) {
        var _groups = _allGroups[_i3];

        for (var _gi = 0; _gi < _groups.length; _gi++) {
          var _group2 = _groups[_gi];

          if (_group2.from === _from && _group2.to === _to) {
            _matchedGroup = _group2;
            break;
          }
        }

        if (_matchedGroup) break;
      }

      if (!_matchedGroup) return;

      var _nextCollapsed = !_matchedGroup.collapsed;

      _matchedGroup.collapsed = _nextCollapsed;
      return true;
    }

    return false;
  };

  self.isNewGroupRangeValid = function (groupsArray, from, to) {
    for (var i = 0; i < groupsArray.length; i++) {
      var groups = groupsArray[i];

      for (var gIndex = 0; gIndex < groups.length; gIndex++) {
        var group = groups[gIndex];
        if (from === group.to + 1) return false;
        if (from > group.to) continue;

        if (from === group.from) {
          if (to === group.to) return false;
          if (to > group.to) return true;
          break; // check smaller range
        }

        if (from > group.from) {
          if (to > group.to) return false;
          break; // check smaller range
        }

        if (to < group.to) return false;
        return true;
      }
    }

    return true;
  };

  self.getColumnHeaderCellHeight = function () {
    if (!self.attributes.showColumnHeaders) {
      return 0;
    }

    return (self.sizes.rows[-1] || self.style.columnHeaderCellHeight) * self.scale;
  };

  self.getRowHeaderCellWidth = function () {
    if (!self.attributes.showRowHeaders) {
      return 0;
    }

    return (self.sizes.columns[-1] || self.style.rowHeaderCellWidth) * self.scale;
  };

  self.setStorageData = function () {
    if (!self.attributes.saveAppearance || !self.attributes.name) {
      return;
    }

    var visibility = {};
    self.getSchema().forEach(function (column) {
      visibility[column.name] = !column.hidden;
    });
    localStorage.setItem(self.storageName + '-' + self.attributes.name, JSON.stringify({
      sizes: {
        rows: self.sizes.rows,
        columns: self.sizes.columns
      },
      orders: {
        rows: self.orders.rows,
        columns: self.orders.columns
      },
      orderBy: self.orderBy,
      orderDirection: self.orderDirection,
      visibility: visibility
    }));
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

  self.fitSelectedColumns = function (width) {
    var selectedColumns = self.selections[0];
    var schema = self.getSchema();

    var _iterator7 = _createForOfIteratorHelper(selectedColumns),
        _step7;

    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var selectedColumn = _step7.value;

        // Make sure the column is not the row header and that the whole column has in fact been selected.
        if (selectedColumn >= 0 && self.isColumnSelected(selectedColumn)) {
          if (isNaN(width)) {
            var column = schema[self.orders.columns[selectedColumn]];
            self.fitColumnToValues(column.name);
          } else {
            self.sizes.columns[selectedColumn] = width;
            self.dispatchEvent('resizecolumn', {
              x: width,
              y: self.resizingStartingHeight,
              draggingItem: self.currentCell
            });
          }
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
  };

  self.getVisibleSchema = function () {
    return self.getSchema().filter(function (col) {
      return !col.hidden;
    });
  };

  self.applyDefaultValue = function (row, header, rowIndex) {
    var d = header.defaultValue || '';

    if (typeof d === 'function') {
      d = d.apply(self.intf, [header, rowIndex]);
    }

    row[header.name] = d;
  };

  self.createNewRowData = function () {
    self.newRow = {}; // The third argument of applyDefaultValue is the row index
    // of the row for which to apply the default value. In this
    // case, we're creating a new row but not yet appending it
    // to self.originalData, so no row index exists

    var newRowIndex = undefined;
    self.getSchema().forEach(function forEachHeader(header) {
      self.applyDefaultValue(self.newRow, header, newRowIndex);
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
      console.warn('Cannot find filter for type %s, falling back to substring match.', type);
      f = self.filters.string;
    }

    return f;
  };

  self.hasActiveFilters = function () {
    return self.columnFilters && Object.keys(self.columnFilters).length > 0;
  };

  self.hasCollapsedRowGroup = function () {
    for (var i = 0; i < self.groupedRows.length; i++) {
      var groups = self.groupedRows[i];

      for (var j = 0; j < groups.length; j++) {
        var g = groups[j];
        if (g.collapsed) return true;
      }
    }

    return false;
  };

  self.getFilteredAndSortedViewData = function (originalData) {
    // We make a copy of originalData here in order be able to
    // filter and sort rows without modifying the original array.
    // Each row is turned into a (row, rowIndex) tuple
    // so that when we apply filters, we can refer back to the
    // row's original row number in originalData. This becomes
    // useful when emitting cell events.
    var newViewData = originalData.map(function (row, originalRowIndex) {
      return [row, originalRowIndex];
    }); // Remove hidden rows here. So we can keep the bound indexes correct

    if (self.hiddenRowRanges.length > 0) {
      var ranges = self.hiddenRowRanges.sort(function (a, b) {
        return b[1] - a[1];
      });

      for (var i = 0; i < ranges.length; i++) {
        var _ranges$i = _slicedToArray(ranges[i], 2),
            beginRowIndex = _ranges$i[0],
            endRowIndex = _ranges$i[1];

        var countOfRows = endRowIndex - beginRowIndex + 1;
        newViewData.splice(beginRowIndex, countOfRows);
      }
    } // Apply filtering


    var _loop = function _loop() {
      var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i4], 2),
          headerName = _Object$entries2$_i[0],
          filterText = _Object$entries2$_i[1];

      var header = self.getHeaderByName(headerName);

      if (!header) {
        return "continue";
      }

      var currentFilterFunction = header.filter || self.filter(header.type || 'string');
      newViewData = newViewData.filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            row = _ref2[0],
            originalRowIndex = _ref2[1];

        if (self.attributes.allowFreezingRows && !self.attributes.filterFrozenRows && originalRowIndex < self.frozenRow) return true;
        return currentFilterFunction(row[headerName], filterText);
      });
    };

    for (var _i4 = 0, _Object$entries2 = Object.entries(self.columnFilters); _i4 < _Object$entries2.length; _i4++) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    } //#region Hide rows from collapsed group

    /** @type {number[][]} */


    var collapsedGroups = [];

    for (var _i5 = 0; _i5 < self.groupedRows.length; _i5++) {
      var rows = self.groupedRows[_i5];

      for (var j = 0; j < rows.length; j++) {
        var r = rows[j];
        if (!r.collapsed) continue;
        collapsedGroups.push([r.from, r.to]);
      }
    }

    if (collapsedGroups.length > 0) {
      //#region merge groups
      collapsedGroups.sort(function (a, b) {
        return a[0] - b[0];
      });
      var newLen = 0;
      var len = collapsedGroups.length;

      for (var _i6 = 0; _i6 < len; _i6++) {
        var _r = collapsedGroups[_i6];

        if (_i6 === len - 1) {
          collapsedGroups[newLen++] = _r;
          break;
        }

        var to = _r[1];

        var _collapsedGroups = _slicedToArray(collapsedGroups[_i6 + 1], 2),
            from2 = _collapsedGroups[0],
            to2 = _collapsedGroups[1];

        if (from2 > to + 1) {
          collapsedGroups[newLen++] = _r;
          continue;
        }

        collapsedGroups[_i6 + 1] = _r;
        if (to2 > to) collapsedGroups[_i6 + 1][1] = to2;
      }

      collapsedGroups = collapsedGroups.slice(0, newLen); //#endregion merge groups
      //#region omit rows by groups

      var g = collapsedGroups.shift();

      for (var start = 0; start < newViewData.length; start++) {
        var it = newViewData[start][1];
        if (it < g[0]) continue;
        var end = start + 1;

        for (; end < newViewData.length; end++) {
          var it2 = newViewData[end][1];
          if (it2 > g[1]) break;
        }

        newViewData.splice(start, end - start);
        g = collapsedGroups.shift();
        if (!g) break;
        start--;
      } //#endregion omit rows by groups

    } //#endregion Hide rows from collapsed group
    // Apply sorting


    var _iterator8 = _createForOfIteratorHelper(self.orderings.columns),
        _step8;

    try {
      var _loop2 = function _loop2() {
        var column = _step8.value;
        var sortFn = column.sortFunction(column.orderBy, column.orderDirection);
        newViewData.sort(function (_ref7, _ref8) {
          var _ref9 = _slicedToArray(_ref7, 1),
              rowA = _ref9[0];

          var _ref10 = _slicedToArray(_ref8, 2),
              rowB = _ref10[0],
              rowIndexB = _ref10[1];

          if (self.attributes.allowFreezingRows && !self.attributes.sortFrozenRows && rowIndexB < self.frozenRow) return 0;
          return sortFn(rowA, rowB);
        });
      };

      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        _loop2();
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }

    return {
      viewData: newViewData.map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1),
            row = _ref4[0];

        return row;
      }),
      boundRowIndexMap: new Map(newViewData.map(function (_ref5, viewRowIndex) {
        var _ref6 = _slicedToArray(_ref5, 2),
            _row = _ref6[0],
            originalRowIndex = _ref6[1];

        return [viewRowIndex, originalRowIndex];
      }))
    };
  };

  self.refresh = function () {
    var _self$getFilteredAndS = self.getFilteredAndSortedViewData(self.originalData),
        viewData = _self$getFilteredAndS.viewData,
        boundRowIndexMap = _self$getFilteredAndS.boundRowIndexMap;

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
      if (data[x] !== undefined && data[x] !== null && [null, undefined].indexOf(data[x][columnName]) !== -1) {
        t = _typeof(data[x]);
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

    if (x !== -1) {
      if (x > self.width - self.attributes.selectionScrollZone) {
        self.scrollBox.scrollLeft += self.attributes.selectionScrollIncrement;
        setTimer = true;
      }

      if (x - self.attributes.selectionScrollZone - rowHeaderCellWidth < 0) {
        self.scrollBox.scrollLeft -= self.attributes.selectionScrollIncrement;
        setTimer = true;
      }
    }

    if (y !== -1) {
      if (y > self.height - self.attributes.selectionScrollZone) {
        self.scrollBox.scrollTop += self.attributes.selectionScrollIncrement;
        setTimer = true;
      }

      if (y - self.attributes.selectionScrollZone - columnHeaderCellHeight < 0) {
        self.scrollBox.scrollTop -= self.attributes.selectionScrollIncrement;
        setTimer = true;
      }
    }

    if (setTimer && !ctrl && self.currentCell && self.currentCell.columnIndex !== -1) {
      self.scrollTimer = setTimeout(self.mousemove, self.attributes.scrollRepeatRate, e);
    }
  };

  self.validateColumn = function (c, s) {
    if (!c.name) {
      throw new Error('A column must contain at least a name.');
    }

    if (s.filter(function (i) {
      return i.name === c.name;
    }).length > 0) {
      throw new Error('A column with the name ' + c.name + ' already exists and cannot be added again.');
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
        self.sizes.columns[colIndex] = Math.max(self.findColumnMaxTextLength(col.name), self.style.minColumnWidth);
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
    window.removeEventListener('mouseup', self.mouseup, false);
    window.removeEventListener('mousemove', self.mousemove);
    window.removeEventListener('resize', self.resize);

    if (self.observer && self.observer.disconnect) {
      self.observer.disconnect();
    }
  };

  self.tryLoadStoredSettings = function () {
    var s;
    self.reloadStoredValues();

    if (self.storedSettings && _typeof(self.storedSettings.orders) === 'object' && self.storedSettings.orders !== null) {
      if (self.storedSettings.orders.rows.length >= (self.viewData || []).length) {
        self.orders.rows = self.storedSettings.orders.rows;
      }

      s = self.getSchema();

      if (self.storedSettings.orders.columns.length === s.length) {
        self.orders.columns = self.storedSettings.orders.columns;
      }

      self.orderBy = self.storedSettings.orderBy === undefined ? s[0].name : self.storedSettings.orderBy;
      self.orderDirection = self.storedSettings.orderDirection === undefined ? 'asc' : self.storedSettings.orderDirection;

      if (self.storedSettings.orderBy !== undefined && self.getHeaderByName(self.orderBy) && self.orderDirection) {
        self.order(self.orderBy, self.orderDirection);
      }
    }
  };

  self.toggleCollapseTree = function (rowIndex, columnIndex, type) {
    var tempData = [];
    var collapsedCount = 0;

    if (columnIndex == self.cellTree.rowTreeColIndex && (rowIndex > 0 || rowIndex == 0 && self.cellTree.rows[0].icon)) {
      var ctr = self.cellTree.rows;

      switch (type) {
        case 'Expand':
          ctr[rowIndex].expand = true;
          self.cellTree.origin.rows[ctr[rowIndex].index].expand = true;
          break;

        case 'Collapse':
          ctr[rowIndex].expand = false;
          self.cellTree.origin.rows[ctr[rowIndex].index].expand = false;
          break;

        default:
          ctr[rowIndex].expand = !ctr[rowIndex].expand;
          self.cellTree.origin.rows[ctr[rowIndex].index].expand = ctr[rowIndex].expand;
      }

      for (var ri = ctr[rowIndex].index + 1; ri <= ctr[rowIndex].lastchild; ri++) {
        var orTree = self.cellTree.origin.rows[ri];

        if (ctr[rowIndex].expand) {
          orTree.hide = false;
          if (orTree.icon && !orTree.expand) ri = orTree.lastchild;
        } else {
          orTree.hide = true;
        }
      }
    } else if (self.cellTree.columns[rowIndex]) {
      var ctc = self.cellTree.columns[rowIndex];

      switch (type) {
        case 'Expand':
          ctc[columnIndex].expand = true;
          break;

        case 'Collapse':
          ctc[columnIndex].expand = false;
          break;

        default:
          ctc[columnIndex].expand = !ctc[columnIndex].expand;
      }

      for (var ci = ctc[columnIndex].index + 1; ci <= ctc[columnIndex].lastchild; ci++) {
        if (ctc[columnIndex].expand) self.cellTree.tempSchema[ci].hidden = false;else self.cellTree.tempSchema[ci].hidden = true;
      }

      var rc = 0,
          _ri;

      if (ctc[columnIndex].expand) {
        while (rc < ctc[columnIndex].child) {
          _ri = rowIndex + rc + 1;

          for (var _ci = ctc[columnIndex].index; _ci <= ctc[columnIndex].lastchild; _ci++) {
            if (self.cellTree.origin.columns[_ri] && self.cellTree.origin.columns[_ri][_ci].icon && !self.cellTree.origin.columns[_ri][_ci].expand) {
              for (var si = _ci + 1; si <= self.cellTree.origin.columns[_ri][_ci].lastchild; si++) {
                self.cellTree.tempSchema[si].hidden = true;
              }
            }
          }

          rc++;
        }
      }
    }

    var otherData = {};
    var collapsed = [];
    self.cellTree.rows = [];
    self.cellTree.columns = {};

    for (var k in self.cellTree.origin.rows) {
      var tempRow = [];
      var tree = self.cellTree.origin.rows[k];

      if (!tree.hide) {
        var colTrees = [];
        var collapsedColCount = 0;

        if (k < self.cellTree.columnTreeRowStartIndex) {
          tempData.push(self.originalData[k]);
        } else {
          if (k > self.cellTree.columnTreeRowEndIndex) {
            otherData[k] = self.viewData[k];
            collapsedCount++;
          } else {
            for (var l = 0; l < self.originalData[k].length; l++) {
              if (!self.cellTree.tempSchema[l].hidden) {
                if (l < self.cellTree.rowTreeColIndex) {
                  if (!Object.prototype.hasOwnProperty.call(otherData, k)) otherData[k] = [];
                  otherData[k].push(self.viewData[k][l]);
                }

                tempRow.push(self.originalData[k][l]);
                if (Object.prototype.hasOwnProperty.call(self.cellTree.origin.columns, k)) colTrees.push(self.cellTree.origin.columns[k][l]);
              } else collapsedColCount++;
            }

            tempRow.push.apply(tempRow, _toConsumableArray(Array(collapsedColCount).fill().map(function () {
              return '';
            })));

            if (colTrees.length) {
              colTrees.push.apply(colTrees, _toConsumableArray(Array(collapsedColCount).fill().map(function () {
                return {};
              })));
              self.cellTree.columns[k] = colTrees;
            }

            tempData.push(tempRow);
          }
        }

        self.cellTree.rows.push(tree);
      } else {
        for (var _l = 0; _l < self.cellTree.rowTreeColIndex; _l++) {
          tempRow.push(self.viewData[k][_l]);
        }

        otherData[k] = tempRow;
        collapsed.push(Array(self.viewData[0].length).fill().map(function () {
          return '';
        }));
        collapsedCount++;
      }
    }

    if (collapsedCount) {
      var _self$cellTree$rows;

      (_self$cellTree$rows = self.cellTree.rows).push.apply(_self$cellTree$rows, _toConsumableArray(Array(collapsedCount).fill().map(function (u, index) {
        return {
          index: self.cellTree.rows.length + index
        };
      })));

      tempData.push.apply(tempData, collapsed);
    }

    for (var _k in otherData) {
      if (_k > self.cellTree.columnTreeRowEndIndex) tempData[_k] = otherData[_k];else for (var _l2 in otherData[_k]) {
        tempData[_k][_l2] = otherData[_k][_l2];
      }
    }

    self.viewData = tempData;
  };

  self.cellTreeExpandCollapse = function (rowIndex, columnIndex, type) {
    if (columnIndex == self.cellTree.rowTreeColIndex && (rowIndex > 0 || rowIndex == 0 && self.cellTree.rows[0].icon)) {
      var ctr = self.cellTree.rows;

      switch (type) {
        case 'Expand':
          ctr[rowIndex].expand = true;
          break;

        case 'Collapse':
          ctr[rowIndex].expand = false;
          break;

        default:
          ctr[rowIndex].expand = !ctr[rowIndex].expand;
      }

      for (var ri = rowIndex + 1; ri <= ctr[rowIndex].lastchild; ri++) {
        if (ctr[rowIndex].expand) {
          ctr[ri].hide = false;
          if (ctr[ri].icon && !ctr[ri].expand) ri = ctr[ri].lastchild;
        } else {
          ctr[ri].hide = true;
        }
      }
    } else if (self.cellTree.columns[rowIndex]) {
      var ctc = self.cellTree.columns[rowIndex];

      switch (type) {
        case 'Expand':
          ctc[columnIndex].expand = true;
          break;

        case 'Collapse':
          ctc[columnIndex].expand = false;
          break;

        default:
          ctc[columnIndex].expand = !ctc[columnIndex].expand;
      }

      for (var ci = columnIndex + 1; ci <= ctc[columnIndex].lastchild; ci++) {
        if (ctc[columnIndex].expand) self.tempSchema[ci].hidden = false;else self.tempSchema[ci].hidden = true;
      }

      var rc = 0,
          _ri2;

      if (ctc[columnIndex].expand) {
        while (rc < ctc[columnIndex].child) {
          _ri2 = rowIndex + rc + 1;

          for (var _ci2 = columnIndex; _ci2 <= ctc[columnIndex].lastchild; _ci2++) {
            if (self.cellTree.columns[_ri2] && self.cellTree.columns[_ri2][_ci2].icon && !self.cellTree.columns[_ri2][_ci2].expand) {
              for (var si = _ci2 + 1; si <= self.cellTree.columns[_ri2][_ci2].lastchild; si++) {
                self.tempSchema[si].hidden = true;
              }
            }
          }

          rc++;
        }
      }
    }
  };

  self.initCellTreeSettings = function () {
    if (self.viewData === undefined) return;

    if (self.attributes.rowTree.length > 0 && self.viewData.length > 0) {
      self.cellTree.rows = Array(self.viewData.length).fill().map(function (u, index) {
        return {
          index: index
        };
      });
      self.cellTree.rowTreeColIndex = self.attributes.rowTreeColIndex;
      var invalidRowTree = false;

      var _iterator9 = _createForOfIteratorHelper(self.attributes.rowTree),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var rt = _step9.value;

          if (self.cellTree.rows.length <= rt.end) {
            invalidRowTree = true;
            break;
          }

          for (var ri = rt.begin; ri <= rt.end; ri++) {
            if (ri == rt.begin) {
              self.cellTree.rows[ri].icon = true;
              self.cellTree.rows[ri].lastchild = rt.end;
              self.cellTree.rows[ri].expand = true;
              if (!self.cellTree.rows[ri].parentCount) self.cellTree.rows[ri].parentCount = 0;
            } else {
              self.cellTree.rows[ri].hide = false;
              self.cellTree.rows[ri].parentIndex = rt.begin;
              if (self.cellTree.rows[ri] && self.cellTree.rows[ri].parentCount) self.cellTree.rows[ri].parentCount += 1;else self.cellTree.rows[ri].parentCount = 1;
            }
          }
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      if (invalidRowTree) self.cellTree.rows = {};
    }

    if (self.attributes.columnTree.length > 0 && self.viewData.length > 0) {
      self.cellTree.columnTreeRowStartIndex = self.attributes.columnTreeRowStartIndex;
      self.cellTree.columnTreeRowEndIndex = self.attributes.columnTreeRowEndIndex;
      var dataColumnLength = Object.keys(self.viewData[0]).length;
      var invalidColumnTree = false;

      var _iterator10 = _createForOfIteratorHelper(self.attributes.columnTree),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var ct = _step10.value;

          if (dataColumnLength <= ct.end) {
            invalidColumnTree = true;
            break;
          }

          if (!self.cellTree.columns[ct.row]) self.cellTree.columns[ct.row] = Array(dataColumnLength).fill().map(function (u, index) {
            return {
              index: index
            };
          });

          for (var i = ct.begin; i <= ct.end; i++) {
            var ctc = self.cellTree.columns[ct.row][i];

            if (i == ct.begin) {
              ctc.icon = true;
              ctc.lastchild = ct.end;
              ctc.length = ct.end - ct.begin;
              ctc.expand = true;
              if (ct.child) ctc.child = ct.child;else ctc.child = 0;
            }
          }
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }

      self.cellTree.tempSchema = Array(dataColumnLength).fill().map(function () {
        return {
          hidden: false
        };
      });
      if (invalidColumnTree) self.cellTree.columns = {};
    }

    self.cellTree.origin = {
      rows: self.cellTree.rows,
      columns: self.cellTree.columns
    };
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
    } // when inheriting styles from already instantiated grids, don't parse already parsed values.


    if (key === 'moveOverlayBorderSegments' && typeof self.style[key] === 'string') {
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
    var isDim = ['height', 'width', 'minHeight', 'minWidth', 'maxHeight', 'maxWidth'].indexOf(key) !== -1;

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
      self.dispatchEvent('stylechanged', {
        name: 'style',
        value: value
      });
    }
  };

  self.reloadStoredValues = function () {
    if (self.attributes.name && self.attributes.saveAppearance) {
      try {
        self.storedSettings = localStorage.getItem(self.storageName + '-' + self.attributes.name);
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
        if (_typeof(self.storedSettings.sizes) === 'object' && self.storedSettings.sizes !== null) {
          self.sizes.rows = self.storedSettings.sizes.rows;
          self.sizes.columns = self.storedSettings.sizes.columns;
          ['trees', 'columns', 'rows'].forEach(function (i) {
            if (!self.sizes[i]) {
              self.sizes[i] = {};
            }
          });
        }

        if (_typeof(self.storedSettings.visibility) === 'object') {
          self.getSchema().forEach(function (column) {
            if (self.storedSettings.visibility && self.storedSettings.visibility[column.name] !== undefined) {
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
    self.pointerLockPosition = {
      x: 0,
      y: 0
    };
    Object.keys(self.style).forEach(self.parseStyleValue);
    self.intf.moveSelection = self.moveSelection;
    self.intf.deleteSelectedData = self.deleteSelectedData;
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
    self.intf.addButton = self.addButton;
    self.intf.toggleCellCollapseTree = self.toggleCellCollapseTree;
    self.intf.expandCollapseCellTree = self.expandCollapseCellTree;
    self.intf.getHeaderByName = self.getHeaderByName;
    self.intf.findColumnScrollLeft = self.findColumnScrollLeft;
    self.intf.findRowScrollTop = self.findRowScrollTop;
    self.intf.fitColumnToValues = self.fitColumnToValues;
    self.intf.findColumnMaxTextLength = self.findColumnMaxTextLength;
    self.intf.disposeContextMenu = self.disposeContextMenu;
    self.intf.getCellAt = self.getCellAt;
    self.intf.groupColumns = self.groupColumns;
    self.intf.groupRows = self.groupRows;
    self.intf.removeGroupColumns = self.removeGroupColumns;
    self.intf.removeGroupRows = self.removeGroupRows;
    self.intf.toggleGroupColumns = self.toggleGroupColumns;
    self.intf.toggleGroupRows = self.toggleGroupRows;
    self.intf.getGroupsColumnBelongsTo = self.getGroupsColumnBelongsTo;
    self.intf.getGroupsRowBelongsTo = self.getGroupsRowBelongsTo;
    self.intf.isCellVisible = self.isCellVisible;
    self.intf.isRowVisible = self.isRowVisible;
    self.intf.isColumnVisible = self.isColumnVisible;
    self.intf.order = self.order;
    self.intf.draw = self.draw;
    self.intf.refresh = self.refresh;
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
    self.intf.cut = self.cut;
    self.intf.paste = self.paste;
    self.intf.setStyleProperty = self.setStyleProperty;
    self.intf.hideColumns = self.hideColumns;
    self.intf.unhideColumns = self.unhideColumns;
    self.intf.hideRows = self.hideRows;
    self.intf.unhideRows = self.unhideRows;
    Object.defineProperty(self.intf, 'defaults', {
      get: function get() {
        return {
          styles: self.defaults.styles.reduce(function (a, i) {
            a[i[0]] = i[1];
            return a;
          }, {}),
          attributes: self.defaults.attributes.reduce(function (a, i) {
            a[i[0]] = i[1];
            return a;
          }, {})
        };
      }
    });
    self.styleKeys = Object.keys(self.intf.defaults.styles);
    self.styleKeys.map(function (i) {
      return self.hyphenateProperty(i, false);
    }).forEach(addStyleKeyIfNoneExists);
    self.styleKeys.map(function (i) {
      return self.hyphenateProperty(i, true);
    }).forEach(addStyleKeyIfNoneExists);
    self.DOMStyles = window.getComputedStyle(document.body, null);
    self.styleKeys.concat(Object.keys(self.DOMStyles)).forEach(function (key) {
      // unless this line is here, Object.keys() will not work on <instance>.style
      publicStyleKeyIntf[key] = undefined;
      Object.defineProperty(publicStyleKeyIntf, key, {
        get: function get() {
          return self.getStyleProperty(key);
        },
        set: function set(value) {
          if (self.initialized) {
            self.appliedInlineStyles[key] = value;
          }

          self.setStyleProperty(key, value);
        }
      });
    });
    Object.defineProperty(self.intf, 'shadowRoot', {
      get: function get() {
        return self.shadowRoot;
      }
    });
    Object.defineProperty(self.intf, 'activeCell', {
      get: function get() {
        return self.activeCell;
      }
    });
    Object.defineProperty(self.intf, 'hasFocus', {
      get: function get() {
        return self.hasFocus;
      }
    });
    Object.defineProperty(self.intf, 'hasActiveFilters', {
      get: function get() {
        return self.hasActiveFilters();
      }
    });
    Object.defineProperty(self.intf, 'style', {
      get: function get() {
        return publicStyleKeyIntf;
      },
      set: function set(valueObject) {
        Object.keys(valueObject).forEach(function (key) {
          self.setStyleProperty(key, valueObject[key], true);
        });
        self.draw(true);
        self.dispatchEvent('stylechanged', {
          name: 'style',
          value: valueObject
        });
      }
    });
    Object.defineProperty(self.intf, 'attributes', {
      value: {}
    });
    Object.keys(self.attributes).forEach(function (key) {
      Object.defineProperty(self.intf.attributes, key, {
        get: function get() {
          return self.attributes[key];
        },
        set: function set(value) {
          self.attributes[key] = value;

          if (key === 'name') {
            self.tryLoadStoredSettings();
          }

          if (key === 'rowTree' || key === 'columnTree' || key === 'columnTreeRowEndIndex') {
            self.initCellTreeSettings();
          }

          self.draw(true);
          self.dispatchEvent('attributechanged', {
            name: key,
            value: value[key]
          });
        }
      });
    });

    self.filters.string = function (value, filterFor) {
      if (filterFor === self.attributes.blanksText) {
        return self.blankValues.includes(value == null ? value : String(value).trim());
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
          filterRegExp = new RegExp(filterFor.substring(1, filterFor.length - (flagLength + 1)), flags);
        } catch (e) {
          self.invalidFilterRegEx = e;
          return;
        }

        return filterRegExp.test(value);
      }

      return value.toString ? value.toString().toLocaleUpperCase().indexOf(filterFor.toLocaleUpperCase()) !== -1 : false;
    };

    self.filters.number = function (value, filterFor) {
      if (filterFor === self.attributes.blanksText) {
        return self.blankValues.includes(value == null ? value : String(value).trim());
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
      get: function get() {
        if (self.shadowRoot) {
          return self.shadowRoot.height;
        }

        return self.parentNode.height;
      },
      set: function set(value) {
        if (self.shadowRoot) {
          self.shadowRoot.height = value;
        } else {
          self.parentNode.height = value;
        }

        self.resize(true);
      }
    });
    Object.defineProperty(self.intf, 'width', {
      get: function get() {
        if (self.shadowRoot) {
          return self.shadowRoot.width;
        }

        return self.parentNode.width;
      },
      set: function set(value) {
        if (self.shadowRoot) {
          self.shadowRoot.width = value;
        } else {
          self.parentNode.width = value;
        }

        self.resize(true);
      }
    });
    Object.defineProperty(self.intf, 'parentNode', {
      get: function get() {
        return self.parentNode;
      },
      set: function set(value) {
        if (!self.isChildGrid) {
          throw new TypeError('Cannot set property parentNode which has only a getter');
        }

        self.parentNode = value;
      }
    });
  }

  Object.defineProperty(self.intf, 'visibleRowHeights', {
    get: function get() {
      return self.visibleRowHeights;
    }
  });
  Object.defineProperty(self.intf, 'openChildren', {
    get: function get() {
      return self.openChildren;
    }
  });
  Object.defineProperty(self.intf, 'childGrids', {
    get: function get() {
      return Object.keys(self.childGrids).map(function (gridId) {
        return self.childGrids[gridId];
      });
    }
  });
  Object.defineProperty(self.intf, 'isChildGrid', {
    get: function get() {
      return self.isChildGrid;
    }
  });
  Object.defineProperty(self, 'cursor', {
    get: function get() {
      return self.parentNodeStyle.cursor;
    },
    set: function set(value) {
      if (value === 'cell') {
        value = 'default';
      }

      if (self.currentCursor !== value) {
        self.parentNodeStyle.cursor = value;
        self.currentCursor = value;
      }
    }
  });
  Object.defineProperty(self.intf, 'orderDirection', {
    get: function get() {
      return self.orderDirection;
    },
    set: function set(value) {
      if (value !== 'desc') {
        value = 'asc';
      }

      self.orderDirection = value;
      self.order(self.orderBy, self.orderDirection);
    }
  });
  Object.defineProperty(self.intf, 'orderBy', {
    get: function get() {
      return self.orderBy;
    },
    set: function set(value) {
      if (self.getSchema().find(function (col) {
        return col.name === value;
      }) === undefined) {
        throw new Error('Cannot sort by unknown column name.');
      }

      self.orderBy = value;
      self.order(self.orderBy, self.orderDirection);
    }
  });

  if (self.isComponent) {
    Object.defineProperty(self.intf, 'offsetHeight', {
      get: function get() {
        return self.canvas.offsetHeight;
      }
    });
    Object.defineProperty(self.intf, 'offsetWidth', {
      get: function get() {
        return self.canvas.offsetWidth;
      }
    });
  }

  Object.defineProperty(self.intf, 'scrollHeight', {
    get: function get() {
      return self.scrollBox.scrollHeight;
    }
  });
  Object.defineProperty(self.intf, 'scrollWidth', {
    get: function get() {
      return self.scrollBox.scrollWidth;
    }
  });
  Object.defineProperty(self.intf, 'scrollTop', {
    get: function get() {
      return self.scrollBox.scrollTop;
    },
    set: function set(value) {
      self.scrollBox.scrollTop = value;
    }
  });
  Object.defineProperty(self.intf, 'scrollLeft', {
    get: function get() {
      return self.scrollBox.scrollLeft;
    },
    set: function set(value) {
      self.scrollBox.scrollLeft = value;
    }
  });
  Object.defineProperty(self.intf, 'sizes', {
    get: function get() {
      return self.sizes;
    }
  });
  Object.defineProperty(self.intf, 'parentDOMNode', {
    get: function get() {
      return self.parentDOMNode;
    }
  });
  Object.defineProperty(self.intf, 'input', {
    get: function get() {
      return self.input;
    }
  });
  Object.defineProperty(self.intf, 'controlInput', {
    get: function get() {
      return self.controlInput;
    }
  });
  Object.defineProperty(self.intf, 'currentCell', {
    get: function get() {
      return self.currentCell;
    }
  });
  Object.defineProperty(self.intf, 'visibleCells', {
    get: function get() {
      return self.visibleCells;
    }
  });
  Object.defineProperty(self.intf, 'visibleRows', {
    get: function get() {
      return self.visibleRows;
    }
  });
  Object.defineProperty(self.intf, 'selections', {
    get: function get() {
      return self.selections;
    }
  });
  Object.defineProperty(self.intf, 'dragMode', {
    get: function get() {
      return self.dragMode;
    }
  });
  Object.defineProperty(self.intf, 'changes', {
    get: function get() {
      return self.changes;
    }
  });
  self.intf.formatters = self.formatters;
  Object.defineProperty(self.intf, 'dataType', {
    get: function get() {
      return self.dataType;
    },
    set: function set(value) {
      if (!self.parsers[value]) {
        throw new Error('No parser for MIME type ' + value);
      }

      self.dataType = value;
    }
  });
  self.eventNames.forEach(function (eventName) {
    Object.defineProperty(self.intf, 'on' + eventName, {
      get: function get() {
        return self.componentL1Events[eventName];
      },
      set: function set(value) {
        self.events[eventName] = [];
        self.componentL1Events[eventName] = value;

        if (!value) {
          return;
        }

        self.addEventListener(eventName, value);
      }
    });
  });
  Object.defineProperty(self.intf, 'frozenRow', {
    get: function get() {
      return self.frozenRow;
    },
    set: function set(val) {
      if (isNaN(val)) {
        throw new TypeError('Expected value for frozenRow to be a number.');
      }

      if (self.visibleRows.length < val) {
        throw new RangeError('Cannot set a value larger than the number of visible rows.');
      }

      self.frozenRow = val;
    }
  });
  Object.defineProperty(self.intf, 'frozenColumn', {
    get: function get() {
      return self.frozenColumn;
    },
    set: function set(val) {
      if (isNaN(val)) {
        throw new TypeError('Expected value for frozenRow to be a number.');
      }

      if (self.getVisibleSchema().length < val) {
        throw new RangeError('Cannot set a value larger than the number of visible columns.');
      }

      self.frozenColumn = val;
    }
  });
  Object.defineProperty(self.intf, 'scrollIndexRect', {
    get: function get() {
      return {
        top: self.scrollIndexTop,
        right: self.scrollIndexRight,
        bottom: self.scrollIndexBottom,
        left: self.scrollIndexLeft
      };
    }
  });
  Object.defineProperty(self.intf, 'scrollPixelRect', {
    get: function get() {
      return {
        top: self.scrollPixelTop,
        right: self.scrollPixelRight,
        bottom: self.scrollPixelBottom,
        left: self.scrollPixelLeft
      };
    }
  });
  Object.defineProperty(self.intf, 'rowOrder', {
    get: function get() {
      return self.orders.rows;
    },
    set: function set(val) {
      if (!Array.isArray(val)) {
        throw new TypeError('Value must be an array.');
      }

      if (!self.originalData || val.length < self.originalData.length) {
        throw new RangeError('Array length must be equal to or greater than number of rows.');
      }

      self.orders.rows = val;
    }
  });
  Object.defineProperty(self.intf, 'columnOrder', {
    get: function get() {
      return self.orders.columns;
    },
    set: function set(val) {
      if (!Array.isArray(val)) {
        throw new TypeError('Value must be an array.');
      }

      if (val.length < self.getSchema().length) {
        throw new RangeError('Array length must be equal to or greater than number of columns.');
      }

      self.orders.columns = val;
    }
  });
  Object.defineProperty(self.intf, 'selectionBounds', {
    get: function get() {
      return self.getSelectionBounds();
    }
  });
  Object.defineProperty(self.intf, 'selectedRows', {
    get: function get() {
      return self.getSelectedData(true);
    }
  });
  Object.defineProperty(self.intf, 'selectedCells', {
    get: function get() {
      return self.getSelectedData();
    }
  });
  Object.defineProperty(self.intf, 'visibleSchema', {
    get: function get() {
      return self.getVisibleSchema().map(function eachDataRow(col) {
        return col;
      });
    }
  });
  Object.defineProperty(self.intf, 'treeGridAttributes', {
    get: function get() {
      return self.treeGridAttributes;
    },
    set: function setTreeGridAttributes(value) {
      self.treeGridAttributes = value;
    }
  });
  Object.defineProperty(self.intf, 'cellGridAttributes', {
    get: function get() {
      return self.cellGridAttributes;
    },
    set: function setCellGridAttributes(value) {
      self.cellGridAttributes = value;
    }
  });
  Object.defineProperty(self.intf, 'fillCellCallback', {
    get: function get() {
      return self.fillCellCallback;
    },
    set: function setFillCellCallback(value) {
      self.fillCellCallback = value;
    }
  });
  Object.defineProperty(self.intf, 'ctx', {
    get: function get() {
      return self.ctx;
    }
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
        self.dispatchEvent('schemachanged', {
          schema: undefined
        });
        return;
      }

      if (!Array.isArray(value) || _typeof(value[0]) !== 'object') {
        throw new Error('Schema must be an array of objects.');
      }

      if (value[0].name === undefined) {
        throw new Error('Expected schema to contain an object with at least a name property.');
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

      if (self.storedSettings && _typeof(self.storedSettings.visibility) === 'object') {
        self.schema.forEach(function hideEachSchemaColumn(column, index) {
          if (self.storedSettings && self.storedSettings.visibility[column.name] !== undefined) {
            column.hidden = !self.storedSettings.visibility[column.name];
          }
        });
      }

      self.resize(true);
      self.dispatchEvent('schemachanged', {
        schema: self.schema
      });
    }
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
      console.warn(Error('Cannot parse application/json+x-canvas-datagrid formated data. ' + e.message + '  \nNote: canvas-datagrid.innerHTML is for string data only.  ' + 'Use the canvas-datagrid.data property to set object data.'));
    }

    return data;
  };

  self.parsers['application/json+x-canvas-datagrid'] = function (data, callback) {
    self.parsers['application/x-canvas-datagrid'](self.parseInnerHtml(data), function (data, schema) {
      return callback(data, schema);
    });
  };

  self.parsers['application/x-canvas-datagrid'] = function (data, callback) {
    return callback(data);
  };

  self.intf.parsers = self.parsers; // send to dataType ETL function to extract from input data
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
      } // Issue #89 - allow schema to be auto-created every time data is set


      if (self.attributes.autoGenerateSchema) {
        self.schema = self.getSchemaFromData(data);
      }

      if (!self.schema) {
        self.tempSchema = self.getSchemaFromData(data);
      }

      if (self.getSchema()) {
        self.createColumnOrders();
      } // apply filter, sort, etc to incoming dataset, set viewData:


      self.refresh(); // empty data was set

      if (!self.schema && (self.originalData || []).length === 0) {
        self.tempSchema = [{
          name: ''
        }];
      }

      self.fitColumnToValues('cornerCell', true);

      if (self.tempSchema && !self.schema || self.attributes.autoGenerateSchema) {
        self.createColumnOrders();
        self.dispatchEvent('schemachanged', {
          schema: self.tempSchema
        });
      }

      callback();
    });
  };

  Object.defineProperty(self.intf, 'viewData', {
    get: function get() {
      return self.viewData;
    }
  });
  Object.defineProperty(self.intf, 'boundData', {
    get: function get() {
      return self.originalData;
    }
  });
  Object.defineProperty(self.intf, 'data', {
    get: function dataGetter() {
      return self.originalData;
    },
    set: function dataSetter(value) {
      self.etl(value, function () {
        self.changes = [];
        self.createNewRowData();

        if (self.attributes.autoResizeColumns && self.originalData.length > 0 && self.storedSettings === undefined) {
          self.autosize();
        } // set the header column to fit the numbers in it


        self.fitColumnToValues('cornerCell', true);
        self.createRowOrders();
        self.tryLoadStoredSettings();
        self.dispatchEvent('datachanged', {
          data: self.originalData
        });
        self.initCellTreeSettings();
        self.resize(true);
      });
    }
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

      if (self.button) {
        self.moveButtonPos();
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

      if (self.button) {
        self.moveButtonPos();
      }
    }

    self.scrollBox.toString = function () {
      return '{"width": ' + scrollWidth.toFixed(2) + ', "height": ' + scrollHeight.toFixed(2) + ', "left": ' + scrollLeft.toFixed(2) + ', "top": ' + scrollTop.toFixed(2) + ', "widthRatio": ' + self.scrollBox.widthBoxRatio.toFixed(5) + ', "heightRatio": ' + self.scrollBox.heightBoxRatio.toFixed(5) + '}';
    };

    self.scrollBox.scrollTo = function (x, y, supressDrawEvent) {
      setScrollLeft(x, true);
      setScrollTop(y, supressDrawEvent);
    };

    Object.defineProperty(self.scrollBox, 'scrollBoxHeight', {
      get: function get() {
        return scrollBoxHeight;
      },
      set: function set(value) {
        scrollBoxHeight = value;
      }
    });
    Object.defineProperty(self.scrollBox, 'scrollBoxWidth', {
      get: function get() {
        return scrollBoxWidth;
      },
      set: function set(value) {
        scrollBoxWidth = value;
      }
    });
    Object.defineProperty(self.scrollBox, 'height', {
      get: function get() {
        return sHeight;
      },
      set: function set(value) {
        sHeight = value;
      }
    });
    Object.defineProperty(self.scrollBox, 'width', {
      get: function get() {
        return sWidth;
      },
      set: function set(value) {
        sWidth = value;
      }
    });
    Object.defineProperty(self.scrollBox, 'scrollTop', {
      get: function get() {
        return scrollTop;
      },
      set: setScrollTop
    });
    Object.defineProperty(self.scrollBox, 'scrollLeft', {
      get: function get() {
        return scrollLeft;
      },
      set: setScrollLeft
    });
    Object.defineProperty(self.scrollBox, 'scrollHeight', {
      get: function get() {
        return scrollHeight;
      },
      set: function set(value) {
        if (scrollTop > value) {
          scrollTop = Math.max(value, 0);
        }

        scrollHeight = value;
      }
    });
    Object.defineProperty(self.scrollBox, 'scrollWidth', {
      get: function get() {
        return scrollWidth;
      },
      set: function set(value) {
        if (scrollLeft > value) {
          scrollLeft = Math.max(value, 0);
        }

        scrollWidth = value;
      }
    });
  };

  return;
}

/***/ }),

/***/ "./lib/main.js":
/*!*********************!*\
  !*** ./lib/main.js ***!
  \*********************/
/*! namespace exports */
/*! export default [provided] [used in main] [usage prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ canvasDatagrid; }
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./lib/component.js");
/* harmony import */ var _defaults__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaults */ "./lib/defaults.js");
/* harmony import */ var _draw__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./draw */ "./lib/draw.js");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./events */ "./lib/events/index.js");
/* harmony import */ var _touch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./touch */ "./lib/touch.js");
/* harmony import */ var _intf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./intf */ "./lib/intf.js");
/* harmony import */ var _contextMenu__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./contextMenu */ "./lib/contextMenu.js");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./button */ "./lib/button.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dom */ "./lib/dom.js");
/* harmony import */ var _publicMethods__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./publicMethods */ "./lib/publicMethods.js");
/*jslint browser: true, unparam: true, todo: true, evil: true*/

/*globals Reflect: false, HTMLElement: true, define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }











var webComponent = (0,_component__WEBPACK_IMPORTED_MODULE_0__.default)();
var modules = [_defaults__WEBPACK_IMPORTED_MODULE_1__.default, _draw__WEBPACK_IMPORTED_MODULE_2__.default, _events__WEBPACK_IMPORTED_MODULE_3__.default, _touch__WEBPACK_IMPORTED_MODULE_4__.default, _intf__WEBPACK_IMPORTED_MODULE_5__.default, _contextMenu__WEBPACK_IMPORTED_MODULE_6__.default, _button__WEBPACK_IMPORTED_MODULE_7__.default, _dom__WEBPACK_IMPORTED_MODULE_8__.default, _publicMethods__WEBPACK_IMPORTED_MODULE_9__.default];

function Grid(args) {
  args = args || {};
  var self = {};
  self.isComponent = args.component === undefined;
  self.isChildGrid = args.parentNode && /canvas-datagrid-(cell|tree)/.test(args.parentNode.nodeType);

  if (self.isChildGrid) {
    self.intf = {};
  } else {
    self.intf = self.isComponent ? eval('Reflect.construct(HTMLElement, [], new.target)') : document.createElement('canvas');
  }

  self.args = args;
  self.intf.args = args;
  self.applyComponentStyle = webComponent.applyComponentStyle;
  self.hyphenateProperty = webComponent.hyphenateProperty;
  self.dehyphenateProperty = webComponent.dehyphenateProperty;

  self.createGrid = function grid(args) {
    args.component = false;
    return new Grid(args);
  };

  modules.forEach(function (module) {
    module(self);
  });

  if (self.isChildGrid) {
    self.shadowRoot = args.parentNode.shadowRoot;
    self.parentNode = args.parentNode;
  } else {
    self.shadowRoot = self.intf.attachShadow({
      mode: 'open'
    });
    self.parentNode = self.shadowRoot;
  }

  self.init();
  return self.intf;
}

if (window.HTMLElement) {
  Grid.prototype = Object.create(window.HTMLElement.prototype);
} // export web component


if (window.customElements) {
  Grid.observedAttributes = webComponent.getObservableAttributes();
  Grid.prototype.disconnectedCallback = webComponent.disconnectedCallback;
  Grid.prototype.attributeChangedCallback = webComponent.attributeChangedCallback;
  Grid.prototype.connectedCallback = webComponent.connectedCallback;
  Grid.prototype.adoptedCallback = webComponent.adoptedCallback;
  window.customElements.define('canvas-datagrid', Grid);
} // export global


if (window && !window.canvasDatagrid && !window.require && // Present to exclude global declarations from ES Module bundles
!window.EXCLUDE_GLOBAL) {
  window.canvasDatagrid = function (args) {
    return new Grid(args);
  };
} // export amd loader


function canvasDatagrid(args) {
  args = args || {};
  var i,
      tKeys = ['style', 'formatters', 'sorters', 'filters', 'treeGridAttributes', 'cellGridAttributes', 'fillCellCallback', 'data', 'schema'];

  if (window.customElements) {
    i = document.createElement('canvas-datagrid');
    Object.keys(args).forEach(function (argKey) {
      // set data and parentNode after everything else
      if (argKey === 'data') {
        return;
      }

      if (argKey === 'parentNode') {
        return;
      } // top level keys in args


      if (tKeys.indexOf(argKey) !== -1) {
        tKeys.forEach(function (tKey) {
          if (args[tKey] === undefined || tKey !== argKey) {
            return;
          }

          if (['formatters', 'sorters', 'filters'].indexOf(argKey) !== -1) {
            if (_typeof(args[tKey]) === 'object' && args[tKey] !== null) {
              Object.keys(args[tKey]).forEach(function (sKey) {
                i[tKey][sKey] = args[tKey][sKey];
              });
            }
          } else {
            i[tKey] = args[tKey];
          }
        });
        return;
      } // all others are attribute level keys


      i.attributes[argKey] = args[argKey];
    });

    if (args.data) {
      i.data = args.data;
    } // add to the dom very last to avoid redraws


    if (args.parentNode) {
      args.parentNode.appendChild(i);
    }

    return i;
  }

  args.component = false;
  i = new Grid(args);

  if (args.parentNode && args.parentNode.appendChild) {
    args.parentNode.appendChild(i);
  }

  return i;
}

/***/ }),

/***/ "./lib/publicMethods.js":
/*!******************************!*\
  !*** ./lib/publicMethods.js ***!
  \******************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _groups_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./groups/util */ "./lib/groups/util.js");
/*jslint browser: true, unparam: true, todo: true*/

/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/


function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(self) {
  /**
   * Converts a integer into a letter A - ZZZZZ...
   * @memberof canvasDatagrid
   * @name integerToAlpha
   * @method
   * @param {column} n The number to convert.
   */
  self.integerToAlpha = function (n) {
    var ordA = 'a'.charCodeAt(0),
        ordZ = 'z'.charCodeAt(0),
        len = ordZ - ordA + 1,
        s = '';

    while (n >= 0) {
      s = String.fromCharCode(n % len + ordA) + s;
      n = Math.floor(n / len) - 1;
    }

    return s;
  };
  /**
   * Inserts a new column before the specified index into the schema.
   * @tutorial schema
   * @memberof canvasDatagrid
   * @name insertColumn
   * @method
   * @param {column} c The column to insert into the schema.
   * @param {number} index The index of the column to insert before.
   */


  self.insertColumn = function (c, index) {
    var s = self.getSchema();

    if (s.length < index) {
      throw new Error('Index is beyond the length of the schema.');
    }

    self.validateColumn(c, s);
    s.splice(index, 0, c);
    self.originalData.forEach(function (row, rowIndex) {
      self.applyDefaultValue(row, c, rowIndex);
    });
    self.intf.schema = s;
    self.refresh();
  };
  /**
   * Deletes a column from the schema at the specified index.
   * @memberof canvasDatagrid
   * @name deleteColumn
   * @tutorial schema
   * @method
   * @param {number} index The index of the column to delete.
   */


  self.deleteColumn = function (index) {
    var schema = self.getSchema(); // remove data matching this column name from data

    self.originalData.forEach(function (row) {
      delete row[schema[index].name];
    });
    schema.splice(index, 1);
    self.intf.schema = schema;
    self.refresh();
  };
  /**
   * Adds a new column into the schema.
   * @tutorial schema
   * @memberof canvasDatagrid
   * @name addColumn
   * @method
   * @param {column} c The column to add to the schema.
   */


  self.addColumn = function (c) {
    var s = self.getSchema();
    self.validateColumn(c, s);
    s.push(c);
    self.originalData.forEach(function (row, rowIndex) {
      self.applyDefaultValue(row, c, rowIndex);
    });
    self.intf.schema = s;
    self.refresh();
  };
  /**
   * Deletes a row from the dataset at the specified index.
   * @memberof canvasDatagrid
   * @name deleteRow
   * @method
   * @param {number} index The index of the row to delete.
   */


  self.deleteRow = function (index) {
    self.originalData.splice(index, 1);
    self.setFilter();
    self.resize(true);
  };
  /**
   * Inserts a new row into the dataset before the specified index.
   * @memberof canvasDatagrid
   * @name insertRow
   * @method
   * @param {object} d data.
   * @param {number} index The index of the row to insert before.
   */


  self.insertRow = function (d, index) {
    if (self.originalData.length < index) {
      throw new Error('Index is beyond the length of the dataset.');
    }

    self.originalData.splice(index, 0, d);
    self.getSchema().forEach(function (c) {
      if (d[c.name] === undefined) {
        self.applyDefaultValue(self.originalData[index], c, index);
      }
    }); // setFilter calls .refresh(), so we need not call it again:

    self.setFilter();
    self.resize(true);
  };
  /**
   * Adds a new row into the dataset.
   * @memberof canvasDatagrid
   * @name addRow
   * @method
   * @param {object} d data.
   */


  self.addRow = function (d) {
    self.originalData.push(d);
    self.getSchema().forEach(function (c) {
      if (d[c.name] === undefined) {
        self.applyDefaultValue(self.originalData[self.originalData.length - 1], c, self.originalData.length - 1);
      }
    }); // setFilter calls .refresh(), so we need not call it again:

    self.setFilter();
    self.resize(true);
  };
  /**
   * Sets the height of a given row by index number.
   * @memberof canvasDatagrid
   * @name setRowHeight
   * @method
   * @param {number} rowIndex The index of the row to set.
   * @param {number} height Height to set the row to.
   */


  self.setRowHeight = function (rowIndex, height) {
    self.sizes.rows[rowIndex] = height;
    self.draw(true);
  };
  /**
   * Sets the width of a given column by index number.
   * @memberof canvasDatagrid
   * @name setColumnWidth
   * @method
   * @param {number} colIndex The index of the column to set.
   * @param {number} width Width to set the column to.
   */


  self.setColumnWidth = function (colIndex, width) {
    self.sizes.columns[colIndex] = width;
    self.draw(true);
  };
  /**
   * Removes any changes to the width of the columns due to user or api interaction, setting them back to the schema or style default.
   * @memberof canvasDatagrid
   * @name resetColumnWidths
   * @tutorial schema
   * @method
   */


  self.resetColumnWidths = function () {
    self.sizes.columns = {};
    self.draw(true);
  };
  /**
   * Removes any changes to the height of the rows due to user or api interaction, setting them back to the schema or style default.
   * @memberof canvasDatagrid
   * @name resetRowHeights
   * @tutorial schema
   * @method
   */


  self.resetRowHeights = function () {
    self.sizes.rows = {};
    self.draw(true);
  };
  /**
   * Sets the value of the filter.
   * @memberof canvasDatagrid
   * @name setFilter
   * @method
   * @param {string} column Name of the column to filter.
   * @param {string} value The value to filter for.
   */


  self.setFilter = function (column, value) {
    if (column === undefined && value === undefined) {
      self.columnFilters = {};
    } else if (column && (value === '' || value === undefined)) {
      delete self.columnFilters[column];
    } else {
      self.columnFilters[column] = value;

      if (self.attributes.showFilterInCell) {
        self.filterable.rows.push(0);
        self.orders.columns.forEach(function (value, index) {
          self.filterable.columns.push(index);
        });
      }
    }

    if (!Object.keys(self.columnFilters).length) {
      self.filterable = {
        rows: [],
        columns: []
      };
    }

    self.refresh();
  };
  /**
   * Returns the number of pixels to scroll down to line up with row rowIndex.
   * @memberof canvasDatagrid
   * @name findRowScrollTop
   * @method
   * @param {number} rowIndex The row index of the row to scroll find.
   */


  self.findRowScrollTop = function (rowIndex) {
    if (self.scrollCache.y[rowIndex] === undefined) {
      throw new RangeError("Row index ".concat(rowIndex, " out of range: ").concat(self.scrollCache.y.length, "."));
    }

    return self.scrollCache.y[rowIndex];
  };
  /**
   * Returns the number of pixels to scroll to the left to line up with column columnIndex.
   * @memberof canvasDatagrid
   * @name findColumnScrollLeft
   * @method
   * @param {number} columnIndex The column index of the column to find.
   */


  self.findColumnScrollLeft = function (columnIndex) {
    var i = Math.max(columnIndex - 1, 0);

    if (self.scrollCache.x[i] === undefined) {
      throw new Error('Column index out of range.');
    }

    return self.scrollCache.x[i] - self.getColumnWidth(self.orders.columns[columnIndex]);
  };
  /**
   * Scrolls to the cell at columnIndex x, and rowIndex y.  If you define both rowIndex and columnIndex additional calculations can be made to center the cell using the target cell's height and width.  Defining only one rowIndex or only columnIndex will result in simpler calculations.
   * @memberof canvasDatagrid
   * @name gotoCell
   * @method
   * @param {number} x The column index of the cell to scroll to.
   * @param {number} y The row index of the cell to scroll to.
   * @param {number} [offsetX=0] Percentage offset the cell should be from the left edge (not including headers).  The default is 0, meaning the cell will appear at the left edge. Valid values are 0 through 1. 1 = Left, 0 = Right, 0.5 = Center.
   * @param {number} [offsetY=0] Percentage offset the cell should be from the top edge (not including headers).  The default is 0, meaning the cell will appear at the top edge. Valid values are 0 through 1. 1 = Bottom, 0 = Top, 0.5 = Center.
   */


  self.gotoCell = function (x, y, offsetX, offsetY) {
    var targetX = x === undefined ? undefined : self.findColumnScrollLeft(x),
        targetY = y === undefined ? undefined : self.findRowScrollTop(y),
        cell,
        sbw = self.scrollBox.width - (self.scrollBox.verticalBarVisible ? self.style.scrollBarWidth : 0),
        sbh = self.scrollBox.height - (self.scrollBox.horizontalBarVisible ? self.style.scrollBarWidth : 0);
    offsetX = offsetX === undefined ? 0 : offsetX;
    offsetY = offsetY === undefined ? 0 : offsetY;
    targetX -= sbw * offsetX;
    targetY -= sbh * offsetY;

    if (x !== undefined && y !== undefined) {
      self.scrollBox.scrollTo(targetX, targetY);
      requestAnimationFrame(function () {
        cell = self.getVisibleCellByIndex(x, y); // HACK: just don't offset if the target cell cannot be seen
        // TODO: offset does not work on very small grids, not sure why

        if (!cell) {
          return;
        }

        targetX += cell.width * offsetX;
        targetY += cell.height * offsetY;
        self.scrollBox.scrollTo(targetX, targetY);
      });
    } else if (x !== undefined) {
      self.scrollBox.scrollLeft = targetX;
    } else if (y !== undefined) {
      self.scrollBox.scrollTop = targetY;
    }
  };
  /**
   * Scrolls the row y.
   * @memberof canvasDatagrid
   * @name gotoRow
   * @method
   * @param {number} y The row index of the cell to scroll to.
   */


  self.gotoRow = function (y) {
    self.gotoCell(0, y);
  };
  /**
   * Add a button into the cell.
   * @memberof canvasDatagrid
   * @name addButton
   * @method
   * @param {number} columnIndex The column index of the cell to to add a button.
   * @param {number} rowIndex The row index of the cell to to add a button.
   * @param {object} offset Offset how far go away from cell.
   * @param {object} items a list of items to add into button menu.
   * @param {string} imgSrc icon path to add into button.
   */


  self.addButton = function (columnIndex, rowIndex, offset, items, imgSrc) {
    var cells = self.visibleCells.filter(function (c) {
      return c.sortColumnIndex === columnIndex && c.sortRowIndex === rowIndex;
    });
    self.attachButton({
      top: cells[0].y + cells[0].height + offset.y,
      left: cells[0].x + cells[0].width + offset.x
    }, items, imgSrc);
  };
  /**
   * Expand/Collapse CellTree.
   * @memberof canvasDatagrid
   * @name toggleCellCollapseTree
   * @method
   * @param {array} treeData The array of cellTree to expand or collapse.
   */


  self.toggleCellCollapseTree = function (treeData) {
    for (var type in treeData) {
      var _iterator = _createForOfIteratorHelper(treeData[type]),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var t = _step.value;
          if (t.length > 0) self.toggleCollapseTree(t[0], t[1], type);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    self.draw();
  };
  /**
   * Expand/Collapse CellTree.
   * @memberof canvasDatagrid
   * @name expandCollapseCellTree
   * @method
   * @param {array} treeData The array of cellTree to expand or collapse.
   */


  self.expandCollapseCellTree = function (treeData) {
    for (var type in treeData) {
      var _iterator2 = _createForOfIteratorHelper(treeData[type]),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var t = _step2.value;
          if (t.length > 0) self.cellTreeExpandCollapse(t[0], t[1], type);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    self.draw();
  };
  /**
   * Scrolls the cell at cell x, row y into view if it is not already.
   * @memberof canvasDatagrid
   * @name scrollIntoView
   * @method
   * @param {number} x The column index of the cell to scroll into view.
   * @param {number} y The row index of the cell to scroll into view.
   * @param {number} [offsetX=0] Percentage offset the cell should be from the left edge (not including headers).  The default is 0, meaning the cell will appear at the left edge. Valid values are 0 through 1. 1 = Left, 0 = Right, 0.5 = Center.
   * @param {number} [offsetY=0] Percentage offset the cell should be from the top edge (not including headers).  The default is 0, meaning the cell will appear at the top edge. Valid values are 0 through 1. 1 = Bottom, 0 = Top, 0.5 = Center.
   */


  self.scrollIntoView = function (x, y, offsetX, offsetY) {
    var matched = self.visibleCells.filter(function (cell) {
      return (cell.rowIndex === y || y === undefined) && (cell.columnIndex === x || x === undefined) && cell.x > 0 && cell.y > 0 && cell.x + cell.width < self.width && cell.y + cell.height < self.height;
    });

    if (matched.length === 1 && x !== undefined && y !== undefined) {
      // goto specific cell and its part be hidden by header
      if (matched[0].x < self.getRowHeaderCellWidth() || matched[0].y < self.getColumnHeaderCellHeight()) matched.length = 0;
    }

    if (matched.length === 0) {
      self.gotoCell(x, y, offsetX, offsetY);
    }
  };
  /**
   * Sets the active cell. Requires redrawing.
   * @memberof canvasDatagrid
   * @name setActiveCell
   * @method
   * @param {number} x The column index of the cell to set active.
   * @param {number} y The row index of the cell to set active.
   */


  self.setActiveCell = function (x, y) {
    if (typeof x === 'undefined') return;

    if (x < 0) {
      x = 0;
    }

    if (y < 0) {
      y = 0;
    }

    self.activeCell = {
      rowIndex: y,
      columnIndex: x
    };
  };
  /**
   * Removes the selection.
   * @memberof canvasDatagrid
   * @name selectNone
   * @param {boolean} dontDraw Suppress the draw method after the selection change.
   * @method
   */


  self.selectNone = function (dontDraw) {
    self.selections = [];
    self.selectedRows = [];
    self.selectedColumns = [];
    self.dispatchEvent('selectionchanged', {
      selectedData: self.getSelectedData(),
      selections: self.selections,
      selectionBounds: self.selectionBounds,
      selectedCells: self.getSelectedCells()
    });

    if (dontDraw) {
      return;
    }

    self.draw();
  };
  /**
   * Selects every visible cell.
   * @memberof canvasDatagrid
   * @name selectAll
   * @param {boolean} dontDraw Suppress the draw method after the selection change.
   * @method
   */


  self.selectAll = function (dontDraw) {
    self.selectArea({
      top: 0,
      left: -1,
      right: self.getSchema().length - 1,
      bottom: self.viewData.length - 1
    });

    if (dontDraw) {
      return;
    }

    self.draw();
  };
  /**
   * Returns true if the selected columnIndex is selected on every row.
   * @memberof canvasDatagrid
   * @name isColumnSelected
   * @method
   * @param {number} columnIndex The column index to check.
   */


  self.isColumnSelected = function (columnIndex) {
    var colIsSelected = true;
    self.viewData.forEach(function (row, rowIndex) {
      if (!self.selections[rowIndex] || self.selections[rowIndex].indexOf(columnIndex) === -1) {
        colIsSelected = false;
      }
    });
    return colIsSelected;
  };
  /**
   * Returns true if the selected rowIndex is selected on every column.
   * @memberof canvasDatagrid
   * @name isRowSelected
   * @method
   * @param {number} rowIndex The row index to check.
   */


  self.isRowSelected = function (rowIndex) {
    if (!self.selections[rowIndex]) return false;
    var rowIsSelected = true;
    var schema = self.getVisibleSchema();
    schema.forEach(function (col, index) {
      if (!self.selections[rowIndex] || self.selections[rowIndex].indexOf(index) === -1) {
        rowIsSelected = false;
      }
    });
    return rowIsSelected;
  };
  /**
   * Runs the defined method on each selected cell.
   * @memberof canvasDatagrid
   * @name forEachSelectedCell
   * @method
   * @param {number} fn The function to execute.  The signature of the function is: (data, rowIndex, columnName).
   * @param {number} expandToRow When true the data in the array is expanded to the entire row.
   */


  self.forEachSelectedCell = function (fn, expandToRow) {
    var d = [],
        s = expandToRow ? self.getSchema() : self.getVisibleSchema(),
        l = self.viewData.length;
    self.selections.forEach(function (row, index) {
      if (index === l) {
        return;
      }

      if (row.length === 0) {
        d[index] = null;
        return;
      }

      d[index] = {};
      row.forEach(function (col) {
        if (col === -1 || !s[col]) {
          return;
        }

        fn(self.viewData, index, s[col].name);
      });
    });
  };
  /**
   * Selects a column.
   * @memberof canvasDatagrid
   * @name selectColumn
   * @method
   * @param {number} columnIndex The column index to select.
   * @param {boolean} toggleSelectMode When true, behaves as if you were holding control/command when you clicked the column.
   * @param {boolean} shift When true, behaves as if you were holding shift when you clicked the column.
   * @param {boolean} supressSelectionchangedEvent When true, prevents the selectionchanged event from firing.
   */


  self.selectColumn = function (columnIndex, ctrl, shift, supressEvent) {
    var s, e, x;
    self.isMultiRowsSelected = false;
    self.isMultiColumnsSelected = false;

    function addCol(i) {
      self.viewData.forEach(function (row, rowIndex) {
        self.selections[rowIndex] = self.selections[rowIndex] || [];

        if (self.selections[rowIndex].indexOf(i) === -1) {
          self.selections[rowIndex].push(i);
        }
      });
    }

    function removeCol(i) {
      self.viewData.forEach(function (row, rowIndex) {
        self.selections[rowIndex] = self.selections[rowIndex] || [];

        if (self.selections[rowIndex].indexOf(i) !== -1) {
          self.selections[rowIndex].splice(self.selections[rowIndex].indexOf(i), 1);
        }
      });
    }

    if (shift) {
      if (!self.activeCell) {
        return;
      }

      s = Math.min(self.activeCell.columnIndex, columnIndex);
      e = Math.max(self.activeCell.columnIndex, columnIndex);

      for (x = s; e > x; x += 1) {
        addCol(x);
        if (self.selectedColumns.indexOf(x) === -1) self.selectedColumns.push(x);
      }

      if (s != e) self.isMultiColumnsSelected = true;
    }

    if (!ctrl && !shift) {
      self.selections = [];
      self.selectedColumns = [];
      self.activeCell.columnIndex = columnIndex;
      self.activeCell.rowIndex = self.scrollIndexTop;
    }

    if (ctrl && self.isColumnSelected(columnIndex)) {
      removeCol(columnIndex);
      self.selectedColumns.splice(columnIndex, 1);
    } else {
      addCol(columnIndex);
      self.selectedColumns.push(columnIndex);
    }

    if (supressEvent) {
      return;
    }

    self.dispatchEvent('selectionchanged', {
      selectedData: self.getSelectedData(),
      selections: self.selections,
      selectionBounds: self.getSelectionBounds(),
      selectedCells: self.getSelectedCells()
    });
  };
  /**
   * Selects a row.
   * @memberof canvasDatagrid
   * @name selectRow
   * @method
   * @param {number} rowIndex The row index to select.
   * @param {boolean} ctrl When true, behaves as if you were holding control/command when you clicked the row.
   * @param {boolean} shift When true, behaves as if you were holding shift when you clicked the row.
   * @param {boolean} supressSelectionchangedEvent When true, prevents the selectionchanged event from firing.
   */


  self.selectRow = function (rowIndex, ctrl, shift, supressEvent) {
    var x,
        st,
        en,
        s = self.getVisibleSchema();
    self.isMultiRowsSelected = false;

    function de() {
      if (supressEvent) {
        return;
      }

      self.dispatchEvent('selectionchanged', {
        selectedData: self.getSelectedData(),
        selections: self.selections,
        selectionBounds: self.selectionBounds,
        selectedCells: self.getSelectedCells()
      });
    }

    function addRow(ri) {
      self.selections[ri] = [];
      self.selections[ri].push(-1);
      s.forEach(function (col, index) {
        self.selections[ri].push(self.orders.columns.indexOf(col.index));
        if (col.index !== -1 && self.selectedColumns.indexOf(self.orders.columns.indexOf(col.index)) === -1) self.selectedColumns.push(self.orders.columns.indexOf(col.index));
      });
    }

    if (self.dragAddToSelection === false || self.dragObject === undefined) {
      if (self.selections[rowIndex] && self.selections[rowIndex].length - 1 === s.length) {
        if (ctrl) {
          self.selections[rowIndex] = [];
          de();
          return;
        }
      }
    }

    if (self.dragAddToSelection === true || self.dragObject === undefined) {
      if (shift && self.dragObject === undefined) {
        if (!self.activeCell) {
          return;
        }

        st = Math.min(self.activeCell.rowIndex, rowIndex);
        en = Math.max(self.activeCell.rowIndex, rowIndex);

        for (x = st; en >= x; x += 1) {
          addRow(x);
          self.selectedRows.push(x);
        }
      } else {
        addRow(rowIndex);
        self.selectedRows = [];
        self.selectedRows.push(rowIndex);
      }
    }

    de();
  };
  /**
   * Collapse a tree grid by row index.
   * @memberof canvasDatagrid
   * @name collapseTree
   * @method
   * @param {number} index The index of the row to collapse.
   */


  self.collapseTree = function (rowIndex) {
    self.dispatchEvent('collapsetree', {
      childGrid: self.childGrids[rowIndex],
      data: self.viewData[rowIndex],
      rowIndex: rowIndex
    });
    self.openChildren[rowIndex].blur();
    self.openChildren[rowIndex].dispose();
    delete self.openChildren[rowIndex];
    delete self.sizes.trees[rowIndex];
    delete self.childGrids[rowIndex];
    self.dispatchEvent('resizerow', {
      cellHeight: self.style.cellHeight
    });
    self.resize(true);
    self.draw(true);
  };
  /**
   * Expands a tree grid by row index.
   * @memberof canvasDatagrid
   * @name expandTree
   * @method
   * @param {number} index The index of the row to expand.
   */


  self.expandTree = function (rowIndex) {
    var trArgs = self.args.treeGridAttributes || {},
        columnHeaderCellHeight = self.getColumnHeaderCellHeight(),
        rowHeaderCellWidth = self.sizes.columns.cornerCell || self.style.rowHeaderCellWidth,
        h = self.sizes.trees[rowIndex] || self.style.treeGridHeight,
        treeGrid;

    if (!self.childGrids[rowIndex]) {
      trArgs.debug = self.attributes.debug;
      trArgs.name = self.attributes.saveAppearance ? self.attributes.name + 'tree' + rowIndex : undefined;
      trArgs.style = trArgs.style || self.style;
      trArgs.parentNode = {
        parentGrid: self.intf,
        nodeType: 'canvas-datagrid-tree',
        offsetHeight: h,
        offsetWidth: self.width - rowHeaderCellWidth,
        header: {
          width: self.width - rowHeaderCellWidth
        },
        offsetLeft: rowHeaderCellWidth,
        offsetTop: columnHeaderCellHeight,
        offsetParent: self.intf.parentNode,
        parentNode: self.intf.parentNode,
        style: 'tree',
        data: self.viewData[rowIndex]
      };
      treeGrid = self.createGrid(trArgs);
      self.childGrids[rowIndex] = treeGrid;
    }

    treeGrid = self.childGrids[rowIndex];
    treeGrid.visible = true;
    self.dispatchEvent('expandtree', {
      treeGrid: treeGrid,
      data: self.viewData[rowIndex],
      rowIndex: rowIndex
    });
    self.openChildren[rowIndex] = treeGrid;
    self.sizes.trees[rowIndex] = h;
    self.dispatchEvent('resizerow', {
      height: self.style.cellHeight
    });
    self.resize(true);
  };
  /**
   * Toggles tree grid open and close by row index.
   * @memberof canvasDatagrid
   * @name toggleTree
   * @method
   * @param {number} index The index of the row to toggle.
   */


  self.toggleTree = function (rowIndex) {
    var i = self.openChildren[rowIndex];

    if (i) {
      return self.collapseTree(rowIndex);
    }

    self.expandTree(rowIndex);
  };
  /**
   * Returns a header from the schema by name.
   * @memberof canvasDatagrid
   * @name getHeaderByName
   * @tutorial schema
   * @method
   * @returns {header} header with the selected name, or undefined.
   * @param {string} name The name of the column to resize.
   */


  self.getHeaderByName = function (name) {
    var x,
        i = self.getSchema();

    for (x = 0; x < i.length; x += 1) {
      if (i[x].name === name) {
        return i[x];
      }
    }
  };
  /**
   * Hide column/columns
   * @memberof canvasDatagrid
   * @name hideColumns
   * @method
   * @param {number} beginColumnOrderIndex The begin column order index
   * @param {number} [endColumnOrderIndex] The end column order index
   */


  self.hideColumns = function (beginColumnOrderIndex, endColumnOrderIndex) {
    var schema = self.getSchema();
    var orders = self.orders.columns;
    var hiddenColumns = [];
    if (typeof endColumnOrderIndex !== 'number') endColumnOrderIndex = beginColumnOrderIndex;

    for (var orderIndex = beginColumnOrderIndex; orderIndex <= endColumnOrderIndex; orderIndex++) {
      var columnIndex = orders[orderIndex];

      if (columnIndex >= 0 && !schema[columnIndex].hidden) {
        hiddenColumns.push(columnIndex);
        schema[columnIndex].hidden = true;
        self.dispatchEvent('columnhide', {
          columnIndex: columnIndex
        });
      }
    }

    if (hiddenColumns.length > 0) {
      self.setStorageData();
      setTimeout(function () {
        self.resize(true);
      }, 10);
    }

    self.dispatchEvent('hidecolumns', {
      hiddenColumns: hiddenColumns
    });
  };
  /**
   * Unihde column/columns
   * @memberof canvasDatagrid
   * @name unhideColumns
   * @method
   * @param {number} beginColumnOrderIndex The begin column order index
   * @param {number} [endColumnOrderIndex] The end column order index
   */


  self.unhideColumns = function (beginColumnOrderIndex, endColumnOrderIndex) {
    var orders = self.orders.columns;
    var schema = self.getSchema();

    for (var i = beginColumnOrderIndex; i <= endColumnOrderIndex; i++) {
      var columnIndex = orders[i];
      var s = schema[columnIndex];

      if (s && s.hidden) {
        s.hidden = false;
        self.dispatchEvent('columnunhide', {
          columnIndex: columnIndex
        });
      }
    }

    self.refresh();
  };
  /**
   * Hide rows
   * @memberof canvasDatagrid
   * @name hideRows
   * @method
   * @param {number} beginRowIndex The begin row index
   * @param {number} endRowIndex The end row index
   */


  self.hideRows = function (beginRowIndex, endRowIndex) {
    if ((0,_groups_util__WEBPACK_IMPORTED_MODULE_0__.mergeHiddenRowRanges)(self.hiddenRowRanges, [beginRowIndex, endRowIndex])) self.refresh();
  };
  /**
   * Unhide rows
   * @memberof canvasDatagrid
   * @name unhideRows
   * @method
   * @param {number} beginRowIndex The begin row index
   * @param {number} endRowIndex The end row index
   */


  self.unhideRows = function (beginRowIndex, endRowIndex) {
    self.hiddenRowRanges = self.hiddenRowRanges.filter(function (range) {
      return range[0] !== beginRowIndex || range[1] !== endRowIndex;
    });
    self.refresh();
  };
  /**
   * Resizes a column to fit the longest value in the column. Call without a value to resize all columns.
   * Warning, can be slow on very large record sets (1m records ~3-5 seconds on an i7).
   * @memberof canvasDatagrid
   * @name fitColumnToValues
   * @method
   * @param {string} name The name of the column to resize.
   */


  self.fitColumnToValues = function (name, internal) {
    if (!self.canvas) {
      return;
    }

    var columnIndex = name === 'cornerCell' ? -1 : self.getHeaderByName(name).index;
    var newSize = Math.max(self.findColumnMaxTextLength(name), self.style.minColumnWidth);
    self.sizes.columns[columnIndex] = newSize;
    self.dispatchEvent('resizecolumn', {
      x: newSize,
      y: self.resizingStartingHeight,
      draggingItem: self.currentCell
    });

    if (!internal) {
      self.resize();
      self.draw(true);
    }
  };
  /**
   * Checks if a cell is currently visible.
   * @memberof canvasDatagrid
   * @name isCellVisible
   * @overload
   * @method
   * @returns {boolean} when true, the cell is visible, when false the cell is not currently drawn.
   * @param {number} columnIndex The column index of the cell to check.
   * @param {number} rowIndex The row index of the cell to check.
   */


  self.isCellVisible = function (cell, rowIndex) {
    // overload
    if (rowIndex !== undefined) {
      return self.visibleCells.filter(function (c) {
        return c.columnIndex === cell && c.rowIndex === rowIndex;
      }).length > 0;
    }

    var x,
        l = self.visibleCells.length;

    for (x = 0; x < l; x += 1) {
      if (cell.x === self.visibleCells[x].x && cell.y === self.visibleCells[x].y) {
        return true;
      }
    }

    return false;
  };
  /**
   * Sets the order of the data.
   * @memberof canvasDatagrid
   * @name order
   * @method
   * @param {number} columnName Name of the column to be sorted.
   * @param {string} direction `asc` for ascending or `desc` for descending.
   * @param {function} [sortFunction] When defined, override the default sorting method defined in the column's schema and use this one.
   * @param {bool} [dontSetStorageData] Don't store this setting for future use.
   */


  self.order = function (columnName, direction, sortFunction, dontSetStorageData) {
    var f,
        c = self.getSchema().filter(function (col) {
      return col.name === columnName;
    });

    if (self.dispatchEvent('beforesortcolumn', {
      name: columnName,
      direction: direction
    })) {
      return;
    }

    self.orderBy = columnName;
    self.orderDirection = direction;

    if (!self.viewData || self.viewData.length === 0) {
      return;
    }

    if (c.length === 0) {
      throw new Error('Cannot sort.  No such column name');
    }

    f = sortFunction || c[0].sorter || self.sorters[c[0].type];

    if (!f && c[0].type !== undefined) {
      console.warn('Cannot sort type "%s" falling back to string sort.', c[0].type);
    }

    self.orderings.add(columnName, direction, typeof f === 'function' ? f : self.sorters.string);
    self.refresh();
    self.dispatchEvent('sortcolumn', {
      name: columnName,
      direction: direction
    });

    if (dontSetStorageData) {
      return;
    }

    self.setStorageData();
  };
  /**
   * Add grouping
   * @param {'columns'|'rows'} groupFor
   * @method
   * @param {number} from
   * @param {number} to
   */


  function addGroup(groupFor, from, to) {
    var newRow = false;
    var allGroups = groupFor === 'rows' ? self.groupedRows : self.groupedColumns;

    for (var i = allGroups.length - 1; i >= 0; i--) {
      var groups = allGroups[i];
      var min = groups[0].from,
          max = groups[groups.length - 1].to;

      if (from <= min && to >= max) {
        if (from === min && to === max && groups.length === 1) return; // nothings happened
        // new group wrap this row

        continue;
      }

      for (var gi = 0; gi < groups.length; gi++) {
        var g = groups[gi];
        if (from > g.to) continue;

        if (from >= g.from) {
          if (to > g.to) {
            if (from === g.from) {
              allGroups.splice(i, 0, [{
                from: from,
                to: to,
                collapsed: false
              }]);
              self.refresh();
              return;
            }

            throw new Error("Can't group these ".concat(groupFor));
          }

          if (to === g.to) {
            if (from === g.from) return; // nothings happened
          }

          newRow = true;
          break;
        }

        if (to >= g.from) {
          if (to < g.to) throw new Error("Can't group these ".concat(groupFor));
          allGroups.splice(i, 0, [{
            from: from,
            to: to,
            collapsed: false
          }]);
        } else {
          groups.splice(gi, 0, {
            from: from,
            to: to,
            collapsed: false
          });
        }

        self.refresh();
        return;
      }

      if (newRow) continue;
      groups.push({
        from: from,
        to: to,
        collapsed: false
      });
      self.refresh();
      return;
    }

    if (newRow) allGroups.push([{
      from: from,
      to: to,
      collapsed: false
    }]);else allGroups.unshift([{
      from: from,
      to: to,
      collapsed: false
    }]);
    self.refresh();
  }
  /**
   * Remove grouping
   * @param {Array<Array<{from:number,to:number,collapsed:boolean}>>} allGroups
   * @method
   * @param {number} from
   * @param {number} to
   */


  function removeGroup(allGroups, from, to) {
    for (var i = 0; i < allGroups.length; i++) {
      var groups = allGroups[i];

      for (var gi = 0; gi < groups.length; gi++) {
        var group = groups[gi];

        if (group.from === from && group.to === to) {
          if (groups.length <= 1) allGroups.splice(i, 1);else groups.splice(gi, 1);
          self.refresh();
          return;
        }
      }
    }
  }
  /**
   * Grouping columns
   * @memberof canvasDatagrid
   * @name groupColumns
   * @method
   * @param {number|string} firstColumnName Name of the first column to be grouped.
   * @param {number|string} lastColumnName Name of the last column to be grouped.
   */


  self.groupColumns = function (firstColumnName, lastColumnName) {
    /** @type {Array<{name: string,columnIndex:number}>} */
    var schema = self.getSchema();
    var firstOne, lastOne;

    for (var i = 0; i < schema.length; i++) {
      var it = schema[i];
      if (firstOne && lastOne) break;

      if (it.name === firstColumnName) {
        firstOne = it;
        continue;
      }

      if (it.name === lastColumnName) {
        lastOne = it;
        continue;
      }
    }

    if (!firstOne) throw new Error("No such column name for first column");
    if (!lastOne) throw new Error("No such column name for last column");
    if (lastOne.columnIndex > firstOne.columnIndex !== true) throw new Error("Can't group these columns");
    var from = firstOne.columnIndex;
    var to = lastOne.columnIndex;
    var ev = {
      group: {
        type: 'columns',
        from: from,
        to: to
      }
    };

    try {
      addGroup('columns', from, to);
    } catch (error) {
      ev.error = error;
    }

    self.dispatchEvent('aftercreategroup', ev);
  };
  /**
   * Grouping columns
   * @memberof canvasDatagrid
   * @name groupRows
   * @method
   * @param {number} rowIndexFrom The row index which is the beginning of the group
   * @param {number} rowIndexTo The row index which is the end of the group
   */


  self.groupRows = function (rowIndexFrom, rowIndexTo) {
    if (!Number.isInteger(rowIndexFrom) || rowIndexFrom < 0) throw new Error("No such row for the beginning of the group");
    var dataLength = self.viewData.length;
    if (!Number.isInteger(rowIndexFrom) || rowIndexTo <= rowIndexFrom || rowIndexTo >= dataLength) throw new Error("No such row for the end of the group");
    var ev = {
      group: {
        type: 'rows',
        from: rowIndexFrom,
        to: rowIndexTo
      }
    };

    try {
      addGroup('rows', rowIndexFrom, rowIndexTo);
    } catch (error) {
      ev.error = error;
    }

    self.dispatchEvent('aftercreategroup', ev);
  };
  /**
   * Remove grouping columns
   * @memberof canvasDatagrid
   * @name removeGroupColumns
   * @method
   * @param {number|string} firstColumnName Name of the first column to be grouped.
   * @param {number|string} lastColumnName Name of the last column to be grouped.
   */


  self.removeGroupColumns = function (firstColumnName, lastColumnName) {
    /** @type {Array<{name:string,columnIndex:number}>} */
    var schema = self.getSchema();
    var firstOne, lastOne;

    for (var i = 0; i < schema.length; i++) {
      var it = schema[i];
      if (firstOne && lastOne) break;

      if (it.name === firstColumnName) {
        firstOne = it;
        continue;
      }

      if (it.name === lastColumnName) {
        lastOne = it;
        continue;
      }
    }

    if (!firstOne) throw new Error("No such column name for first column");
    if (!lastOne) throw new Error("No such column name for last column");
    var from = firstOne.columnIndex;
    var to = lastOne.columnIndex;
    removeGroup(self.groupedColumns, from, to);
  };
  /**
   * Remove grouping columns
   * @memberof canvasDatagrid
   * @name removeGroupRows
   * @method
   * @param {number} rowIndexFrom The row index which is the beginning of the group
   * @param {number} rowIndexTo The row index which is the end of the group
   */


  self.removeGroupRows = function (rowIndexFrom, rowIndexTo) {
    removeGroup(self.groupedRows, rowIndexFrom, rowIndexTo);
  };
  /**
   * Toggle(expand/collapsed) grouping columns
   * @memberof canvasDatagrid
   * @name toggleGroupColumns
   * @method
   * @param {number|string} firstColumnName Name of the first column to be grouped.
   * @param {number|string} lastColumnName Name of the last column to be grouped.
   */


  self.toggleGroupColumns = function (firstColumnName, lastColumnName) {
    /** @type {Array<{name:string,columnIndex:number}>} */
    var schema = self.getSchema();
    var firstOne, lastOne;

    for (var i = 0; i < schema.length; i++) {
      var it = schema[i];
      if (firstOne && lastOne) break;

      if (it.name === firstColumnName) {
        firstOne = it;
        continue;
      }

      if (it.name === lastColumnName) {
        lastOne = it;
        continue;
      }
    }

    if (!firstOne || !lastOne) return;
    var from = firstOne.columnIndex;
    var to = lastOne.columnIndex;

    if (self.toggleGroup({
      type: 'c',
      from: from,
      to: to
    })) {
      self.disposeContextMenu();
      self.setStorageData();
      self.refresh();
    }
  };
  /**
   * Toggle(expand/collapsed) grouping rows
   * @memberof canvasDatagrid
   * @name toggleGroupRows
   * @method
   * @param {number} rowIndexFrom The row index which is the beginning of the group
   * @param {number} rowIndexTo The row index which is the end of the group
   */


  self.toggleGroupRows = function (rowIndexFrom, rowIndexTo) {
    if (self.toggleGroup({
      type: 'r',
      from: rowIndexFrom,
      to: rowIndexTo
    })) {
      self.disposeContextMenu();
      self.setStorageData();
      self.refresh();
    }
  };

  self.isInGrid = function (e) {
    if (e.x < 0 || e.x > self.width || e.y < 0 || e.y > self.height) {
      return false;
    }

    return true;
  };
  /**
   * Moves the current selection relative to the its current position.  Note: this method does not move the selected data, just the selection itself.
   * @memberof canvasDatagrid
   * @name moveSelection
   * @method
   * @param {number} offsetX The number of columns to offset the selection.
   * @param {number} offsetY The number of rows to offset the selection.
   */


  self.moveSelection = function (offsetX, offsetY) {
    var sel = [];
    self.selectedRows = [];
    self.selectedColumns = [];
    self.selections.forEach(function (row, rowIndex) {
      sel[rowIndex + offsetY] = [];
      self.selectedRows.push(rowIndex + offsetY);
      row.forEach(function (colIndex) {
        sel[rowIndex + offsetY].push(colIndex + offsetX);
        if (self.selectedColumns.indexOf(colIndex + offsetX) === -1) self.selectedColumns.push(colIndex + offsetX);
      });
    });
    self.selections = sel;
  };
  /**
   * Deletes currently selected data.
   * @memberof canvasDatagrid
   * @name deleteSelectedData
   * @method
   * @param {boolean} dontDraw Suppress the draw method after the selection change.
   */


  self.deleteSelectedData = function (dontDraw) {
    var affectedCells = self.clearSelectedCells();
    self.dispatchEvent('afterdelete', {
      cells: affectedCells
    });

    if (dontDraw) {
      return;
    }

    requestAnimationFrame(function () {
      return self.draw();
    });
  };
  /**
   * Moves data in the provided selection to another position in the grid.  Moving data off the edge of the schema (columns/x) will truncate data.
   * @memberof canvasDatagrid
   * @name moveTo
   * @method
   * @param {array} sel 2D array representing selected rows and columns.  `canvasDatagrid.selections` is in this format and can be used here.
   * @param {number} x The column index to start inserting the selection at.
   * @param {number} y The row index to start inserting the selection at.
   */


  self.moveTo = function (sel, x, y) {
    var selectedData = self.getSelectedData(),
        visibleSchema = self.getVisibleSchema(),
        selectionLength = sel.length,
        xi,
        maxRowLength = -Infinity,
        minXi = Infinity,
        yi = y - 1;
    sel.forEach(function (row, rowIndex) {
      if (rowIndex === selectionLength) {
        return;
      }

      if (row.length === 0) {
        return;
      }

      minXi = Math.min(self.getVisibleColumnIndexOf(x), minXi);
      maxRowLength = Math.max(maxRowLength, row.length);
      row.forEach(function (colIndex) {
        // intentional redef of colIndex
        colIndex = self.getVisibleColumnIndexOf(colIndex);

        if (!visibleSchema[colIndex]) {
          return;
        } // TODO:


        if (!self.data) {
          self.data = {};
        }

        if (!self.data[rowIndex]) {
          self.data[rowIndex] = {};
        } // TODO:


        self.data[rowIndex][visibleSchema[colIndex].name] = null;
      });
    });
    sel.forEach(function (row, index) {
      var lastSourceIndex;
      yi += 1;
      xi = self.getVisibleColumnIndexOf(x);
      row.forEach(function (colIndex, cidx) {
        colIndex = self.getVisibleColumnIndexOf(colIndex);

        if (cidx > 0) {
          // this confusing bit of nonsense figures out
          // if the selection has skipped cells
          xi += colIndex - lastSourceIndex;
        }

        lastSourceIndex = colIndex;

        if (colIndex === -1 || !visibleSchema[xi] || !visibleSchema[colIndex] || // TODO:
        self.data.length - 1 < yi || yi < 0) {
          return;
        } // TODO:


        if (!self.data[yi]) {
          self.data[yi] = {};
        } // TODO:


        self.data[yi][visibleSchema[xi].name] = selectedData[index][visibleSchema[colIndex].name];
      });
    });
  };
  /**
   * Get the column group info given column belongs to
   * @memberof canvasDatagrid
   * @name getGroupsColumnBelongsTo
   * @method
   * @param {number} columnIndex Column index.
   * @returns {Array<{from:number,to:number,collapsed:boolean}>}
   */


  self.getGroupsColumnBelongsTo = function (columnIndex) {
    if (!self.attributes.allowGroupingColumns) return [];
    var result = [];

    for (var i = 0; i < self.groupedColumns.length; i++) {
      var groups = self.groupedColumns[i];

      for (var j = 0; j < groups.length; j++) {
        var group = groups[j];

        if (columnIndex >= group.from && columnIndex <= group.to) {
          result.push(group);
          break;
        }
      }
    }

    return result;
  };
  /**
   * Get the row group info given row belongs to
   * @memberof canvasDatagrid
   * @name getGroupsRowBelongsTo
   * @method
   * @param {number} rowIndex Row index.
   * @returns {Array<{from:number,to:number,collapsed:boolean}>}
   */


  self.getGroupsRowBelongsTo = function (rowIndex) {
    if (!self.attributes.allowGroupingRows) return [];
    var result = [];

    for (var i = 0; i < self.groupedRows.length; i++) {
      var groups = self.groupedRows[i];

      for (var j = 0; j < groups.length; j++) {
        var group = groups[j];

        if (rowIndex >= group.from && rowIndex <= group.to) {
          result.push(group);
          break;
        }
      }
    }

    return result;
  };
  /**
   * Checks if a given column is visible.
   * @memberof canvasDatagrid
   * @name isColumnVisible
   * @method
   * @returns {boolean} When true, the column is visible.
   * @param {number} columnIndex Column index.
   */


  self.isColumnVisible = function (columnIndex) {
    return self.visibleCells.filter(function (c) {
      return c.columnIndex === columnIndex;
    }).length > 0;
  };
  /**
   * Checks if a given row is visible.
   * @memberof canvasDatagrid
   * @name isRowVisible
   * @method
   * @returns {boolean} When true, the row is visible.
   * @param {number} rowIndex Row index.
   */


  self.isRowVisible = function (rowIndex) {
    return self.visibleCells.filter(function (c) {
      return c.rowIndex === rowIndex;
    }).length > 0;
  };
  /**
   * Gets the cell at columnIndex and rowIndex.
   * @memberof canvasDatagrid
   * @name getVisibleCellByIndex
   * @method
   * @returns {cell} cell at the selected location.
   * @param {number} x Column index.
   * @param {number} y Row index.
   */


  self.getVisibleCellByIndex = function (x, y) {
    return self.visibleCells.filter(function (c) {
      return c.columnIndex === x && c.rowIndex === y;
    })[0];
  };
  /**
   * Get an unhide indicator at grid pixel coordinate x and y.
   * @memberof canvasDatagrid
   * @name getUnhideIndicator
   * @method
   * @param {number} x Number of pixels from the left.
   * @param {number} y Number of pixels from the top.
   */


  self.getUnhideIndicator = function (x, y) {
    var indicators = self.visibleUnhideIndicators;
    if (indicators.length <= 0) return;

    for (var i = 0; i < indicators.length; i++) {
      var indicator = indicators[i];
      if (x >= indicator.x && y >= indicator.y && x <= indicator.x2 && y <= indicator.y2) return indicator;
    }
  };
  /**
   * Get a column group at grid pixel coordinate x and y.
   * @memberof canvasDatagrid
   * @name getColumnGroupAt
   * @method
   * @param {number} x Number of pixels from the left.
   * @param {number} y Number of pixels from the top.
   */


  self.getColumnGroupAt = function (x, y) {
    var groups = self.groupedColumns.length;
    if (groups <= 0) return;
    var yZero = self.getColumnGroupAreaHeight();
    if (y >= yZero) return;

    for (var i = 0; i < self.visibleGroups.length; i++) {
      var g = self.visibleGroups[i];
      if (g.type !== 'c') continue;
      if (x >= g.x && y >= g.y && x <= g.x2 && y <= g.y2) return g;
    }
  };
  /**
   * Get a row group at grid pixel coordinate x and y.
   * @memberof canvasDatagrid
   * @name getRowGroupAt
   * @method
   * @param {number} x Number of pixels from the left.
   * @param {number} y Number of pixels from the top.
   */


  self.getRowGroupAt = function (x, y) {
    var groups = self.groupedRows.length;
    if (groups <= 0) return;
    var xZero = self.getRowGroupAreaWidth();
    if (x >= xZero) return;

    for (var i = 0; i < self.visibleGroups.length; i++) {
      var g = self.visibleGroups[i];
      if (g.type !== 'r') continue;
      if (x >= g.x && y >= g.y && x <= g.x2 && y <= g.y2) return g;
    }
  };
  /**
   * Gets the cell at grid pixel coordinate x and y.  Author's note.  This function ties drawing and events together.  This is a very complex function and is core to the component.
   * @memberof canvasDatagrid
   * @name getCellAt
   * @method
   * @returns {cell} cell at the selected location.
   * @param {number} x Number of pixels from the left.
   * @param {number} y Number of pixels from the top.
   */


  self.getCellAt = function (x, y, useTouchScrollZones) {
    function getBorder(entitiy) {
      if (entitiy.x + entitiy.width - self.attributes.borderResizeZone * 0.4 < x && entitiy.x + entitiy.width + self.attributes.borderResizeZone * 0.6 > x) {
        return 'r';
      }

      if (entitiy.x - self.attributes.borderResizeZone * 0.4 < x && entitiy.x + self.attributes.borderResizeZone * 0.6 > x) {
        return 'l';
      }

      if (entitiy.y + entitiy.height - self.attributes.borderResizeZone * 0.4 < y && entitiy.y + entitiy.height + self.attributes.borderResizeZone * 0.6 > y) {
        return 'b';
      }

      if (entitiy.y - self.attributes.borderResizeZone * 0.4 < y && entitiy.y + self.attributes.borderResizeZone * 0.6 > y) {
        return 't';
      }
    }

    if (!self.visibleCells) {
      return;
    }

    x -= self.getRowGroupAreaWidth();
    y -= self.getColumnGroupAreaHeight();

    if (self.dragStartObject !== undefined) {
      if (x <= 0) x = 1;
      if (x >= self.width) x = self.width - 1;
      if (y <= 0) y = 1;
      if (y >= self.height) y = self.height - 1;
    }

    var border,
        tsz = useTouchScrollZones ? self.attributes.touchScrollZone : 0,
        moveMode = self.attributes.borderDragBehavior === 'move',
        i,
        l = self.visibleCells.length,
        moveBorder,
        xBorderBehavior = moveMode ? self.cursorGrab : 'ew-resize',
        yBorderBehavior = moveMode ? self.cursorGrab : 'ns-resize',
        cell,
        entitiy;

    if (!self.visibleCells || !self.visibleCells.length) {
      return;
    }

    self.hasFocus = true;

    if (!(y < self.height && y > 0 && x < self.width && x > 0)) {
      self.hasFocus = false;
      return {
        dragContext: 'inherit',
        context: 'inherit'
      };
    }

    for (i = 0; i < l; i += 1) {
      cell = self.visibleCells[i]; // interactive dimensions of the cell.  used for touch "over size" zones

      entitiy = {
        x: cell.x,
        y: cell.y,
        height: cell.height,
        width: cell.width
      };

      if (useTouchScrollZones && /(vertical|horizontal)-scroll-/.test(cell.style)) {
        entitiy.x -= tsz;
        entitiy.y -= tsz;
        entitiy.height += tsz;
        entitiy.width += tsz;
      }

      if (entitiy.x - self.style.cellBorderWidth < x && entitiy.x + entitiy.width + self.style.cellBorderWidth > x && entitiy.y - self.style.cellBorderWidth < y && entitiy.y + entitiy.height + self.style.cellBorderWidth > y) {
        if (/frozen-row-marker/.test(cell.style)) {
          if (self.dragMode === 'frozen-column-marker') continue;
          cell.dragContext = cell.style;
          cell.context = 'grab';
          return cell;
        }

        if (/frozen-column-marker/.test(cell.style)) {
          if (self.dragMode === 'frozen-row-marker') continue;
          cell.dragContext = cell.style;
          cell.context = 'grab';
          return cell;
        }

        if (/selection-handle-/.test(cell.style)) {
          cell.dragContext = cell.style;
          cell.context = 'crosshair';
          return cell;
        }

        if (/vertical-scroll-(bar|box)/.test(cell.style)) {
          cell.dragContext = 'vertical-scroll-box';
          cell.context = 'vertical-scroll-box';
          cell.isScrollBar = true;
          cell.isVerticalScrollBar = true;

          if (y > self.scrollBox.box.v.y + self.scrollBox.scrollBoxHeight) {
            cell.dragContext = 'vertical-scroll-bottom';
            cell.context = 'vertical-scroll-bottom';
          } else if (y < self.scrollBox.box.v.y) {
            cell.dragContext = 'vertical-scroll-top';
            cell.context = 'vertical-scroll-top';
          }

          self.cursor = 'default';
          return cell;
        }

        if (/horizontal-scroll-(bar|box)/.test(cell.style)) {
          cell.dragContext = 'horizontal-scroll-box';
          cell.context = 'horizontal-scroll-box';
          cell.isScrollBar = true;
          cell.isHorizontalScrollBar = true;

          if (x > self.scrollBox.box.h.x + self.scrollBox.scrollBoxWidth) {
            cell.dragContext = 'horizontal-scroll-right';
            cell.context = 'horizontal-scroll-right';
          } else if (x < self.scrollBox.box.h.x) {
            cell.dragContext = 'horizontal-scroll-left';
            cell.context = 'horizontal-scroll-left';
          }

          self.cursor = 'default';
          return cell;
        }

        border = getBorder(entitiy); // check if the border of this cell is the border of the selection and if so show move cursor in move mode

        moveBorder = moveMode && cell.selectionBorder && cell.selectionBorder.indexOf(border) !== -1;

        if (['l', 'r'].indexOf(border) !== -1 && (self.attributes.allowColumnResize || moveBorder) && (self.attributes.allowColumnResizeFromCell && cell.isNormal || !cell.isNormal || moveBorder) && (self.attributes.allowRowHeaderResize && (cell.isRowHeader || cell.isCorner) || !(cell.isRowHeader && cell.isCorner))) {
          if ((cell.isColumnHeader || cell.isCorner || self.attributes.allowColumnResizeFromCell && cell.isNormal) && border === 'r') {
            cell.context = 'ew-resize';
            cell.dragContext = 'ew-resize';
            return cell;
          }

          if (!(cell.isColumnHeader || cell.isCorner) && moveBorder) {
            cell.context = xBorderBehavior;
            cell.dragContext = border + '-move';
            return cell;
          }
        }

        if (['t', 'b'].indexOf(border) !== -1 && cell.rowIndex > -1 && (self.attributes.allowRowResize || moveBorder) && (self.attributes.allowRowResizeFromCell && cell.isNormal || !cell.isNormal || moveBorder) && !cell.isColumnHeader) {
          if ((cell.isRowHeader || cell.isCorner || self.attributes.allowRowResizeFromCell && cell.isNormal) && border === 'b') {
            cell.context = 'ns-resize';
            cell.dragContext = 'ns-resize';
            return cell;
          }

          if (!(cell.isRowHeader || cell.isCorner) && moveBorder) {
            cell.context = yBorderBehavior;
            cell.dragContext = border + '-move';
            return cell;
          }
        }

        if (cell.style === 'columnHeaderCell') {
          if (!self.isColumnSelected(cell.columnIndex) && cell.x + cell.width - self.attributes.columnGrabZoneSize - self.style.cellBorderWidth > x || !self.attributes.allowRowReordering) {
            cell.dragContext = 'cell';
            cell.context = 'cell';
          } else {
            cell.context = self.cursorGrab;
            cell.dragContext = 'column-reorder';
          }

          return cell;
        }

        if (cell.style === 'rowHeaderCell') {
          if (!self.isRowSelected(cell.rowIndex) && self.attributes.rowGrabZoneSize + (cell.y - self.style.cellBorderWidth) < y || !self.attributes.allowRowReordering) {
            cell.dragContext = 'cell';
            cell.context = 'cell';
          } else {
            cell.context = self.cursorGrab;
            cell.dragContext = 'row-reorder';
          }

          return cell;
        }

        if (cell.isGrid) {
          self.hasFocus = false;
          cell.dragContext = 'cell-grid';
          cell.context = 'cell-grid';
          return cell;
        }

        if (cell.style === 'tree-grid') {
          self.hasFocus = false;
          cell.dragContext = 'tree';
          cell.context = 'tree';
          return cell;
        }

        cell.dragContext = 'cell';
        cell.context = 'cell';
        return cell;
      }
    }

    self.hasFocus = true;
    self.cursor = 'default';
    return {
      dragContext: 'background',
      context: 'background',
      style: 'background',
      isBackground: true
    };
  };
  /**
   * Gets the bounds of current selection.
   * @returns {rect} selection.
   * @memberof canvasDatagrid
   * @name getSelectionBounds
   * @method
   */


  self.getSelectionBounds = function () {
    var low = {
      x: Infinity,
      y: Infinity
    },
        high = {
      x: -Infinity,
      y: -Infinity
    };
    self.selections.forEach(function (row, rowIndex) {
      var maxCol, minCol;
      low.y = rowIndex < low.y ? rowIndex : low.y;
      high.y = rowIndex > high.y ? rowIndex : high.y;
      maxCol = Math.max.apply(null, row);
      minCol = Math.min.apply(null, row);
      low.x = minCol < low.x ? minCol : low.x;
      high.x = maxCol > high.x ? maxCol : high.x;
    });
    return {
      top: low.y,
      left: low.x,
      bottom: high.y,
      right: high.x
    };
  };
  /**
   * Returns an auto generated schema based on data structure.
   * @memberof canvasDatagrid
   * @name getSchemaFromData
   * @method
   * @tutorial schema
   * @returns {schema} schema A schema based on the first item in the data array.
   */


  self.getSchemaFromData = function (d) {
    d = d || self.originalData;
    return Object.keys(d[0] || {
      ' ': ''
    }).map(function mapEachSchemaColumn(key, index) {
      var type = self.getBestGuessDataType(key, d),
          i = {
        name: key,
        title: isNaN(parseInt(key, 10)) ? key : self.integerToAlpha(key).toUpperCase(),
        index: index,
        columnIndex: index,
        type: type,
        filter: self.filter(type)
      };

      if (self.storedSettings && self.storedSettings.visibility && self.storedSettings.visibility[i.name] !== undefined) {
        i.hidden = !self.storedSettings.visibility[i.name];
      }

      return i;
    });
  };
  /**
   * Clears the change log grid.changes that keeps track of changes to the data set.
   * This does not undo changes or alter data it is simply a convince array to keep
   * track of changes made to the data since last this method was called.
   * @memberof canvasDatagrid
   * @name clearChangeLog
   * @method
   */


  self.clearChangeLog = function () {
    self.changes = [];
  };
  /**
   * Selects an area of the grid.
   * @memberof canvasDatagrid
   * @name selectArea
   * @method
   * @param {rect} bounds A rect object representing the selected values.
   */


  self.selectArea = function (bounds, ctrl) {
    self.selectionBounds = bounds || self.selectionBounds;
    var ev,
        x,
        y,
        s = self.getSchema();

    if (!ctrl) {
      self.selections = [];
      self.selectedRows = [];
      self.selectedColumns = [];
    }

    if (self.selectionBounds.top < -1 || self.selectionBounds.bottom > self.viewData.length || self.selectionBounds.left < -1 || self.selectionBounds.right > s.length) {
      throw new Error('Impossible selection area');
    }

    for (x = self.selectionBounds.top; x <= self.selectionBounds.bottom; x += 1) {
      self.selections[x] = [];
      self.selectedRows.push(x);

      for (y = self.selectionBounds.left; y <= self.selectionBounds.right; y += 1) {
        if (self.selections[x].indexOf(y) === -1) {
          self.selections[x].push(y);
        }

        if (y !== -1 && self.selectedColumns.indexOf(y) === -1) {
          self.selectedColumns.push(y);
        }
      }
    }

    ev = {
      selections: self.selections,
      selectionBounds: self.selectionBounds,
      selectedCells: self.getSelectedCells()
    };
    Object.defineProperty(ev, 'selectedData', {
      get: function get() {
        return self.getSelectedData();
      }
    });
    self.dispatchEvent('selectionchanged', ev);
  };
  /**
   * Returns the maximum text width for a given column by column name.
   * @memberof canvasDatagrid
   * @name findColumnMaxTextLength
   * @method
   * @returns {number} The number of pixels wide the maximum width value in the selected column.
   * @param {string} name The name of the column to calculate the value's width of.
   */


  self.findColumnMaxTextLength = function (name) {
    var m = -Infinity;

    if (name === 'cornerCell') {
      self.ctx.font = self.style.rowHeaderCellFont;
      return self.ctx.measureText((self.viewData.length + (self.attributes.showNewRow ? 1 : 0)).toString()).width + self.style.autosizePadding + self.style.autosizeHeaderCellPadding + self.style.rowHeaderCellPaddingRight + self.style.rowHeaderCellPaddingLeft + (self.attributes.tree ? self.style.treeArrowWidth + self.style.treeArrowMarginLeft + self.style.treeArrowMarginRight : 0);
    }

    var formatter = null;
    self.getSchema().forEach(function (col) {
      if (col.name !== name) {
        return;
      }

      self.ctx.font = self.style.columnHeaderCellFont;
      var t = self.ctx.measureText(col.title || col.name).width + self.style.columnHeaderCellPaddingRight + self.style.columnHeaderCellPaddingLeft + self.style.cellAutoResizePadding;
      m = t > m ? t : m;
      formatter = self.formatters[col.type];
    });
    self.viewData.forEach(function (row) {
      var text = row[name];

      if (formatter) {
        text = formatter({
          cell: {
            value: text
          }
        });
      }

      self.ctx.font = self.style.cellFont;
      var t = self.ctx.measureText(text).width + self.style.cellPaddingRight + self.style.cellPaddingLeft + self.style.cellAutoResizePadding;
      m = t > m ? t : m;
    });
    return m;
  };
  /**
   * Gets the total width of all header columns.
   * @memberof canvasDatagrid
   * @name getHeaderWidth
   * @method
   */


  self.getHeaderWidth = function () {
    return self.getVisibleSchema().reduce(function (total, header) {
      return total + parseInt(header.width || self.style.cellWidth, 10);
    }, 0);
  };
  /**
   * Gets the height of a row by index.
   * @memberof canvasDatagrid
   * @name getRowHeight
   * @method
   * @param {number} rowIndex The row index to lookup.
   */


  self.getRowHeight = function (rowIndex) {
    return (self.sizes.rows[rowIndex] || self.style.cellHeight) * self.scale;
  };
  /**
   * Gets the width of a column by index.
   * @memberof canvasDatagrid
   * @name getColumnWidth
   * @method
   * @param {number} columnIndex The column index to lookup.
   */


  self.getColumnWidth = function (columnIndex) {
    return (self.sizes.columns[columnIndex] || self.getSchema()[columnIndex].width || self.style.cellWidth) * self.scale;
  };

  self.formatters.string = function cellFormatterString(e) {
    return e.cell.value !== undefined ? e.cell.value : '';
  };

  self.formatters.rowHeaderCell = self.formatters.string;
  self.formatters.headerCell = self.formatters.string;
  self.formatters.number = self.formatters.string;
  self.formatters["int"] = self.formatters.string;
  self.formatters.html = self.formatters.string;

  self.sorters.string = function (columnName, direction) {
    var asc = direction === 'asc';
    return function (a, b) {
      var aValue = a[columnName] || '';
      var bValue = b[columnName] || '';

      if (asc) {
        if (!aValue.localeCompare) {
          return 1;
        }

        return aValue.localeCompare(bValue);
      }

      if (!bValue.localeCompare) {
        return 1;
      }

      return bValue.localeCompare(aValue);
    };
  };

  self.sorters.number = function (columnName, direction) {
    var asc = direction === 'asc';
    return function (a, b) {
      if (asc) {
        return a[columnName] - b[columnName];
      }

      return b[columnName] - a[columnName];
    };
  };

  self.sorters.date = function (columnName, direction) {
    var asc = direction === 'asc';
    return function (a, b) {
      if (asc) {
        return new Date(a[columnName]).getTime() - new Date(b[columnName]).getTime();
      }

      return new Date(b[columnName]).getTime() - new Date(a[columnName]).getTime();
    };
  };
}

/***/ }),

/***/ "./lib/touch.js":
/*!**********************!*\
  !*** ./lib/touch.js ***!
  \**********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/*jslint browser: true, unparam: true, todo: true, plusplus: true*/

/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(self) {
  var touchTimerMs = 50,
      debounceTouchMove,
      touchMoving,
      touchScrollTimeout;
  self.scrollAnimation = {};
  self.touchDelta = {};
  self.touchAnimateTo = {};
  self.animationFrames = 0;

  self.getTouchPos = function (e, touchIndex) {
    var t = touchIndex ? e.touches[touchIndex] : e.touches[0],
        rect = self.canvas.getBoundingClientRect(),
        pos;

    if (!t) {
      return;
    }

    pos = {
      x: t.clientX - rect.left,
      y: t.clientY - rect.top
    };

    if (self.isChildGrid) {
      pos.x -= self.canvasOffsetLeft;
      pos.y -= self.canvasOffsetTop;
    }

    return {
      x: pos.x,
      y: pos.y,
      rect: rect
    };
  }; // shamelessly stolen from from https://gist.github.com/gre/1650294


  self.easingFunctions = {
    linear: function linear(t) {
      return t;
    },
    easeInQuad: function easeInQuad(t) {
      return t * t;
    },
    easeOutQuad: function easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad: function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic: function easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic: function easeOutCubic(t) {
      return --t * t * t + 1;
    },
    easeInOutCubic: function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart: function easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart: function easeOutQuart(t) {
      return 1 - --t * t * t * t;
    },
    easeInOutQuart: function easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    easeInQuint: function easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint: function easeOutQuint(t) {
      return 1 + --t * t * t * t * t;
    },
    easeInOutQuint: function easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  self.easing = function (t, b, c, d) {
    return c * self.easingFunctions[self.attributes.touchEasingMethod](t / d) + b;
  };

  self.calculatePPSTimed = function () {
    self.xPPST = -((self.touchDelta.x - self.touchSigmaTimed.x) / (self.touchDelta.t - self.touchSigmaTimed.t));
    self.yPPST = -((self.touchDelta.y - self.touchSigmaTimed.y) / (self.touchDelta.t - self.touchSigmaTimed.t));
    self.touchSigmaTimed = {
      x: self.touchDelta.x,
      y: self.touchDelta.y,
      t: performance.now()
    };
  };

  self.calculatePPS = function () {
    self.xPPS = -((self.touchDelta.x - self.touchSigma.x) / (self.touchDelta.t - self.touchSigma.t));
    self.yPPS = -((self.touchDelta.y - self.touchSigma.y) / (self.touchDelta.t - self.touchSigma.t));
    self.touchSigma = {
      x: self.touchDelta.x,
      y: self.touchDelta.y,
      t: performance.now()
    };
  };

  self.touchEndAnimation = function () {
    if (!self.canvas || !self.scrollBox.scrollTo) {
      return requestAnimationFrame(self.touchEndAnimation);
    }

    var n = performance.now(),
        d = self.attributes.touchReleaseAnimationDurationMs,
        t;
    t = n - self.touchDelta.t;
    self.animationFrames += 1;
    self.scrollAnimation.x = self.easing(t, self.touchDelta.scrollLeft, self.touchAnimateTo.x, d);
    self.scrollAnimation.y = self.easing(t, self.touchDelta.scrollTop, self.touchAnimateTo.y, d);

    if (t > d || self.scrollAnimation.y === self.scrollBox.scrollTop && self.scrollAnimation.x === self.scrollBox.scrollLeft || self.stopAnimation) {
      return;
    }

    self.scrollBox.scrollTo(self.scrollAnimation.x, self.scrollAnimation.y);
    requestAnimationFrame(self.touchEndAnimation);
  };

  self.touchEditCell = function (cell) {
    self.beginEditAt(cell.columnIndex, cell.rowIndex);
  };

  self.touchstart = function (e) {
    if (e.changedTouches[0]) {
      self.touchStart = self.getTouchPos(e);
      self.startingCell = self.getCellAt(self.touchStart.x, self.touchStart.y, true);
    }

    if (self.dispatchEvent('touchstart', {
      NativeEvent: e,
      cell: self.startingCell
    })) {
      return;
    }

    self.disposeContextMenu();
    clearInterval(self.calculatePPSTimer);
    clearTimeout(self.touchContextTimeout);
    self.touchStartEvent = e;
    self.stopAnimation = true;
    self.animationFrames = 0;
    self.stopPropagation(e);

    if (e.touches.length === 1 && e.changedTouches[0] && !self.zoomAltered) {
      self.touchLength = 1;
      self.touchStart = self.touchStart || self.touchStart1;
      self.touchScrollStart = {
        x: self.scrollBox.scrollLeft,
        y: self.scrollBox.scrollTop,
        t: performance.now()
      };
      self.touchDelta = {
        x: 0,
        y: 0,
        scrollLeft: self.scrollBox.scrollLeft,
        scrollTop: self.scrollBox.scrollTop,
        t: self.touchScrollStart.t
      };
      self.touchSigma = {
        x: self.touchDelta.x,
        y: self.touchDelta.y,
        t: self.touchDelta.t
      };
      self.touchSigmaTimed = {
        x: self.touchDelta.x,
        y: self.touchDelta.y,
        t: self.touchDelta.t
      };
      self.touchContextTimeout = setTimeout(function () {
        self.contextmenuEvent(e, self.touchStart);
      }, self.attributes.touchContextMenuTimeMs);
      self.calculatePPSTimer = setInterval(self.calculatePPSTimed, touchTimerMs);

      if (self.startingCell && (self.startingCell.isGrid || ['tree', 'inherit'].indexOf(self.startingCell.context) !== -1)) {
        self.hasFocus = false;
        return;
      }

      self.hasFocus = true;

      if (self.startingCell.isHeader) {
        if (self.startingCell.isRowHeader) {
          self.selectArea({
            top: self.startingCell.rowIndex,
            bottom: self.startingCell.rowIndex,
            left: 0,
            right: self.getVisibleSchema().length - 1
          });
          self.draw(true);
        } else if (self.startingCell.isColumnHeader) {
          if (self.attributes.columnHeaderClickBehavior === 'sort') {
            if (self.orderBy === self.startingCell.header.name) {
              self.orderDirection = self.orderDirection === 'asc' ? 'desc' : 'asc';
            } else {
              self.orderDirection = 'asc';
            }

            self.order(self.startingCell.header.name, self.orderDirection);
          }

          if (self.attributes.columnHeaderClickBehavior === 'select') {
            self.selectArea({
              top: 0,
              bottom: self.viewData.length - 1,
              left: self.startingCell.columnIndex,
              right: self.startingCell.columnIndex
            });
            self.draw(true);
          }
        }

        self.touchEndEvents(e);
        return;
      }
    }

    if (self.zoomAltered) {
      return;
    }

    document.body.addEventListener('touchmove', self.touchmove, {
      passive: false
    });
    document.body.addEventListener('touchend', self.touchend, false);
    document.body.addEventListener('touchcancel', self.touchcancel, false);
    self.draw(true);
  };

  self.touchSelect = function (cell, handleType) {
    if (cell.rowIndex === undefined || cell.columnIndex === undefined) {
      return;
    }

    self.touchSelecting = true;
    var bounds = self.getSelectionBounds();

    if (handleType === 'selection-handle-bl' && cell.rowIndex >= bounds.top && cell.columnIndex <= bounds.right) {
      bounds.bottom = cell.rowIndex;
      bounds.left = cell.columnIndex;
    } else if (handleType === 'selection-handle-tl' && cell.rowIndex <= bounds.bottom && cell.columnIndex <= bounds.right) {
      bounds.top = cell.rowIndex;
      bounds.left = cell.columnIndex;
    } else if (handleType === 'selection-handle-tr' && cell.rowIndex <= bounds.bottom && cell.columnIndex >= bounds.left) {
      bounds.top = cell.rowIndex;
      bounds.right = cell.columnIndex;
    } else if (handleType === 'selection-handle-br' && cell.rowIndex >= bounds.top && cell.columnIndex >= bounds.left) {
      bounds.bottom = cell.rowIndex;
      bounds.right = cell.columnIndex;
    }

    if (self.attributes.selectionMode === 'row' || cell.rowIndex === -1) {
      bounds.left = 0;
      bounds.right = self.getSchema().length - 1;
    } else {
      bounds.left = Math.max(0, bounds.left);
    }

    self.selectArea(bounds);
    self.draw(true);
  };

  function touchMove(e) {
    var ch, rw, rScrollZone, lScrollZone, bScrollZone, tScrollZone, sbw, t1, t2;

    if (self.dispatchEvent('beforetouchmove', {
      NativeEvent: e
    })) {
      return;
    }

    clearTimeout(touchScrollTimeout);

    if (e.changedTouches[0]) {
      self.touchPosition = self.getTouchPos(e);
    }

    if (e.changedTouches[1]) {
      self.touchPosition1 = self.getTouchPos(e, 1);
    }

    if (Math.abs(self.touchDelta.x) + Math.abs(self.touchDelta.y) > self.attributes.touchDeadZone) {
      clearTimeout(self.touchContextTimeout);
    }

    if (e.touches.length === 2 && self.touchPosition && self.touchPosition1) {
      t1 = self.touchPosition.y;
      t2 = self.touchPosition1.y;

      if (!self.zoomDeltaStart) {
        self.zoomDeltaStart = Math.abs(t1 - t2);
        self.startScale = self.scale;
      }

      self.touchLength = 2;
      self.scaleDelta = self.zoomDeltaStart - Math.abs(t1 - t2);
      self.scale = self.startScale - self.scaleDelta * self.attributes.touchZoomSensitivity;
      self.scale = Math.min(Math.max(self.scale, self.attributes.touchZoomMin), self.attributes.touchZoomMax);
      self.zoomAltered = true;
      self.resize(true);
      self.resizeChildGrids();
      return;
    }

    if (self.zoomAltered) {
      return;
    }

    self.touchLength = 1;
    self.touchPosition = self.touchPosition || self.touchPosition1;
    ch = self.getColumnHeaderCellHeight();
    rw = self.getRowHeaderCellWidth();
    rScrollZone = self.width - self.style.scrollBarWidth - self.touchPosition.x < self.attributes.selectionScrollZone;
    lScrollZone = self.touchPosition.x - rw < self.attributes.selectionScrollZone;
    bScrollZone = self.height - self.style.scrollBarWidth - self.touchPosition.y < self.attributes.selectionScrollZone;
    tScrollZone = self.touchPosition.y - ch < self.attributes.selectionScrollZone;
    sbw = self.style.scrollBarWidth;

    function touchScroll() {
      var x = self.scrollBox.scrollLeft,
          y = self.scrollBox.scrollTop;
      x += rScrollZone ? self.attributes.selectionScrollIncrement : 0;
      y += bScrollZone ? self.attributes.selectionScrollIncrement : 0;
      y -= tScrollZone ? self.attributes.selectionScrollIncrement : 0;
      x -= lScrollZone ? self.attributes.selectionScrollIncrement : 0;
      self.scrollBox.scrollTo(x, y);
      touchScrollTimeout = setTimeout(touchScroll, self.attributes.scrollRepeatRate);
    }

    e.stopPropagation();
    self.touchDelta = {
      x: self.touchPosition.x - self.touchStart.x,
      y: self.touchPosition.y - self.touchStart.y,
      scrollLeft: self.scrollBox.scrollLeft,
      scrollTop: self.scrollBox.scrollTop,
      t: performance.now()
    };
    self.currentCell = self.getCellAt(self.touchPosition.x, self.touchPosition.y);
    self.dispatchEvent('touchmove', {
      NativeEvent: e,
      cell: self.currentCell
    });
    self.calculatePPS();
    self.touchDuration = performance.now() - self.touchScrollStart.t;
    self.stopAnimation = true;
    self.animationFrames = 0;

    if (self.touchSelecting && (rScrollZone || lScrollZone || tScrollZone || bScrollZone)) {
      touchScroll();
    }

    if (/vertical-scroll-/.test(self.startingCell.style)) {
      self.scrollBox.scrollTop = self.scrollBox.scrollHeight * ((self.touchPosition.y - ch - sbw) / (self.scrollBox.height - sbw - ch));
      return;
    }

    if (/horizontal-scroll-/.test(self.startingCell.style)) {
      self.scrollBox.scrollLeft = self.scrollBox.scrollWidth * ((self.touchPosition.x - rw - sbw) / (self.scrollBox.width - sbw - rw));
      return;
    }

    if (/selection-handle-/.test(self.startingCell.style)) {
      self.touchSelect(self.currentCell, self.startingCell.style);
      return;
    }

    self.scrollBox.scrollTo(self.touchScrollStart.x - self.touchDelta.x, self.touchScrollStart.y - self.touchDelta.y);
  }

  self.touchmove = function (e) {
    if (touchMoving) {
      return;
    }

    requestAnimationFrame(function () {
      touchMoving = true;
      touchMove(e);
      touchMoving = false;
    });
  };

  self.touchEndEvents = function (e) {
    self.zoomDeltaStart = undefined;
    self.touchSelecting = false;
    clearInterval(self.touchScrollTimeout);
    clearInterval(self.touchContextTimeout);
    clearInterval(self.calculatePPSTimer);
    e.stopPropagation();
    document.body.removeEventListener('touchmove', self.touchmove, {
      passive: false
    });
    document.body.removeEventListener('touchend', self.touchend, false);
    document.body.removeEventListener('touchcancel', self.touchcancel, false);
  };

  self.touchend = function (e) {
    if (self.dispatchEvent('touchend', {
      NativeEvent: e,
      cell: self.currentCell
    })) {
      return;
    }

    self.zoomDeltaStart = undefined;

    if (e.changedTouches[0]) {
      self.touchPosition = undefined;
    }

    if (e.changedTouches[1]) {
      self.touchPosition1 = undefined;
    }

    if (self.zoomAltered) {
      if (e.touches.length === 0) {
        self.zoomAltered = false;
      }

      return;
    }

    var dz = Math.abs(self.touchDelta.x) + Math.abs(self.touchDelta.y) < self.attributes.touchDeadZone;

    if (isNaN(self.xPPS)) {
      self.xPPS = 0;
    }

    if (isNaN(self.yPPS)) {
      self.yPPS = 0;
    }

    if (isNaN(self.xPPST)) {
      self.xPPST = 0;
    }

    if (isNaN(self.yPPST)) {
      self.yPPST = 0;
    }

    self.touchAnimateTo.x = self.xPPS * self.attributes.touchReleaseAcceleration;
    self.touchAnimateTo.y = self.yPPS * self.attributes.touchReleaseAcceleration;
    self.calculatePPSTimed();

    if (!dz && self.animationFrames === 0 && (Math.abs(self.xPPST) > self.attributes.scrollAnimationPPSThreshold || Math.abs(self.yPPST) > self.attributes.scrollAnimationPPSThreshold) && !/-scroll-/.test(self.startingCell.style) && !dz) {
      self.stopAnimation = false;
      self.touchEndAnimation();
    }

    self.touchEndEvents(e);
  };

  self.touchcancel = function (e) {
    if (self.dispatchEvent('touchcancel', {
      NativeEvent: e,
      cell: self.currentCell
    })) {
      return;
    }

    self.touchEndEvents(e);
  };
}

/***/ }),

/***/ "./node_modules/is-printable-key-event/dist/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/is-printable-key-event/dist/index.js ***!
  \***********************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 1:0-14 */
/***/ (function(module) {

module.exports=function(e){var o={};function a(t){if(o[t])return o[t].exports;var r=o[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,a),r.l=!0,r.exports}return a.m=e,a.c=o,a.d=function(e,o,t){a.o(e,o)||Object.defineProperty(e,o,{enumerable:!0,get:t})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,o){if(1&o&&(e=a(e)),8&o)return e;if(4&o&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(a.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&o&&"string"!=typeof e)for(var r in e)a.d(t,r,function(o){return e[o]}.bind(null,r));return t},a.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(o,"a",o),o},a.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},a.p="",a(a.s=0)}([function(e,o,a){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var t=a(1),r=Object.keys(t.default).reduce((function(e,o){return e.concat(t.default[o])}),[]);o.default=function(e){return-1===r.indexOf(e.key)}},function(e,o,a){"use strict";Object.defineProperty(o,"__esModule",{value:!0});o.default={modifier:["Alt","AltGraph","CapsLock","Control","Fn","FnLock","Meta","NumLock","ScrollLock","Shift","Symbol","SymbolLock"],legacyModifier:["Hyper","Super"],whiteSpace:["Enter","Tab"],navigation:["ArrowDown","ArrowLeft","ArrowRight","ArrowUp","End","Home","PageDown","PageUp"],editing:["Backspace","Clear","Copy","CrSel","Cut","Delete","EraseEof","ExSel","Insert","Paste","Redo","Undo"],ui:["Accept","Again","Attn","Cancel","ContextMenu","Escape","Execute","Find","Help","Pause","Play","Props","Select","ZoomIn","ZoomOut"],device:["BrightnessDown","BrightnessUp","Eject","LogOff","Power","PowerOff","PrintScreen","Hibernate","Standby","WakeUp"],imeCompositionKeys:["AllCandidates","Alphanumeric","CodeInput","Compose","Convert","Dead","FinalMode","GroupFirst","GroupLast","GroupNext","GroupPrevious","ModeChange","NextCandidate","NonConvert","PreviousCandidate","Process","SingleCandidate"],koreanSpecific:["HangulMode","HanjaMode","JunjaMode"],japaneseSpecific:["Eisu","Hankaku","Hiragana","HiraganaKatakana","KanaMode","KanjiMode","Katakana","Romaji","Zenkaku","ZenkakuHankaku"],commonFunction:["F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","Soft1","Soft2","Soft3","Soft4"],multimedia:["ChannelDown","ChannelUp","Close","MailForward","MailReply","MailSend","MediaClose","MediaFastForward","MediaPause","MediaPlay","MediaPlayPause","MediaRecord","MediaRewind","MediaStop","MediaTrackNext","MediaTrackPrevious","New","Open","Print","Save","SpellCheck"],multimediaNumpad:["Key11","Key12"],audio:["AudioBalanceLeft","AudioBalanceRight","AudioBassBoostDown","AudioBassBoostToggle","AudioBassBoostUp","AudioFaderFront","AudioFaderRear","AudioSurroundModeNext","AudioTrebleDown","AudioTrebleUp","AudioVolumeDown","AudioVolumeUp","AudioVolumeMute","MicrophoneToggle","MicrophoneVolumeDown","MicrophoneVolumeUp","MicrophoneVolumeMute"],speech:["SpeechCorrectionList","SpeechInputToggle"],application:["LaunchApplication1","LaunchApplication2","LaunchCalendar","LaunchContacts","LaunchMail","LaunchMediaPlayer","LaunchMusicPlayer","LaunchPhone","LaunchScreenSaver","LaunchSpreadsheet","LaunchWebBrowser","LaunchWebCam","LaunchWordProcessor"],browser:["BrowserBack","BrowserFavorites","BrowserForward","BrowserHome","BrowserRefresh","BrowserSearch","BrowserStop"],mobilePhone:["AppSwitch","Call","Camera","CameraFocus","EndCall","GoBack","GoHome","HeadsetHook","LastNumberRedial","Notification","MannerMode","VoiceDial"],tv:["TV","TV3DMode","TVAntennaCable","TVAudioDescription","TVAudioDescriptionMixDown","TVAudioDescriptionMixUp","TVContentsMenu","TVDataService","TVInput","TVInputComponent1","TVInputComponent2","TVInputComposite1","TVInputComposite2","TVInputHDMI1","TVInputHDMI2","TVInputHDMI3","TVInputHDMI4","TVInputVGA1","TVMediaContext","TVNetwork","TVNumberEntry","TVPower","TVRadioService","TVSatellite","TVSatelliteBS","TVSatelliteCS","TVSatelliteToggle","TVTerrestrialAnalog","TVTerrestrialDigital","TVTimer"],mediaControls:["AVRInput","AVRPower","ColorF0Red","ColorF1Green","ColorF2Yellow","ColorF3Blue","ColorF4Grey","ColorF5Brown","ClosedCaptionToggle","Dimmer","DisplaySwap","DVR","Exit","FavoriteClear0","FavoriteClear1","FavoriteClear2","FavoriteClear3","FavoriteRecall0","FavoriteRecall1","FavoriteRecall2","FavoriteRecall3","FavoriteStore0","FavoriteStore1","FavoriteStore2","FavoriteStore3","Guide","GuideNextDay","GuidePreviousDay","Info","InstantReplay","Link","ListProgram","LiveContent","Lock","MediaApps","MediaAudioTrack","MediaLast","MediaSkipBackward","MediaSkipForward","MediaStepBackward","MediaStepForward","MediaTopMenu","NavigateIn","NavigateNext","NavigateOut","NavigatePrevious","NextFavoriteChannel","NextUserProfile","OnDemand","Pairing","PinPDown","PinPMove","PinPToggle","PinPUp","PlaySpeedDown","PlaySpeedReset","PlaySpeedUp","RandomToggle","RcLowBattery","RecordSpeedNext","RfBypass","ScanChannelsToggle","ScreenModeNext","Settings","SplitScreenToggle","STBInput","STBPower","Subtitle","Teletext","VideoModeNext","Wink","ZoomToggle"]}}]).default;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./lib/main.js");
/******/ })()
.default;
});
//# sourceMappingURL=canvas-datagrid.debug.map