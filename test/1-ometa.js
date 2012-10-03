(function() {
  var Calc, ometa;

  require('../global');

  require('./config');

  ometa = require('ometajs');

  Calc = require("../lib/calc").Calc;

  describe("Ometa", function() {
    beforeEach(function() {
      this.ast = ometa.BSJSParser.matchAll('var x = 1', 'topLevel');
      return this.code = ometa.BSJSTranslator.matchAll([this.ast], 'trans');
    });
    test("ometa exists", function() {
      return assert.ok(ometa);
    });
    test("ometa.translateCode exists", function() {
      return assert.ok(ometa.translateCode);
    });
    test("ometa.evalCode exists", function() {
      return assert.ok(ometa.evalCode);
    });
    return test("ometa js translator", function() {
      return assert.equal(this.code, 'var x = (1)');
    });
  });

  describe("Calc", function() {
    test("Calc.eval?", function() {
      return assert.ok(Calc["eval"]);
    });
    test("Calc.eval 6*(4+3) is 42", function() {
      return assert.equal(Calc["eval"]('6*(4+3)'), 42);
    });
    test("Calc.ast 6*(4+3)", function() {
      var ast;
      ast = Calc.ast('6*(4+3)');
      return assert.equal(ast.toString(), ['mul', ['num', 6], ['add', ['num', 4], ['num', 3]]].toString());
    });
    test("Calc.translate Calc.ast '6*(4+3)'  is 42", function() {
      var ast, r;
      ast = Calc.ast('6*(4+3)');
      r = Calc.translate(ast);
      return assert.equal(r, 42);
    });
    return test("Calc.translate Calc.ast '6*(4+3)'  is 42", function() {
      var ast, r;
      ast = Calc.ast('6*(4+3)');
      r = Calc.compile(ast);
      return assert.equal(r, '(6*(4+3))');
    });
  });

}).call(this);
