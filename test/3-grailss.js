(function() {
  var grailss, pretify;

  require('../global');

  require('./config');

  grailss = require("../lib/grailss");

  pretify = function(src) {
    return JSON.stringify(src, null, 2);
  };

  describe("grailss", function() {
    describe("existential", function() {
      test("grailss?", function() {
        return assert.ok(grailss);
      });
      test("grailss.Parser?", function() {
        return assert.ok(grailss.Parser);
      });
      test("grailss parsers?", function() {
        assert.ok(grailss.parse);
        return assert.ok(grailss.ast);
      });
      test("grailss transformers?", function() {
        assert.ok(grailss.jsTransform);
        return assert.ok(grailss.cssTransform);
      });
      return test("grailss translaters?", function() {
        assert.ok(grailss.toJS);
        assert.ok(grailss.toCSS);
        assert.ok(grailss.jsTranslate);
        return assert.ok(grailss.cssTranslate);
      });
    });
    describe("something is happening", function() {
      before(function() {
        return this.src = 'a { color: red }';
      });
      test("astd src to tree", function() {
        this.tree = grailss.ast(this.src);
        return assert.ok(this.tree);
      });
      test("cssTransformed tree", function() {
        this.trans = grailss.cssTransform(this.tree);
        return assert.ok(this.trans);
      });
      test("translated tree back to src", function() {
        this.dst = grailss.toCSS(this.trans);
        return assert.ok(this.trans);
      });
      return test("parsed sub tree by rule", function() {
        var result, resultShouldBeSimilarTo;
        result = grailss.ast('color: red', 'declaration');
        resultShouldBeSimilarTo = ['Declaration', ['Property', ['Ident', 'color']], ['Value', ['S', ''], ['Ident', 'red']]];
        return assert.ok(result);
      });
    });
    return describe("Constraint Expression", function() {
      test("5 * 4 <= 10", function() {
        var result;
        result = grailss.ast('5 * 4 + 10 <= 100', 'cExpression');
        return assert.ok(result);
      });
      test("5 * (4 + 10) <= 10", function() {
        var result;
        result = grailss.ast('5 *   ( 4 + 10 ) <= 100', 'cExpression');
        return assert.ok(result);
      });
      test('10% <= 4.5em * 10 >= 10.9001px >= 1of2', function() {
        var result;
        result = grailss.ast('10% <= 4.5em * 10 >= 10.9001px >= 1of2 !strong', 'cExpression');
        return assert.ok(result);
      });
      test('#box1.left >= #box3.right !strong!100', function() {
        var result;
        result = grailss.ast('#box1.left >= #box3.right !strong!100', 'cExpression');
        return assert.ok(result);
      });
      test('$(#box1).left >= #box3.right !strong!100', function() {
        var result;
        result = grailss.ast('$(#box1).left >= #box3.right !strong!100', 'cSelector');
        return assert.ok(result);
      });
      test('Block', function() {
        var result, src;
        src = '\n1 <= #box3.width <= 100 !strong!19;\n\n10 <= $(.box).x <= 2000;';
        result = grailss.ast(src, 'grailss');
        result = grailss.Optimizer.matchAll(result, 'start');
        return assert.ok(result);
      });
      test('grailss Block', function() {
        var result, src;
        src = 'stay: #box3.width , $(.box).x;\n1 <= #box3.width <= 100 !strong!19;\n10 <= $(.box).x <= 2000;\n\nh1 {\n  font-size:10em;\n  10 <= $(.box).x <= 2000;\n}';
        result = grailss.ast(src, 'grailss');
        result = grailss.Optimizer.matchAll(result, 'start');
        return assert.ok(result);
      });
      test('grailss Block', function() {
        var result, src;
        src = 'stay: #box3.width , $(.box).x;\n1 <= #box3.width <= 100 !strong!19;\n10 <= $(.box).x <= 2000;\n\nh1 {\n  font-size:10em;\n  10 <= $(.box).x <= 2000;\n}';
        result = grailss.ast(src, 'grailss');
        result = grailss.Optimizer.matchAll(result, 'start');
        result = grailss.cssTransform(result, 'grailss');
        result = grailss.toCSS(result);
        return assert.ok(result);
      });
      test('VFL', function() {
        var result, src;
        src = 'h: |-[#box3(<=100,>=100)]-100em-| in #boxContainer;\nv: |[#box3]|;';
        result = grailss.ast(src, 'grailss');
        result = grailss.Optimizer.matchAll(result, 'start');
        return assert.ok(result);
      });
      return test('toJS', function() {
        var result, src;
        src = '#box3.x >= 100px;\n\nh: |-[#box3(<=100,>=100)]-100em-| in #boxContainer;\n\n\nh1 {\n  font-size:10em;\n  10 <= $(.box).x <= 2000;\n}\n\nv: [#b4]-| !strong!100;\nv: [#b1]-| in #panel !strong!100;\n1 <= #box3.width <= 100 !strong!19;\n\nequal-height: $(.box) #panel;\n\nh: |-[#box3].100.[#box4]| in #boxContainer;\n\nh: |[#nav_plus].-.[#nav_brand].100.[#nav_settings]| in #nav;  \n';
        result = grailss.ast(src, 'grailss');
        result = grailss.Optimizer.matchAll(result, 'start');
        result = grailss.toJS(src);
        return assert.ok(result);
      });
    });
  });

  /*
  src = 'a { color: red }'
  tree = grailss.ast(src)
  trans = grailss.cssTransform(tree)
  dst = grailss.translate(trans)
  
  LOG 'Source: '
  LOG src
  LOG 'Parsed: '
  LOG tree
  LOG 'Transformed: '
  LOG trans
  LOG 'Translated: '
  LOG dst
  */


}).call(this);
