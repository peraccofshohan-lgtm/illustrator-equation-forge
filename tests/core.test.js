/* Node-based regression suite for the ES3 parser/core. */
var fs=require('fs'),vm=require('vm'),assert=require('assert');
var context={};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/../src/core/engine.js','utf8'),context);
var C=context.EquationForgeCore;
var good=['x^2','x_1','x_{n+1}','(a+b)/(c+d)','sqrt(x)','cbrt(x)','root(4,x)','frac(a+1,b-1)','sum(i=1,n,i^2)','prod(i=1,n,i)','int(a,b,f(x),dx)','lim(x->0,sin(x)/x)','2H2 + O2 -> 2H2O','\\alpha + \\beta <= \\infty','abs(x)+norm(v)','x_i^2'];
good.forEach(function(s){var ast=C.parse(s);assert(C.validate(ast));assert(C.toText(ast).length>0);var copy=C.deserialize(C.stringify(ast));assert(C.validate(copy));});
[['frac(a)','frac()','sqrt(','x + )','\\unknown','(a+b','x @ y','matrix([[a,b],[c,d]])']].forEach(function(list){list.forEach(function(s){assert.throws(function(){C.parse(s);},'expected invalid input: '+s);});});
assert.strictEqual(C.searchSymbols('ALPHA')[0].value,'α');
assert(C.tokenize('x + y').length===4);
var long='x';for(var i=0;i<100;i++)long+='^2';assert.throws(function(){C.parse(long);});
console.log('EquationForge core: '+good.length+' valid-expression cases and invalid/stress cases passed.');
