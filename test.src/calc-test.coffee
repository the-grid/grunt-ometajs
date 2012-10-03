require '../global'
require './config'
ometa = require 'ometajs'
Calc = require("../lib/calc").Calc

describe "Ometa", ->
  beforeEach ->
    @ast = ometa.BSJSParser.matchAll('var x = 1', 'topLevel')
    @code = ometa.BSJSTranslator.matchAll([@ast], 'trans')
    
  test "ometa exists", ->      
    assert.ok ometa
  
  # Translates .ometajs code into javascript
  test "ometa.translateCode exists", ->
    assert.ok ometa.translateCode
  
  # Translates and evaluates ometajs code
  test "ometa.evalCode exists", ->
    assert.ok ometa.evalCode 
    
  test "ometa js translator", ->
    assert.equal @code, 'var x = (1)'


describe "Calc", ->
  
  test "Calc.eval?", ->
    assert.ok Calc.eval
  
  test "Calc.eval 6*(4+3) is 42", ->
    assert.equal Calc.eval('6*(4+3)'), 42
    
  test "Calc.ast 6*(4+3)", ->
    ast = Calc.ast '6*(4+3)'
    assert.equal ast.toString(), [ 'mul', [ 'num', 6 ], [ 'add', [ 'num', 4 ], [ 'num', 3 ] ] ].toString()
  
  test "Calc.translate Calc.ast '6*(4+3)'  is 42", ->
    ast = Calc.ast '6*(4+3)'
    r = Calc.translate(ast)
    assert.equal r, 42      
  
  test "Calc.translate Calc.ast '6*(4+3)'  is 42", ->
    ast = Calc.ast '6*(4+3)'
    r = Calc.compile(ast)
    assert.equal r, '(6*(4+3))'