/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
'use strict';

import defaults from './defaults';

export default function () {
  var typeMap,
    component = {};
  component.dehyphenateProperty = function hyphenateProperty(prop) {
    prop = prop.replace('--cdg-', '');
    var p = '',
      nextLetterCap;
    Array.prototype.forEach.call(prop, function (char) {
      if (nextLetterCap) {
        nextLetterCap = false;
        p += char.toUpperCase();
        return;
      }
      if (char === '-') {
        nextLetterCap = true;
        return;
      }
      p += char;
    });
    return p;
  };
  component.hyphenateProperty = function hyphenateProperty(prop, cust) {
    var p = '';
    Array.prototype.forEach.call(prop, function (char) {
      if (char === char.toUpperCase()) {
        p += '-' + char.toLowerCase();
        return;
      }
      p += char;
    });
    return (cust ? '--cdg-' : '') + p;
  };
  function getDefaultItem(base, item) {
    var i = {},
      r;
    defaults(i);
    r = i.defaults[base].filter(function (i) {
      return (
        i[0].toLowerCase() === item.toLowerCase() ||
        component.hyphenateProperty(i[0]) === item.toLowerCase() ||
        component.hyphenateProperty(i[0], true) === item.toLowerCase()
      );
    })[0];
    return r;
  }
  component.applyComponentStyle = function (supressChangeAndDrawEvents, intf) {
    if (!intf.isComponent) {
      return;
    }
    var cStyle = window.getComputedStyle(
        intf.tagName === 'CANVAS-DATAGRID' ? intf : intf.canvas,
        null,
      ),
      defs = {};
    intf.computedStyle = cStyle;
    defaults(defs);
    defs.defaults.styles.forEach(function (def) {
      var val;
      val = cStyle.getPropertyValue(component.hyphenateProperty(def[0], true));
      if (val === '') {
        val = cStyle.getPropertyValue(
          component.hyphenateProperty(def[0], false),
        );
      }
      if (val !== '' && typeof val === 'string') {
        intf.setStyleProperty(
          def[0],
          typeMap[typeof def[1]](
            val.replace(/^\s+/, '').replace(/\s+$/, ''),
            def[1],
          ),
          true,
        );
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
    data: function (strData) {
      try {
        return JSON.parse(strData);
      } catch (e) {
        throw new Error('Cannot read JSON data in canvas-datagrid data.');
      }
    },
    schema: function (strSchema) {
      try {
        return JSON.parse(strSchema);
      } catch (e) {
        throw new Error(
          'Cannot read JSON data in canvas-datagrid schema attribute.',
        );
      }
    },
    number: function (strNum, def) {
      var n = parseInt(strNum, 10);
      return isNaN(n) ? def : n;
    },
    boolean: function (strBool) {
      return /true/i.test(strBool);
    },
    string: function (str) {
      return str;
    },
  };
  component.getObservableAttributes = function () {
    var i = {},
      attrs = ['data', 'schema', 'style', 'className', 'name'];
    defaults(i);
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
      tfn = typeMap[typeof def[1]];
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
        if (
          mutation.attributeName === 'class' ||
          mutation.attributeName === 'style'
        ) {
          checkStyle = true;
          return;
        }
        if (mutation.target.nodeName === 'STYLE') {
          checkStyle = true;
          return;
        }
        if (
          mutation.target.parentNode &&
          mutation.target.parentNode.nodeName === 'STYLE'
        ) {
          checkStyle = true;
          return;
        }
        if (
          mutation.target === intf &&
          (mutation.addedNodes.length > 0 || mutation.type === 'characterData')
        ) {
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
      subtree: true,
    });
    Array.prototype.forEach.call(
      document.querySelectorAll('style'),
      function (el) {
        observer.observe(el, {
          characterData: true,
          childList: true,
          attributes: true,
          subtree: true,
        });
      },
    );
  };
  return component;
}
