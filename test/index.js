/*jslint node: true*/
/*globals describe: false, it: false*/
'use strict';
//     // page.property('content')
var phantom = require('phantom');
describe('canvas-datagrid', function () {
    it('Application should startup after database connection.', function (done) {
        phantom.create().then(function (ph) {
            ph.createPage().then(function (page) {
                page.open('file://' + __dirname + '/tests.html').then(function () {
                    page.property('onConsoleMessage', function () {
                        console.log(arguments);
                    });
                });
            });
        });
    });
});