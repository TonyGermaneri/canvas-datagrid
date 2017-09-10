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
            return (cust ? '--cdg-' : '') + p;
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
        function applyComponentStyle(intf, self, supressChangeAndDrawEvents) {
            var cStyle = window.getComputedStyle(intf, null),
                defs = {};
            self.computedStyle = cStyle;
            defaults(defs);
            defs = defs.defaults.styles;
            defs.forEach(function (def) {
                var val = cStyle.getPropertyValue(hyphenateProperty(def[0], true));
                if (val !== "") {
                    self.style[def[0]] = typeMap[typeof def[1]](val, def[1]);
                }
            });
            self.draw(true);
            if (!supressChangeAndDrawEvents) {
                self.dispatchEvent('stylechanged', intf.style);
            }
        }
        typeMap = {
            data: function (strData) {
                try {
                    return JSON.parse(strData);
                } catch (e) {
                    throw new Error('Cannot read JSON data in canvas-datagrid data attribute.');
                }
            },
            schema: function (strSchema) {
                try {
                    return JSON.parse(strSchema);
                } catch (e) {
                    throw new Error('Cannot read JSON data in canvas-datagrid schema attribute.');
                }
            },
            number: function (strNum, def) {
                var n = parseInt(strNum, 10);
                return isNaN(n) ? def : n;
            },
            boolean: function (strBool) {
                return (/true/i).test(strBool);
            },
            string: function (str) {
                return str;
            }
        };
        component.getObservableAttributes = function () {
            var i = {}, attrs = ['data', 'schema'];
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
            //intf.style.display = 'block';
            s = intf.init();
            component.observe(intf, s);
            applyComponentStyle(intf, s, true);
            s.resize();
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
        component.adoptedCallback = function () {
            this.resize();
        };
        component.attributeChangedCallback = function (attrName, oldVal, newVal) {
            var tfn, intf = this;
            if (attrName === 'style') {
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
                return;
            }
            tfn = typeMap[typeof getDefaultItem('attributes', attrName)[1]];
            intf.attributes[attrName] = tfn(newVal);
            return;
        };
        component.observe = function (intf, self) {
            var observer;
            if (!window.MutationObserver) { return; }
            observer = new window.MutationObserver(function (mutations) {
                Array.prototype.forEach.call(mutations, function (mutation) {
                    if (mutation.attributeName === 'class'
                            || mutation.attributeName === 'style') {
                        applyComponentStyle(intf, self);
                        return;
                    }
                });
            });
            observer.observe(intf, { characterData: true, childList: true, attributes: true, subtree: true });
        };
        self.component = component;
        return component;
    };
});