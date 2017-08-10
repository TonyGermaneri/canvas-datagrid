/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([
    './draw',
    './events',
    './intf',
    './contextMenu',
    './defaults',
    './dom',
    './publicMethods'
], function context() {
    'use strict';
    var modules = Array.prototype.slice.call(arguments);
    function grid(args) {
        args = args || {};
        var self = {};
        self.args = args;
        self.createGrid = grid;
        modules.forEach(function (module) {
            module(self);
        });
        self.init();
        return self.intf;
    }
    if (window && !window.canvasDatagrid && !window.require) {
        window.canvasDatagrid = grid;
    }
    module.exports = grid;
    return grid;
});
