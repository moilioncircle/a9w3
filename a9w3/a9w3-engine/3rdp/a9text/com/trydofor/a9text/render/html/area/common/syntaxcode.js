/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
*/
var AreaSyntaxCodeRender = function()
{
    var __const_htm__= {};
    __const_htm__.syntax_code = ["<table id='AREA_","area_id","' style='margin-left:","$tier","ex;' class='a9text_area_syntax' border='0' cellspacing='0' cellpadding='0'>","infostr",
                         "<tr><td class='a9text_area_syntax_border'><table border='0' cellspacing='2' cellpadding='1'><tr><td class='a9text_area_syntax_lnum' align='center' valign='top'><pre>",
                         "$num","</pre></td><td valign='top'><pre class='a9text_autoscroll'>","$text","</pre></td></tr></table></td></tr></table>"];
    __const_htm__.syntax_code$info = ["<tr><td><span class='a9text_area_syntax_info'>","infostr","&nbsp;</span></td></tr>"];
    __const_htm__.word_highlight = ["<span style='","","'>","","</span>"];
    __const_htm__.word_pairing   = ["<span id='","$id","' onclick='__A9TEXT_ASCP__.matchPairing(this)'>","","</span>"];
    
    var __word_highlight__ = [];
    var __word_pairing__   = [];
    
    // public
    this.putHighlight = function(type,color,isb,isi)
    {
        if(typeof(type) != 'string') throw "Highlight's type should be string";
        if(typeof(color) != 'string') throw "Highlight's color should be string";
        
        var style ="color:"+color;
        if(isb) style += ";font-weight:bold";
        if(isi) style += ";font-style:italic";
        
        __word_highlight__.push({'type':type,'style':style});
    }
    
    this.putPairing = function(type,pfix)
    {
        if(typeof(type) != 'string') throw "Pairing's type should be string";
        if(typeof(pfix) != 'string') throw "Pairing's pfix should be string";
        
        __word_pairing__.push({'type':type,'pfix':pfix});
    }
    
    
    this.render = function(a9dom,func)
    {
    	if(!(func instanceof Function)) throw "a9text render need callback function for async";
        
        var txt2htm = '<>';
        var __render_htm__ = [];
        var __render_seq__ = [];
    
        a9dom.nowChild(0);
        var seq = 0;
        while(a9dom.hasNext())
        {
            if(seq>0)__render_htm__.push("\n");
            var lineDom = a9dom.nextChild();
            while(lineDom.hasNext())
            {
                var wordDom = lineDom.nextChild();
                var type = wordDom.getType();
                var isNext = true;
                
                for(var i =0;i<__word_pairing__.length;i++)
                {
                    if(type == __word_pairing__[i]['type'])
                    {
                        __const_htm__.word_pairing[1] = wordDom.getInfo(A9Dom.type.area_syntax_code.pair_$serial)+__word_pairing__[i]['pfix'];
                        __const_htm__.word_pairing[3] = A9Util.txt2htm(wordDom.getText(),txt2htm);
                        
                        __render_htm__.push(__const_htm__.word_pairing.join(''));
                        isNext = false;
                        break;
                    }
                }
                
                if(!isNext) continue; // ^-^
                
                for(var i =0;i<__word_highlight__.length;i++)
                {
                    if(type == __word_highlight__[i]['type'])
                    {
                        __const_htm__.word_highlight[1] = __word_highlight__[i]['style'];
                        __const_htm__.word_highlight[3] = A9Util.txt2htm(wordDom.getText(),txt2htm);
                        __render_htm__.push(__const_htm__.word_highlight.join(''));
                        isNext = false;
                        break;
                    }
                }
                
                if(!isNext) continue; // ^-^
                __render_htm__.push(A9Util.txt2htm(wordDom.getText(),txt2htm));
            }
            
            seq++;
            var line_seq = "000"+seq;
            __render_seq__.push(line_seq.substr(line_seq.length - 3));
        }
        
        var infoStr = "&lt;<b>"+a9dom.getInfo(A9Dom.type.area$type)+"</b>&gt; ";
        var info = a9dom.getInfo(A9Dom.type.area$info);
        if(info!=null && info != "") infoStr += A9Util.txt2htm(info,txt2htm);
        __const_htm__.syntax_code$info[1] = infoStr;
        
        //
        __const_htm__.syntax_code[1] = a9dom.getId();
        __const_htm__.syntax_code[3] = a9dom.getTier();
        __const_htm__.syntax_code[5] = __const_htm__.syntax_code$info.join('');
        __const_htm__.syntax_code[7] = __render_seq__.join('\n');        
        __const_htm__.syntax_code[9] = __render_htm__.join('');
        
        a9dom.setData({'htmltext':__const_htm__.syntax_code.join(''),
	        'linkjs':[A9Conf.getConf("render.html.common.js.syntax")],
	        'linkcss':null});
        
        if(func instanceof Function)
        try{func(a9dom)}catch(e){};
    }
}