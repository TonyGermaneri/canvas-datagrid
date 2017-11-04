/*jslint browser: true, unparam: true, todo: true, evil: true*/
/*globals Reflect: false, HTMLElement: true, define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([
    './component',
    './defaults',
    './draw',
    './events',
    './touch',
    './intf',
    './contextMenu',
    './dom',
    './publicMethods'
], function context(component) {
    'use strict';
    component = component();
    var modules = Array.prototype.slice.call(arguments);
    function Grid(args) {
        args = args || {};
        var self = {};
        self.isComponent = args.component === undefined;
        self.intf = self.isComponent ? eval('Reflect.construct(HTMLElement, [], new.target)') : {};
        self.args = args;
        self.createGrid = function grid(args) {
            args.component = false;
            return new Grid(args);
        };
        modules.forEach(function (module) {
            module(self);
        });
        if (self.isComponent) {
            self.args.parentNode = self.intf;
        } else {
            self.args.parentNode = args.parentNode;
        }
        if (self.args.parentNode && self.args.parentNode.createShadowRoot) {
            self.shadowRoot = self.args.parentNode.attachShadow({mode: self.args.debug ? 'open' : 'closed'});
            self.parentNode = self.shadowRoot;
        } else {
            self.parentNode = args.parentNode;
        }
        self.init();
        return self.intf;
    }
    if (window.HTMLElement) {
        Grid.prototype = Object.create(window.HTMLElement.prototype);
    }
    // export web component
    if (window.customElements) {
        Grid.observedAttributes = component.getObservableAttributes();
        Grid.prototype.disconnectedCallback = component.disconnectedCallback;
        Grid.prototype.attributeChangedCallback = component.attributeChangedCallback;
        Grid.prototype.connectedCallback = component.connectedCallback;
        Grid.prototype.adoptedCallback = component.adoptedCallback;
        window.customElements.define('canvas-datagrid', Grid);
    }
    // export global
    if (window && !window.canvasDatagrid && !window.require) {
        window.canvasDatagrid = function (args) { return new Grid(args); };
    }
    // export amd loader
    module.exports = function grid(args) {
        args = args || {};
        var i, tKeys = ['style', 'schema', 'data', 'formatters',
                    'sorters', 'filters'];
        if (window.customElements) {
            i = document.createElement('canvas-datagrid');
            Object.keys(args).forEach(function (argKey) {
                if (argKey === 'parentNode') {
                    args.parentNode.appendChild(i);
                    return;
                }
                // top level keys in args
                if (tKeys.indexOf(argKey) !== -1) {
                    tKeys.forEach(function (tKey) {
                        if (args[tKey] === undefined || tKey !== argKey) { return; }
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
            return i;
        }
        args.component = false;
        i = new Grid(args);
        return i;
    };
    return module.exports;
});
