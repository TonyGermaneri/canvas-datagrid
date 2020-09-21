/*jslint node: true, stupid: true, nomen: true*/
var fs = require('fs'),
    path = require('path');
exports.publish = function (data) {
    'use strict';
    function cp(a, b) {
        fs.createReadStream(a).pipe(fs.createWriteStream(b));
    }
    var files = {}, dirFiles, d = data().get(), p = __dirname, s;
    fs.mkdirSync(p + '/../docs/');
    fs.mkdirSync(p + '/../docs/js');
    fs.mkdirSync(p + '/../docs/css');
    dirFiles = fs.readdirSync(p);
    dirFiles.forEach(function (file) {
        if (/\.DS_Store/.test(file)) { return; }
        var f = path.join(p, file);
        if (fs.lstatSync(f).isDirectory()) { return; }
        files[file] = fs.readFileSync(f, {encoding: 'utf-8'});
    });
    files['README.md'] = fs.readFileSync(p + '/../README.md', {encoding: 'utf-8'});
    s = 'window.reflection = ' + JSON.stringify(d.filter(function (a) {
        return a.undocumented !== false;
    }), null, '    ')
        + ';window.files = ' + JSON.stringify(files, null, '    ') + ';';
    fs.writeFileSync(p + '/../docs/js/reflection.js', s, 'utf8');
    cp(path.join(p, '/../node_modules/marked/lib/marked.js'), p + '/../docs/js/marked.js');
    cp(path.join(p, '/index.html'), p + '/../docs/index.html');
    cp(path.join(p, '/js/main.js'), p + '/../docs/js/main.js');
    cp(path.join(p, '/css/main.css'), p + '/../docs/css/main.css');
};
