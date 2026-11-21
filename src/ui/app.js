/* EquationForge UI and Illustrator adapter — ES3-compatible. */
(function () {
    var VERSION = '0.1.0';
    var DEFAULTS = {font:'Arial',size:24,color:[0,0,0],spacing:1.0};
    function rgb(a) { var c=new RGBColor();c.red=a[0];c.green=a[1];c.blue=a[2];return c; }
    function textBox(group, value, x, y, size, font) {
        var tf=group.textFrames.add();tf.contents=String(value);tf.position=[x,y];
        try { tf.textRange.characterAttributes.size=size; tf.textRange.characterAttributes.textFont=app.textFonts.getByName(font); } catch(e) { try { tf.textRange.characterAttributes.size=size; } catch(ignored) {} }
        try { tf.textRange.characterAttributes.fillColor=rgb(DEFAULTS.color); } catch(e2) {}
        return {w:Math.max(size*.32,String(value).length*size*.58),h:size*1.25,base:size*.82};
    }
    function draw(group,n,x,y,size,font) {
        var t=n.type,a,b,w,gap,base;
        if(t==='text'||t==='symbol') return textBox(group,n.value,x,y,size,font);
        if(t==='group') {a=textBox(group,n.open,x,y,size,font);b=draw(group,n.body,x+a.w,y,size,font);var c=textBox(group,n.close,x+a.w+b.w,y,size,font);return {w:a.w+b.w+c.w,h:Math.max(a.h,b.h),base:size*.82};}
        if(t==='unary') {a=textBox(group,n.op,x,y,size,font);b=draw(group,n.arg,x+a.w,y,size,font);return {w:a.w+b.w,h:Math.max(a.h,b.h),base:size*.82};}
        if(t==='binary') {a=draw(group,n.left,x,y,size,font);gap=n.implicit?0:size*.24;var op=n.implicit?{w:0,h:size,base:size*.8}:textBox(group,n.op,x+a.w+gap,y,size,font);b=draw(group,n.right,x+a.w+gap+op.w+gap,y,size,font);return {w:a.w+gap+op.w+gap+b.w,h:Math.max(a.h,b.h),base:size*.82};}
        if(t==='fraction') {a=draw(group,n.num,x+size*.25,y+size*.25,size*.78,font);b=draw(group,n.den,x+size*.25,y-size*.86,size*.78,font);w=Math.max(a.w,b.w)+size*.5;var p=group.pathItems.add();p.setEntirePath([[x,y-size*.14],[x+w,y-size*.14]]);p.stroked=true;p.filled=false;p.strokeWidth=Math.max(.6,size*.045);return {w:w,h:a.h+b.h+size*.5,base:size*.82};}
        if(t==='root') {var root=textBox(group,'√',x,y,size*1.15,font);a=draw(group,n.radicand,x+root.w-size*.12,y,size,font);var path=group.pathItems.add();path.setEntirePath([[x+root.w-size*.08,y-size*.08],[x+root.w+size*.04,y-size*.35],[x+root.w+size*.18,y+size*.25],[x+root.w+a.w,y+size*.25]]);path.stroked=true;path.filled=false;path.strokeWidth=Math.max(.6,size*.045);return {w:root.w+a.w,h:Math.max(root.h,a.h+size*.25),base:size*.82};}
        if(t==='script') {a=draw(group,n.base,x,y,size,font);w=a.w;if(n.sub){b=draw(group,n.sub,x+w,y-size*.28,size*.62,font);w+=b.w;}if(n.sup){b=draw(group,n.sup,x+w-(n.sub?b.w:0),y+size*.42,size*.62,font);w=Math.max(w,a.w+b.w);}return {w:w,h:size*1.65,base:size*.82};}
        if(t==='function') {a=textBox(group,n.name,x,y,size,font);b=draw(group,n.arg,x+a.w+size*.12,y,size,font);return {w:a.w+b.w+size*.12,h:Math.max(a.h,b.h),base:size*.82};}
        if(t==='limit') {a=textBox(group,'lim',x,y,size,font);b=draw(group,n.lower,x+size*.1,y-size*.5,size*.62,font);var d=draw(group,n.body,x+a.w+size*.35,y,size,font);return {w:a.w+size*.35+d.w,h:Math.max(a.h,b.h),base:size*.82};}
        if(t==='bigop') {var sym=n.name==='sum'?'∑':(n.name==='prod'?'∏':'∫');a=textBox(group,sym,x,y,size*1.5,font);if(n.lower)draw(group,n.lower,x,y-size*.55,size*.55,font);if(n.upper)draw(group,n.upper,x+size*.45,y+size*.55,size*.55,font);b=draw(group,n.body,x+a.w+size*.12,y,size,font);return {w:a.w+b.w+size*.12,h:size*1.8,base:size*.82};}
        if(t==='fence'||t==='accent') {var l=n.kind==='abs'?'|':(n.kind==='norm'?'‖':(n.kind==='det'?'|':''));a=l?textBox(group,l,x,y,size,font):{w:0,h:size,base:size*.82};b=draw(group,n.body,x+a.w,y,size,font);var r=l?textBox(group,l,x+a.w+b.w,y,size,font):{w:0};if(t==='accent'){var mark=n.kind==='vec'?'→':(n.kind==='hat'?'ˆ':(n.kind==='bar'||n.kind==='overline'?'¯':'_'));textBox(group,mark,x+a.w,y+size*.42, size*.8,font);}return {w:a.w+b.w+r.w,h:Math.max(a.h,b.h),base:size*.82};}
        if(t==='matrix'||t==='cases') {return textBox(group,t==='matrix'?'[ '+EquationForgeCore.toText(n.body)+' ]':'{ '+EquationForgeCore.toText(n.body)+' }',x,y,size,font);}
        return textBox(group,EquationForgeCore.toText(n),x,y,size,font);
    }
    function insertEquation(ast) {
        if(!app.documents.length)throw new Error('Open an Illustrator document before inserting an equation.');
        var doc=app.activeDocument, layer=doc.activeLayer, group=null, bounds, x,y;
        try { group=layer.groupItems.add();group.name='EquationForge Equation';bounds=doc.artboards[doc.artboards.getActiveArtboardIndex()].artboardRect;x=bounds[0]+(bounds[2]-bounds[0])*.5;y=bounds[1]-(bounds[1]-bounds[3])*.35;draw(group,ast,x,y,DEFAULTS.size,DEFAULTS.font);return group; }
        catch(e){if(group)try{group.remove();}catch(ignore){}throw e;}
    }
    function show() {
        var win=new Window('dialog','EquationForge — Ultimate Equation & Scientific Typesetting System');win.orientation='column';win.alignChildren=['fill','top'];win.spacing=8;win.margins=12;win.preferredSize=[680,620];
        var header=win.add('group');header.orientation='column';header.alignChildren=['left','top'];header.add('statictext',undefined,'EQUATIONFORGE  ·  '+VERSION);header.add('statictext',undefined,'Type an expression, use a template, preview it, then insert native Illustrator artwork.');
        var tabs=win.add('tabbedpanel');tabs.alignChildren=['fill','fill'];tabs.preferredSize=[650,420];
        var home=tabs.add('tab',undefined,'Equation');home.orientation='column';home.alignChildren=['fill','top'];
        home.add('statictext',undefined,'Typing editor  ·  syntax: frac(a,b), sqrt(x), x^2, x_1, sum(i=1,n,i^2), int(a,b,f(x),dx)');
        var input=home.add('edittext',undefined,'frac(a+b,c) + sqrt(x^2)',{multiline:true,scrolling:true});input.preferredSize=[620,88];
        var row=home.add('group');row.add('statictext',undefined,'Font size');var sizeField=row.add('edittext',undefined,'24');sizeField.characters=5;row.add('statictext',undefined,'Font');var fontField=row.add('edittext',undefined,'Arial');fontField.characters=18;
        row.add('statictext',undefined,'Preview (syntax)');
        var preview=home.add('edittext',undefined,'',{multiline:true,readonly:true,scrolling:true});preview.preferredSize=[620,60];
        var errorLine=home.add('statictext',undefined,'Ready.');
        var quick=home.add('group');quick.add('statictext',undefined,'Insert starter:');
        var quickNames=['frac(a,b)','sqrt(x)','root(3,x)','vec(v)','abs(x)','sum(i=1,n,i)','int(a,b,f(x),dx)'];
        var i;for(i=0;i<quickNames.length;i++)(function(v){var b=quick.add('button',undefined,v);b.onClick=function(){var s=input.text,at=input.active?input.selection:null;input.text=s+(s?' + ':'')+v;refresh();input.active=true;};}(quickNames[i]));
        var symTab=tabs.add('tab',undefined,'Symbols');symTab.orientation='column';symTab.alignChildren=['fill','top'];symTab.add('statictext',undefined,'Offline symbol search by command name or character. Click a result to append its command.');
        var search=symTab.add('edittext',undefined,'alpha');search.characters=36;var results=symTab.add('listbox',undefined,[],{multiselect:false});results.preferredSize=[600,280];
        var tmplTab=tabs.add('tab',undefined,'Templates');tmplTab.orientation='column';tmplTab.alignChildren=['fill','top'];tmplTab.add('statictext',undefined,'Validated starter expressions. Choose one to edit it in the shared typing model.');
        var templates=[['Quadratic formula','x = (-b + sqrt(b^2 - 4ac))/(2a)'],['Pythagorean theorem','a^2 + b^2 = c^2'],['Derivative definition','lim(h->0,(f(x+h)-f(x))/h)'],['Definite integral','int(a,b,f(x),dx)'],['Summation','sum(i=1,n,i^2)'],['Ideal gas law','PV = nRT'],['Water formation','2H2 + O2 -> 2H2O'],['Matrix','matrix(A)']];
        for(i=0;i<templates.length;i++)(function(t){var b=tmplTab.add('button',undefined,t[0]+'   ·   '+t[1]);b.onClick=function(){input.text=t[1];tabs.selection=home;refresh();};}(templates[i]));
        var helpTab=tabs.add('tab',undefined,'Help');helpTab.orientation='column';helpTab.alignChildren=['fill','top'];
        helpTab.add('statictext',undefined,'Supported core syntax', {multiline:true});helpTab.add('statictext',undefined,'Arithmetic, grouping, implicit multiplication, scripts, frac(a,b), sqrt(x), cbrt(x), root(n,x), abs(x), norm(x), vec(x), sum(lower,upper,body), prod(lower,upper,body), int(lower,upper,body,dx), lim(condition,body), Greek commands such as \\alpha and relations such as \\leq. This is a defined subset, not full LaTeX.',{multiline:true});
        helpTab.add('statictext',undefined,'Output uses native Illustrator text and vector strokes for fraction bars and radical geometry. Matrices and some advanced nodes currently use editable text fallback. Font glyph coverage depends on installed fonts. Use Save/Load for .eqforge syntax files.');
        var footer=win.add('group');footer.alignment='right';var undo=footer.add('button',undefined,'Undo');var redo=footer.add('button',undefined,'Redo');var save=footer.add('button',undefined,'Save…');var load=footer.add('button',undefined,'Open…');var insert=footer.add('button',undefined,'Insert into Illustrator');var close=footer.add('button',undefined,'Close');
        var history=[],hindex=-1,changing=false;
        function record(){if(changing)return;if(hindex<0||history[hindex]!==input.text){history=history.slice(0,hindex+1);history.push(input.text);if(history.length>80)history.shift();hindex=history.length-1;}}
        function refresh(){try{var ast=EquationForgeCore.parse(input.text);EquationForgeCore.validate(ast);var z=parseFloat(sizeField.text);if(isNaN(z)||z<4||z>300)throw new Error('Font size must be between 4 and 300 pt.');DEFAULTS.size=z;DEFAULTS.font=fontField.text||'Arial';preview.text=EquationForgeCore.toText(ast);errorLine.text='Valid expression · native output estimate · '+preview.text.length+' characters';errorLine.graphics.foregroundColor=errorLine.graphics.newPen(errorLine.graphics.PenType.SOLID_COLOR,[0.1,0.45,0.2,1],1);record();return ast;}catch(e){preview.text='';errorLine.text='Syntax: '+e.message+(e.position!==undefined?' (position '+e.position+')':'');errorLine.graphics.foregroundColor=errorLine.graphics.newPen(errorLine.graphics.PenType.SOLID_COLOR,[0.7,0.12,0.12,1],1);return null;}}
        input.onChanging=refresh;sizeField.onChange=refresh;fontField.onChange=refresh;
        function fillResults(){results.removeAll();var a=EquationForgeCore.searchSymbols(search.text),j;for(j=0;j<a.length;j++)results.add('item','\\'+a[j].name+'     '+a[j].value);}
        search.onChanging=fillResults;fillResults();results.onDoubleClick=function(){if(results.selection){input.text+=' \\'+results.selection.text.split(' ')[0].replace(/^\\/,'');refresh();}};
        undo.onClick=function(){if(hindex>0){hindex--;changing=true;input.text=history[hindex];changing=false;refresh();}};redo.onClick=function(){if(hindex<history.length-1){hindex++;changing=true;input.text=history[hindex];changing=false;refresh();}};
        save.onClick=function(){var f=File.saveDialog('Save EquationForge equation','EquationForge equation:*.eqforge');if(!f)return;try{var ast=EquationForgeCore.parse(input.text);if(!f.name.match(/\.eqforge$/i))f=new File(f.fsName+'.eqforge');f.encoding='UTF-8';if(!f.open('w'))throw new Error('Could not open file for writing.');f.write(EquationForgeCore.stringify(ast));f.close();errorLine.text='Saved '+f.fsName;}catch(e){alert('Save failed: '+e.message);}};
        load.onClick=function(){var f=File.openDialog('Open EquationForge equation','EquationForge equation:*.eqforge');if(!f)return;try{f.encoding='UTF-8';if(!f.open('r'))throw new Error('Could not open file.');var data=f.read();f.close();input.text=EquationForgeCore.toText(EquationForgeCore.deserialize(data));refresh();}catch(e){alert('Open failed: '+e.message);}};
        insert.onClick=function(){var ast=refresh();if(!ast)return;try{insertEquation(ast);errorLine.text='Equation inserted as grouped Illustrator artwork.';}catch(e){alert('Insert failed: '+e.message);}};
        close.onClick=function(){win.close();};win.onShow=refresh;win.center();win.show();
    }
    try { show(); } catch(e) { alert('EquationForge could not start: '+e.message); }
}());
