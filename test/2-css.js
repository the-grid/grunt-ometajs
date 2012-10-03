(function() {
  var d_dir, d_list, fs, funcs, grailss, okn, readFile, total, treeToString, _compress, _parse, _transform, _translate;

  require('../global');

  require('./config');

  fs = require('fs');

  grailss = require("../lib/grailss");

  treeToString = grailss.treeToString;

  _parse = grailss.ast;

  _transform = grailss.cssTransform;

  _translate = grailss.cssTranslate;

  _compress = grailss.compress;

  d_dir = __dirname + '/2-css/data';

  d_list = fs.readdirSync(d_dir);

  okn = total = 0;

  funcs = {
    'p': function(src, match) {
      return treeToString(_parse(src, match));
    },
    'l': function(src, match) {
      return _translate(_transform(_parse(src, match), match), match);
    }
  };

  readFile = function(path) {
    return fs.readFileSync(path).toString();
  };

  describe("CSS Compatiblity", function() {
    return test("src to AST to src", function() {
      d_list.forEach(function(rule_dir) {
        var a, b, c, ext, files, k, list, path, r, rule, src, t, _results;
        if (/^test/.test(rule_dir)) {
          rule = rule_dir.substring(5);
          path = d_dir + '/' + rule_dir + '/';
          list = fs.readdirSync(path);
          files = {};
          k = a = b = c = src = t = r = ext = void 0;
          list.forEach(function(f) {
            var i;
            i = f.lastIndexOf('.');
            if (i !== -1) {
              ext = f.substring(i + 1);
              k = f.substring(0, i);
              if (!(k in files)) {
                files[k] = {};
              }
              return files[k][ext] = 1;
            }
          });
          _results = [];
          for (k in files) {
            if (files[k].css) {
              src = readFile(path + k + '.css').trim();
              t = '\'' + rule + '\' / \'' + k + '.';
              _results.push((function() {
                var _results1;
                _results1 = [];
                for (a in funcs) {
                  if (a in files[k]) {
                    total++;
                    r = (((b = funcs[a](src, rule)) == (c = readFile(path + k + '.' + a).trim())));

                    r && okn++;
                    if (!r) {
                      _results1.push(console.log('FAIL: ' + t + a));
                    } else {
                      _results1.push(void 0);
                    }
                  } else {
                    _results1.push(void 0);
                  }
                }
                return _results1;
              })());
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      });
      console.log('Total Tests: ' + total + '. Ok: ' + okn + '. Fail: ' + (total - okn));
      return assert.equal(total - okn, 0);
    });
  });

}).call(this);
