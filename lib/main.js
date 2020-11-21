/*jslint browser: true, unparam: true, todo: true, evil: true*/
/*globals Reflect: false, HTMLElement: true, define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
'use strict';

import component from './component';
import defaults from './defaults';
import draw from './draw';
import events from './events';
import touch from './touch';
import intf from './intf';
import contextMenu from './contextMenu';
import dom from './dom';
import publicMethods from './publicMethods';

var webComponent = component();

var modules = [
  defaults,
  draw,
  events,
  touch,
  intf,
  contextMenu,
  dom,
  publicMethods,
];

function Grid(args) {
  args = args || {};
  var self = {};
  self.isComponent = args.component === undefined;
  self.isChildGrid =
    args.parentNode &&
    /canvas-datagrid-(cell|tree)/.test(args.parentNode.nodeType);
  if (self.isChildGrid) {
    self.intf = {};
  } else {
    self.intf = self.isComponent
      ? eval('Reflect.construct(HTMLElement, [], new.target)')
      : document.createElement('canvas');
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
    self.shadowRoot = self.intf.attachShadow({ mode: 'open' });
    self.parentNode = self.shadowRoot;
  }
  self.init();
  return self.intf;
}
if (window.HTMLElement) {
  Grid.prototype = Object.create(window.HTMLElement.prototype);
}

// export web component
if (window.customElements && !window.customElements.get('canvas-datagrid')) {
  Grid.observedAttributes = webComponent.getObservableAttributes();
  Grid.prototype.disconnectedCallback = webComponent.disconnectedCallback;
  Grid.prototype.attributeChangedCallback =
    webComponent.attributeChangedCallback;
  Grid.prototype.connectedCallback = webComponent.connectedCallback;
  Grid.prototype.adoptedCallback = webComponent.adoptedCallback;
  window.customElements.define('canvas-datagrid', Grid);
}
// #NO_GLOBAL
// export global
if (window && !window.canvasDatagrid && !window.require) {
  window.canvasDatagrid = function (args) {
    return new Grid(args);
  };
}
// #NO_GLOBAL

// export amd loader
export default function canvasDatagrid(args) {
  args = args || {};
  var i;
  var tKeys = [
    'style',
    'formatters',
    'sorters',
    'filters',
    'treeGridAttributes',
    'cellGridAttributes',
    'data',
    'schema',
  ];
  if (window.customElements) {
    i = document.createElement('canvas-datagrid');
    Object.keys(args).forEach(function (argKey) {
      // set data and parentNode after everything else
      if (argKey === 'data') {
        return;
      }
      if (argKey === 'parentNode') {
        return;
      }
      // top level keys in args
      if (tKeys.indexOf(argKey) !== -1) {
        tKeys.forEach(function (tKey) {
          if (args[tKey] === undefined || tKey !== argKey) {
            return;
          }
          if (['formatters', 'sorters', 'filters'].indexOf(argKey) !== -1) {
            if (typeof args[tKey] === 'object' && args[tKey] !== null) {
              Object.keys(args[tKey]).forEach(function (sKey) {
                i[tKey][sKey] = args[tKey][sKey];
              });
            }
          } else {
            i[tKey] = args[tKey];
          }
        });
        return;
      }
      // all others are attribute level keys
      i.attributes[argKey] = args[argKey];
    });
    if (args.data) {
      i.data = args.data;
    }
    // add to the dom very last to avoid redraws
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
