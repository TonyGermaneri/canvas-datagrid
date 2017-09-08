/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define(['./defaults'], function (defaults) {
    'use strict';
    return function (self) {
        self = self || {};
        var typeMap, component = {};
        function hyphenateProperty(prop, cust) {
            var p = '';
            Array.prototype.forEach.call(prop, function (char) {
                if (char === char.toUpperCase()) {
                    p += '-' + char.toLowerCase();
                    return;
                }
                p += char;
            });
            return (cust ? '-cdg-' : '') + p;
        }
        function getDefaultItem(base, item) {
            var i = {},
                r;
            defaults(i);
            r = i.defaults[base].filter(function (i) {
                return i[0].toLowerCase() === item.toLowerCase()
                    || hyphenateProperty(i[0]) === item.toLowerCase()
                    || hyphenateProperty(i[0], true) === item.toLowerCase();
            })[0];
            return r;
        }
        typeMap = {
            data: function (strData) {
                try {
                    return JSON.parse(strData);
                } catch (e) {
                    throw new Error('Cannot read JSON data in canvas-datagrid data attribute.');
                }
            },
            style: function (fullStyleString) {
                var s = {};
                fullStyleString.split(';').forEach(function (sd) {
                    if (!sd) { return; }
                    var i = sd.indexOf(':'),
                        key = sd.substring(0, i),
                        val = sd.substring(i + 1),
                        idef = getDefaultItem('styles', key);
                    if (idef === undefined) {
                        console.warn('Unrecognized style directive', key);
                        return;
                    }
                    s[idef[0]] = typeMap[typeof idef[1]](val.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''));
                });
                return s;
            },
            schema: function (strSchema) {
                try {
                    return JSON.parse(strSchema);
                } catch (e) {
                    throw new Error('Cannot read JSON data in canvas-datagrid schema attribute.');
                }
            },
            number: function (strNum) {
                return parseInt(strNum, 10);
            },
            boolean: function (strBool) {
                return (/true/i).test(strBool);
            },
            string: function (str) {
                return str;
            }
        };
        component.getObservableAttributes = function () {
            var i = {}, attrs = ['style', 'data', 'schema'];
            defaults(i);
            i.defaults.attributes.forEach(function (attr) {
                attrs.push(attr[0].toLowerCase());
            });
            return attrs;
        };
        component.connectedCallback = function () {
            var intf = this, s;
            if (intf.initialized) { return; }
            intf.initialized = true;
            intf.args.parentNode = intf;
            //HACK init() will secretly return the internal reference object.
            //since init is only run after instantiation in the component version
            //it won't work in the amd version and won't return self, so it is still
            //technically private since it's impossible to get at.
            //this has to be done so intf setters can bet run and alter self without stack overflows
            s = intf.init();
            ['style', 'data', 'schema'].forEach(function (key) {
                Object.defineProperty(intf.args, key, {
                    set: function (value) {
                        s[key] = value;
                        intf.draw();
                    },
                    get: function () {
                        return s[key];
                    }
                });
            });
        };
        component.attributeChangedCallback = function (attrName, oldVal, newVal) {
            var tfn, j, s, intf = this;
            if (attrName === 'style') {
                j = typeMap.style(newVal);
                s = intf.args.style ? JSON.parse(JSON.stringify(intf.args.style)) : {};
                Object.keys(j).forEach(function (key) {
                    s[key] = j[key];
                });
                intf.args.style = s;
                return;
            }
            if (attrName === 'data') {
                intf.args.data = typeMap.data(newVal);
                return;
            }
            if (attrName === 'schema') {
                intf.args.schema = typeMap.schema(newVal);
                return;
            }
            if (attrName === 'class' || attrName === 'className') {
                // look for the stylesheet defined here
                
            }
            tfn = typeMap[typeof getDefaultItem('attributes', attrName)[1]];
            // trim incoming values
            intf.attributes[attrName] = tfn(newVal);
            return;
        };
        self.component = component;
        return component;
    };
});