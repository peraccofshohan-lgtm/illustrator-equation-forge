/* EquationForge core — ES3-compatible, dependency-free. */
var EquationForgeCore = (function () {
    var MAX_TOKENS = 4096, MAX_DEPTH = 64;
    var SYMBOLS = {
        alpha:'α', beta:'β', gamma:'γ', delta:'δ', epsilon:'ε', theta:'θ', lambda:'λ', mu:'μ', pi:'π', rho:'ρ', sigma:'σ', tau:'τ', phi:'φ', psi:'ψ', omega:'ω', Delta:'Δ', Gamma:'Γ', Theta:'Θ', Lambda:'Λ', Pi:'Π', Sigma:'Σ', Phi:'Φ', Omega:'Ω', infinity:'∞', infty:'∞', times:'×', cdot:'·', div:'÷', pm:'±', mp:'∓', neq:'≠', leq:'≤', geq:'≥', approx:'≈', equiv:'≡', to:'→', rightarrow:'→', leftarrow:'←', leftrightarrow:'↔', implies:'⇒', in:'∈', notin:'∉', subset:'⊂', supset:'⊃', union:'∪', cap:'∩', forall:'∀', exists:'∃', partial:'∂', nabla:'∇', sum:'∑', prod:'∏', int:'∫', oint:'∮', degree:'°', therefore:'∴', because:'∵', ellipsis:'…'
    };
    function error(message, position) { var e = new Error(message); e.position = position || 0; return e; }
    function tokenize(source) {
        var out = [], i = 0, s = String(source || ''), n = s.length, m, two;
        while (i < n) {
            if (/\s/.test(s.charAt(i))) { i++; continue; }
            if (s.charAt(i) === '\\') {
                m = /^[A-Za-z]+/.exec(s.substring(i + 1));
                if (m) { out.push({t:'cmd', v:m[0], p:i}); i += m[0].length + 1; }
                else { if (i + 1 >= n) throw error('Incomplete escape command', i); out.push({t:'char', v:s.charAt(i + 1), p:i}); i += 2; }
            } else if ((m = /^(?:\d+\.\d*|\.\d+|\d+)/.exec(s.substring(i)))) { out.push({t:'number', v:m[0], p:i}); i += m[0].length; }
            else if ((m = /^[A-Za-z][A-Za-z0-9]*/.exec(s.substring(i)))) { out.push({t:'id', v:m[0], p:i}); i += m[0].length; }
            else {
                two = s.substr(i, 3);
                if (two === '<->' || two === '<=>') { out.push({t:'op',v:two,p:i}); i+=3; }
                else { two=s.substr(i,2); if (two==='->'||two==='<-'||two==='<= '||two==='>='||two==='!='||two==='=='||two==='<=') { out.push({t:'op',v:two,p:i}); i+=2; }
                    else { var c=s.charAt(i); if ('+-*/=<>!&|:'.indexOf(c)>=0) out.push({t:'op',v:c,p:i}); else if ('()[]{}^_,'.indexOf(c)>=0) out.push({t:c,v:c,p:i}); else if (c==='·') out.push({t:'op',v:'·',p:i}); else if (c.charCodeAt(0)>127) out.push({t:'sym',v:c,p:i}); else throw error('Unsupported character “'+c+'”',i); i++; }
                }
            }
            if (out.length > MAX_TOKENS) throw error('Expression exceeds the '+MAX_TOKENS+' token safety limit', i);
        }
        out.push({t:'eof',v:'',p:n}); return out;
    }
    function Parser(tokens) { this.a=tokens; this.i=0; this.depth=0; }
    Parser.prototype.peek=function(){return this.a[this.i];};
    Parser.prototype.take=function(){return this.a[this.i++];};
    Parser.prototype.accept=function(t,v){var q=this.peek(); if(q.t===t && (v===undefined||q.v===v)){this.i++;return q;} return null;};
    Parser.prototype.need=function(t,v,label){var q=this.accept(t,v);if(!q)throw error('Expected '+(label||v||t),this.peek().p);return q;};
    Parser.prototype.expression=function(min, stop) {
        var left, q, right, op, prec, implicit, start;
        this.depth++; if(this.depth>MAX_DEPTH) throw error('Expression nesting exceeds '+MAX_DEPTH+' levels',this.peek().p);
        left=this.prefix();
        while (true) {
            q=this.peek(); if(q.t==='eof'||(stop&&stop[q.t+':'+q.v])) break;
            if(q.t==='^'||q.t==='_') { if(40<min)break; this.take(); right=this.scriptArgument(); left={type:'script',base:left,sub:q.t==='_'?right:null,sup:q.t==='^'?right:null}; continue; }
            if(q.t==='(' && left.type==='symbol' && /^(sin|cos|tan|log|ln|exp|max|min|det|tr|lim)$/.test(left.value)) {
                this.take(); var arg=this.expression(0,{'):)':1,',:,':1}); this.need(')',')','closing parenthesis'); left={type:left.value==='lim'?'limit':'function',name:left.value,arg:arg}; continue;
            }
            prec=this.precedence(q); implicit=false;
            if(prec<0) { if(this.startsAtom(q)) { prec=20; implicit=true; } else break; }
            if(prec<min)break;
            if(!implicit)this.take(); op=implicit?'':q.v;
            right=this.expression(prec+(op==='^'?0:1),stop);
            left=op==='/'?{type:'fraction',num:left,den:right}:{type:'binary',op:op,left:left,right:right,implicit:implicit};
        }
        this.depth--; return left;
    };
    Parser.prototype.precedence=function(q){if(q.t!=='op')return -1; if(q.v==='='||q.v==='!='||q.v==='=='||q.v==='<'||q.v==='>'||q.v==='<='||q.v==='>='||q.v==='->'||q.v==='<-'||q.v==='<->'||q.v==='<=>')return 5; if(q.v==='+'||q.v==='-')return 10; if(q.v==='*'||q.v==='/'||q.v==='·'||q.v==='×')return 20; return -1;};
    Parser.prototype.startsAtom=function(q){return q.t==='number'||q.t==='id'||q.t==='cmd'||q.t==='('||q.t==='{'||q.t==='[';};
    Parser.prototype.prefix=function(){
        var q=this.take(), arg, name, args, a, b;
        if(q.t==='number')return {type:'text',value:q.v,kind:'number'};
        if(q.t==='sym')return {type:'symbol',value:q.v,name:q.v};
        if(q.t==='id') {
            name=q.v;
            if(this.accept('(','(')) {
                args=[];
                if(!this.accept(')',')')) { do { args.push(this.expression(0,{',:,':1,'):)':1})); } while(this.accept(',',',')); this.need(')',')','closing parenthesis'); }
                return this.callNode(name,args,q.p);
            }
            if(/^\d/.test(name))return {type:'text',value:name};
            return {type:'text',value:name,kind:'identifier'};
        }
        if(q.t==='cmd') { name=q.v; if(SYMBOLS[name]) return {type:'symbol',value:SYMBOLS[name],name:name}; if(name==='frac') {a=this.groupArgument(); b=this.groupArgument(); return {type:'fraction',num:a,den:b};} if(name==='sqrt') { if(this.accept('[','[')){arg=this.expression(0,{']:]':1});this.need(']',']');a=arg;} else a={type:'text',value:'2'}; b=this.groupArgument(); return {type:'root',index:a,radicand:b}; } if(name==='text')return {type:'text',value:this.groupText()}; throw error('Unsupported command \\'+name,q.p); }
        if(q.t==='('||q.t==='{'||q.t==='[') { var close=q.t==='('?')':(q.t==='{'?'}':']'); arg=this.expression(0,{}); this.need(close,close,'closing '+close); return {type:'group',open:q.v,close:close,body:arg}; }
        if(q.t==='op'&&(q.v==='-'||q.v==='+'))return {type:'unary',op:q.v,arg:this.expression(30,{})};
        if(q.t==='eof')throw error('Expected an expression',q.p);
        throw error('Unexpected token “'+q.v+'”',q.p);
    };
    Parser.prototype.groupArgument=function(){var q=this.peek(); if(q.t==='{')return this.prefix(); if(q.t==='(')return this.prefix(); return this.prefix();};
    Parser.prototype.groupText=function(){var q=this.need('{','{','text group'),s='';while(this.peek().t!=='}'&&this.peek().t!=='eof')s+=this.take().v;this.need('}','}');return s;};
    Parser.prototype.scriptArgument=function(){if(this.peek().t==='{')return this.prefix(); if(this.peek().t==='(')return this.prefix(); return this.prefix();};
    Parser.prototype.callNode=function(name,args,pos){
        var expected={frac:2,root:2,sqrt:1,cbrt:1,abs:1,norm:1,vec:1,det:1,sum:3,prod:3,int:4,lim:2,matrix:1,cases:1,hat:1,bar:1,overline:1,underline:1,binom:2};
        if(expected[name]!==undefined&&args.length!==expected[name])throw error(name+'() expects '+expected[name]+' argument'+(expected[name]===1?'':'s'),pos);
        if(name==='frac'||name==='binom')return {type:'fraction',num:args[0],den:args[1],binomial:name==='binom'};
        if(name==='sqrt'||name==='cbrt'||name==='root')return {type:'root',index:name==='cbrt'?{type:'text',value:'3'}:(name==='root'?args[0]:{type:'text',value:'2'}),radicand:name==='root'?args[1]:args[0]};
        if(name==='sum'||name==='prod'||name==='int')return {type:'bigop',name:name,lower:args[0],upper:args[1],body:args[2],differential:args[3]||null};
        if(name==='lim')return {type:'limit',lower:args[0],body:args[1]};
        if(name==='matrix')return {type:'matrix',body:args[0]};
        if(name==='cases')return {type:'cases',body:args[0]};
        if(name==='abs'||name==='norm')return {type:'fence',kind:name,body:args[0]};
        if(name==='vec'||name==='hat'||name==='bar'||name==='overline'||name==='underline')return {type:'accent',kind:name,body:args[0]};
        if(name==='det')return {type:'fence',kind:'det',body:args[0]};
        return {type:'function',name:name,arg:args[0]||{type:'sequence',children:args}};
    };
    function parse(source){var p=new Parser(tokenize(source)),ast=p.expression(0,{});if(p.peek().t!=='eof')throw error('Unexpected token “'+p.peek().v+'”',p.peek().p);validate(ast);return ast;}
    function scriptText(n){if(n.type==='group')return '{'+toText(n.body)+'}';if(n.type==='binary'||n.type==='fraction')return '{'+toText(n)+'}';return toText(n);}
    function toText(n){var t=n.type;if(t==='text'||t==='symbol')return n.value;if(t==='group')return n.open+toText(n.body)+n.close;if(t==='unary')return n.op+toText(n.arg);if(t==='binary')return toText(n.left)+(n.implicit?'':n.op)+toText(n.right);if(t==='fraction')return 'frac('+toText(n.num)+','+toText(n.den)+')';if(t==='root')return 'root('+toText(n.index)+','+toText(n.radicand)+')';if(t==='script')return toText(n.base)+(n.sub?'_'+scriptText(n.sub):'')+(n.sup?'^'+scriptText(n.sup):'');if(t==='function')return n.name+'('+toText(n.arg)+')';if(t==='limit')return 'lim('+toText(n.lower)+','+toText(n.body)+')';if(t==='bigop')return n.name+'('+toText(n.lower)+','+toText(n.upper)+','+toText(n.body)+(n.differential?','+toText(n.differential):'')+')';if(t==='fence')return n.kind+'('+toText(n.body)+')';if(t==='accent')return n.kind+'('+toText(n.body)+')';if(t==='matrix')return 'matrix('+toText(n.body)+')';if(t==='cases')return 'cases('+toText(n.body)+')';return '';}
    function validate(ast){var count=0,errs=[];function walk(n,d){if(!n||typeof n!=='object'){errs.push('Invalid node');return;}if(++count>10000){errs.push('Equation exceeds 10,000 nodes');return;}if(d>MAX_DEPTH){errs.push('Equation nesting exceeds '+MAX_DEPTH);return;}var k,i;for(k in n)if(n.hasOwnProperty(k)){if(k==='type')continue;if(n[k]&&typeof n[k]==='object'){if(n[k] instanceof Array){for(i=0;i<n[k].length;i++)walk(n[k][i],d+1);}else if(n[k].type)walk(n[k],d+1);}}}walk(ast,0);if(errs.length)throw error(errs[0],0);return true;}
    function escapeJSON(s){return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\r/g,'\\r').replace(/\n/g,'\\n');}
    function stringify(ast){validate(ast);return '{"format":"eqforge","version":1,"source":"'+escapeJSON(toText(ast))+'"}';}
    function deserialize(s){var m=/"format"\s*:\s*"eqforge"/.test(s),q=/"source"\s*:\s*"((?:\\.|[^"\\])*)"/.exec(s);if(!m||!q)throw error('Not a supported EquationForge equation file',0);var src=q[1].replace(/\\n/g,'\n').replace(/\\r/g,'\r').replace(/\\"/g,'"').replace(/\\\\/g,'\\');return parse(src);}
    function searchSymbols(query){var out=[],q=String(query||'').toLowerCase(),k;for(k in SYMBOLS)if(SYMBOLS.hasOwnProperty(k)&&(k.toLowerCase().indexOf(q)>=0||SYMBOLS[k].indexOf(q)>=0))out.push({name:k,value:SYMBOLS[k]});return out;}
    return {parse:parse,tokenize:tokenize,toText:toText,validate:validate,stringify:stringify,deserialize:deserialize,searchSymbols:searchSymbols,symbols:SYMBOLS,version:'0.1.0'};
}());
