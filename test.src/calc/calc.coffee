Calc        = {}
Compiler    = Calc.Compiler   = require('./calc/compiler').Compiler
Eval        = Calc.Eval       = require('./calc/eval').Eval
Translator  = Calc.Translator = require('./calc/translator').Translator
Parser      = Calc.Parser     = require('./calc/parser').Parser

Calc.eval = (str) ->
  Calc.Eval.matchAll str, "expr"
  
Calc.ast = (str) ->
  Calc.Parser.matchAll str, "expr"

Calc.translate = (str) ->
  Calc.Translator.match str, "interp"

Calc.compile = (str) ->
  Calc.Compiler.match str, "comp"

exports.Calc = Calc 

# tree = CalcParser.matchAll('6*(4+3)', 'expr') 
# CalcInterpreter.match(tree, 'interp')
# tree = CalcParser.matchAll('6*(4+3)', 'expr') 
# code = CalcCompiler.match(tree, 'comp')
# eval(code)

