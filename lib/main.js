/*jslint browser: true, unparam: true, todo: true, evil: true*/
/*globals Reflect: false, HTMLElement: true, define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([
    './component',
    './defaults',
    './draw',
    './events',
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
        self.intf.args = self.args;
        self.intf.init = self.init;
        if (!self.isComponent) {
            self.init();
        }
        return self.intf;
    }
    if (window.HTMLElement) {
        Grid.prototype = Object.create(window.HTMLElement.prototype);
    }
    // export web component
    if (window.customElements) {
        Grid.observedAttributes = component.getObservableAttributes();
        Grid.prototype.disconnectedCallback = function () { this.dispose(); };
        Grid.prototype.attributeChangedCallback = component.attributeChangedCallback;
        Grid.prototype.connectedCallback = component.connectedCallback;
        window.customElements.define('canvas-datagrid', Grid);
    }
    // export global
    if (window && !window.canvasDatagrid && !window.require) {
        window.canvasDatagrid = function (args) { return new Grid(args); };
    }
    // export amd loader
    module.exports = function grid(args) {
        args = args || {};
        args.component = false;
        return new Grid(args);
    };
    return module.exports;
});
