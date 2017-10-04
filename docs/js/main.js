/*jslint browser: true, evil: true*/
/*global tutorials: false, ace: false, files: false, reflection: false, marked: false */
(function () {
    'use strict';
    var topic, tocLinks = [
        ['#readme', 'Readme'],
        ['#params', 'Parameters'],
        ['#properties', 'Properties'],
        ['#methods', 'Methods'],
        ['#events', 'Events'],
        ['#tutorials', 'Tutorials'],
        ['#installation', 'Installation &amp; Getting Started'],
        ['#building-testing', 'Building &amp; Testing'],
        ['#more-demos', 'Demos'],
        ['#ways-to-create-a-grid', 'Different ways to instantiate'],
        ['#setting-and-getting-data', 'Getting and setting data'],
        ['#schema', 'Setting a schema'],
        ['#properties-attributes-parameters', 'About properties, attributes, and parameters.'],
        ['#web-component', 'Web component'],
        ['#sorters', 'Sorter functions'],
        ['#filters', 'Filter functions'],
        ['#formatters', 'Formatter functions'],
        ['#formatting-using-event-listeners', 'Formatting using event listeners'],
        ['#extending-the-visual-appearance', 'Extending the visual appearance'],
        ['#drawing-on-the-canvas', 'Drawing on the canvas'],
        ['#supporting-dom-elements', 'Supporting DOM elements'],
        ['#notes', 'Special Notes']
    ];
    eval(files['tutorials.js']);
    marked.setOptions({
        gfm: true,
        tables: true
    });
    function formatDocString(str) {
        str = str.replace(/\{@link +http([^\}]+)\}/ig, 'http$1');
        str = str.replace(/\{@link ([^\}]+)\}/ig, '<a href="#$1">$1</a>');
        str = str.replace(/`([^`}]+)`/ig, '<span class="inline-code">$1</span>');
        return str;
    }
    function getHash() {
        return decodeURIComponent(window.location.hash.substring(1));
    }
    function getKind(kind, parent) {
        var d = [];
        reflection.filter(function (i) {
            return i.undocumented !== true;
        }).forEach(function (i) {
            if (!(i.kind === kind
                    && (parent === undefined || parent.longname === i.memberof))) {
                return;
            }
            i.params = i.params || getKind('params', i);
            i.events = i.events || getKind('event', i);
            i.methods = i.methods || getKind('function', i);
            i.attributes = i.attributes || getKind('attribute', i);
            i.classes = i.classes || getKind('class', i);
            d.push(i);
        });
        return d;
    }
    function getByLongName(longname) {
        var i, l = reflection.length, x;
        for (x = 0; x < l; x += 1) {
            if (reflection[x].longname === longname) {
                i = reflection[x];
                i.params = i.params || getKind('params', i);
                i.events = i.events || getKind('event', i);
                i.methods = i.methods || getKind('function', i);
                i.attributes = i.attributes || getKind('attribute', i);
                i.classes = i.classes || getKind('class', i);
                return i;
            }
        }
    }
    function ce(tag, classes, parentNode, atrs) {
        var t = document.createElement(tag);
        (Array.isArray(classes) ? classes : [classes]).forEach(function (c) { t.classList.add(c); });
        Object.keys(atrs || {}).forEach(function (k) { t.setAttribute(k, atrs[k]); });
        if (parentNode) { parentNode.appendChild(t); }
        return t;
    }
    function getClassTitle(i) {
        var n;
        if (i.name === 'canvasDatagrid') {
            n = 'Module';
        } else if (i.virtual) {
            n = 'Abstract Class';
        } else if (i.memberof  === 'canvasDatagrid' && i.kind === 'function') {
            n = 'Method';
        } else if (i.memberof  === 'canvasDatagrid' && i.kind === 'event') {
            n = 'Event';
        } else {
            n = 'Class';
        }
        return i.name + ' <span class="toc-subclassname">' + n + '</span>';
    }
    function getLink(member, parentMember) {
        return ((parentMember ? (parentMember.longname || parentMember.name)
                + '.' : '') + (member.longname || member.name)).replace('canvasDatagrid.canvasDatagrid', 'canvasDatagrid');
    }
    function drawTocClass(parentList, i) {
        var ct = ce('h2', 'toc-class-heading', parentList);
        ct.innerHTML = getClassTitle(i);
        ct.onclick = function () { window.location = '#' + i.longname; };
        ct.title = i.description;
        ['Params', 'Properties', 'Methods', 'Events'].forEach(function (memberType) {
            var n = memberType.toLowerCase(), t;
            if (!i[n] || i[n].length === 0) { return; }
            t = ce('li', 'toc-member-heading-li', parentList);
            t.innerHTML = '<h3 class="toc-member-heading">' + memberType + '</h3>';
            i[n].forEach(function (member) {
                var memberLi = ce('li', 'toc-item', parentList),
                    memberLink = ce('a', 'toc-link', memberLi);
                memberLink.href = '#' + getLink(member, i);
                memberLink.innerHTML = member.name;
                memberLink.id = 'toc_' + member.longname;
                memberLink.title = member.description;
            });
        });
    }
    function drawToc(parentNode) {
        var ct,
            toc = ce('div', 'toc', parentNode),
            tocList = ce('ul', 'toc-list', toc),
            tutorialsUl;
        ct = ce('h2', 'toc-class-heading', toc);
        ct.style.marginBottom = '10px';
        ct.innerHTML = 'Tutorials';
        getKind('class').forEach(function (i) {
            drawTocClass(tocList, i);
        });
        tutorialsUl = ce('ul', 'toc-list', toc);
        Object.keys(tutorials).forEach(function (tkey) {
            var memberLi = ce('li', 'toc-item', tutorialsUl),
                memberLink = ce('a', 'toc-link', memberLi),
                msg = tkey.split('|');
            memberLink.href = '#tutorial--' + encodeURIComponent(msg[0].replace(/ /g, '-'));
            memberLink.innerHTML = msg[0];
            memberLink.id = 'toctutorial_' + msg[0];
            memberLink.title = msg[1] || msg[0];
        });
    }
    function toCodeSample(fn) {
        return ('            ' + fn.toString()).split('\n')
            .map(function (i, index, arr) {
                if (index === 0 || index === arr.length - 1) { return undefined; }
                return i.replace(/^ {4}/, '');
            }).filter(function (i, index) {
                return index !== 0;
            }).join('\n');
    }
    function drawMemberTable(members, memberType, parentNode, parentMember) {
        var table = ce('table', 'member-table', parentNode),
            trh = ce('tr', 'member-header-row', table),
            headers = {
                params: ['Name', 'Type', 'Optional', 'Default', 'Description'],
                properties: ['Name', 'Type', 'Description'],
                methods: ['Name', 'Parameters', 'Description'],
                events: ['Name', 'Parameters', 'Description'],
            };
        headers[memberType].forEach(function (name) {
            ce('th', 'member-header-cell', trh).innerHTML = name;
        });
        members.forEach(function (member) {
            var tr, name, a, type, description, params, defaultValueCell, optional;
            tr = ce('tr', 'member-row', table);
            name = ce('td', ['member-cell', 'member-name-cell'], tr);
            type = ce('td', ['member-cell', 'member-type-cell'], tr);
            if (memberType === 'params') {
                optional = ce('td', ['member-cell', 'member-optional-cell'], tr);
                defaultValueCell = ce('td', ['member-cell', 'member-default-cell'], tr);
                optional.innerHTML = member.optional ? '\u2714' : '';
                defaultValueCell.innerHTML = member.defaultvalue === undefined
                    ? '' : member.defaultvalue;
            }
            a = ce('a', 'member-anchor', name);
            description = ce('td', ['member-cell', 'member-description-cell'], tr);
            a.id = getLink(member, parentMember);
            a.innerHTML = member.name;
            if (['params', 'properties'].indexOf(memberType) !== -1) {
                type.innerHTML = member && member.type ? member.type.names.join() : '';
            } else {
                params = getByLongName(member.longname).params;
                if (params.length === 0) {
                    type.innerHTML = '<i>No Parameters</i>';
                } else {
                    type.classList.add('member-cell-table');
                    drawMemberTable(params, 'params', type, parentMember);
                }
            }
            description.innerHTML = formatDocString(member.description);
        });
    }
    function drawSyntax(i) {
        return '<span class="topic-syntax-returns">' + (i.returns ?
                i.returns[0].type.names.join(', ') + ' ' : 'void ') + '</span>'
                + i.name + '(' + i.params.map(function (p) {
                return '<span class="topic-syntax-type">' + p.type.names.join(', ')
                    + '</span> <span class="topic-syntax-name">'
                    + (p.optional ? ('[' + p.name + '=' + p.defaultValue + ']') : p.name)
                    + '</span>';
            }).join(', ') + ')';
    }
    function drawTopic(parentNode, longname) {
        var t, top, i, syntaxExample, an, heading, description, memberof, toc, hash, hashTarget;
        i = getByLongName(longname);
        top = !i.memberof;
        if (!top) {
            parentNode = ce('div', 'child-topic', parentNode);
        }
        an = ce('a', 'topic-anchor', parentNode);
        heading = ce('h1', 'topic-heading', parentNode);
        toc = ce('ul', 'topic-toc', parentNode);
        description = ce('div', 'topic-description', parentNode);
        memberof = ce('div', 'topic-memberof', parentNode);
        if (!i) { heading.innerHTML = 'Topic not found'; return; }
        an.id = getLink(i);
        if (i.memberof) {
            // TODO fix this link
            memberof.innerHTML = 'Member of <a href="#canvasDatagrid">canvasDatagrid</a>';
        }
        if (i.kind === 'function') {
            syntaxExample = ce('div', 'topic-syntax', parentNode);
            syntaxExample.innerHTML = drawSyntax(i);
        }
        if (i.name === 'canvasDatagrid') {
            heading.innerHTML = '<a id="toc"></a>Table of Contents';
            heading.classList.remove('topic-heading');
            heading.classList.add('topic-toc-heading');
            tocLinks.forEach(function (la) {
                ce('li', 'topic-toc-item', toc).innerHTML = '<a href="' + la[0] + '">' + la[1] + '</a>';
            });
            description.innerHTML += '<a id="readme"></a><h1 class="topic-heading">Readme</h1>';
            description.innerHTML += formatDocString(marked(files['README.md']));
        } else {
            description.innerHTML = marked(formatDocString(i.description));
            heading.innerHTML = getClassTitle(i);
        }
        if (files[i.longname + '.md']) {
            description.innerHTML += marked(formatDocString(files[i.longname + '.md']));
        }
        ['Params', 'Properties', 'Methods', 'Events', 'Classes'].forEach(function (memberType) {
            var n = memberType.toLowerCase(), tt;
            if (!i[n] || i[n].length === 0) {  return; }
            if (top) {
                ce('a', null, parentNode).id = n;
                tt = ce('h3', 'member-heading', parentNode);
                tt.innerHTML = memberType.replace('Params', 'Parameters &amp; Attributes');
            }
            if (['methods', 'events', 'classes'].indexOf(n) !== -1) {
                i[n].forEach(function (m) {
                    drawTopic(parentNode, m.longname);
                });
                return;
            }
            drawMemberTable(i[n], n, parentNode, i);
        });
        if (i.name && top) {
            ce('a', null, parentNode).id = 'tutorials';
            t = ce('h3', 'member-heading', parentNode);
            t.innerHTML = 'Tutorials';
            Object.keys(tutorials).forEach(function (tutorialKey) {
                var msg = tutorialKey.split('|'),
                    tutorialForm = ce('form', ['child-topic', 'tutorial'], parentNode),
                    tan = ce('a', ['tutorial-anchor', 'topic-anchor'], tutorialForm),
                    theading = ce('h2', ['tutorial-heading', 'topic-heading'], tutorialForm),
                    tdescription = ce('p', 'tutorial-description', tutorialForm),
                    aceEditor,
                    fiddleButton = ce('button', ['jsfiddlelogo', 'tutorial-button'], tutorialForm),
                    executeButton = ce('button', 'tutorial-button', tutorialForm),
                    error = ce('div', 'tutorial-error', tutorialForm),
                    code = ce('div', 'tutorial-code', tutorialForm),
                    gridParent = ce('div', 'tutorial-grid', tutorialForm),
                    hiddenFormItems = {},
                    fiddleForm = {
                        html: '<div id="grid"></div>',
                        css: '#grid { height: 300px; }',
                        js: '',
                        title: msg[0],
                        description: msg[1] || msg[0],
                        resources: 'https://tonygermaneri.github.io/canvas-datagrid/dist/canvas-datagrid.js',
                        dtd: 'html 5'
                    };
                Object.keys(fiddleForm).forEach(function (k) {
                    var input = document.createElement('input');
                    input.name = k;
                    input.type = 'hidden';
                    input.value = fiddleForm[k];
                    tutorialForm.appendChild(input);
                    hiddenFormItems[k] = input;
                });
                tutorialForm.method = 'post';
                tutorialForm.action = 'http://jsfiddle.net/api/post/library/pure/';
                tutorialForm.target = msg[0];
                tan.name = 'tutorial--' + msg[0].replace(/ /g, '-');
                code.id = 'ace_' + Math.random();
                fiddleButton.type = 'submit';
                fiddleButton.innerHTML = 'JsFiddle';
                executeButton.innerHTML = 'Execute \u21B4 ';
                executeButton.type = 'button';
                aceEditor = ace.edit(code.id);
                aceEditor.$blockScrolling = Infinity;
                aceEditor.setTheme('ace/theme/github');
                aceEditor.getSession().setMode('ace/mode/javascript');
                aceEditor.getSession().setValue(toCodeSample(tutorials[tutorialKey]));
                theading.innerHTML = msg[0];
                tdescription.innerHTML = msg[1] || msg[0];
                tutorialForm.onsubmit = function () {
                    var c = 'window.addEventListener(\'DOMContentLoaded\', function () {\n'
                        + '    var parentNode = document.getElementById(\'grid\');\n'
                        + '    ' + aceEditor.getValue().replace(/\n/g, '\n    ');
                    c = c.substring(0, c.length - 4) + '});';
                    hiddenFormItems.js.value = c;
                };
                executeButton.onclick = function () {
                    tutorialForm.removeChild(gridParent);
                    gridParent = ce('div', 'tutorial-grid', tutorialForm);
                    gridParent.innerHTML = '';
                    gridParent.style.height = '300px';
                    error.style.display = 'none';
                    try {
                        eval('(function (parentNode) {'
                            + aceEditor.getValue()
                            + '}(gridParent));');
                    } catch (e) {
                        error.style.display = 'block';
                        error.innerHTML = 'Error<br><span class="tutorial-error-msg">'
                            + e.message + '</span><br>Check console for more details.';
                        throw e;
                    }
                };
            });
            hash = getHash();
            if (hash) {
                hashTarget = document.querySelector('a[id="' + hash
                    .replace('#canvasDatagrid#', '') + '"]');
                if (hashTarget) {
                    hashTarget.scrollIntoView();
                }
            }
        }
    }
    function drawHeader(parentNode) {
        var header = ce('h1', 'header', parentNode),
            tocLink = ce('a', 'top-link', parentNode);
        tocLink.href = '#toc';
        tocLink.innerHTML = '\u2191';
        header.innerHTML = '<a href="https://github.com/TonyGermaneri/canvas-datagrid">API Documentation - Canvas Datagrid</a>';
    }
    function init(parentNode) {
        drawHeader(parentNode);
        drawToc(parentNode);
        topic = ce('div', 'topic', parentNode);
        drawTopic(topic, 'canvasDatagrid');
        return;
    }
    document.addEventListener('DOMContentLoaded', function () {
        init(document.body);
        window.addEventListener('hashchange', function () {
            var hashTarget, hash = getHash();
            if (hash) {
                hashTarget = document.querySelector('a[id="' + hash
                    .replace('#canvasDatagrid#', '') + '"]');
                if (hashTarget) {
                    hashTarget.scrollIntoView();
                }
            }
        }, false);
    });
}());