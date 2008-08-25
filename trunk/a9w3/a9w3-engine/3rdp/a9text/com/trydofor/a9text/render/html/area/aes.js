/**
UTF8(BOM)  LGPL  trydofor.com  Mar. 2008
===========================================================
*/
var AreaAesRender = function()
{
    var __const_htm__= {};
    __const_htm__.b64_box = ["<table id='AREA_","area_id","' style='margin-left:","$tier","ex;' class='a9text_area_syntax' border='0' cellspacing='0' cellpadding='0'>","infostr",
                         "<tr><td class='a9text_area_syntax_border'><table border='0' cellspacing='2' cellpadding='1'><tr><td class='a9text_area_syntax_lnum' align='center' valign='top'><pre>",
                         "$num","</pre></td><td valign='top'><pre class='a9text_autoscroll' title='click to decrypt it' onclick='__A9TEXT_AAES__.decrypt(this)'>","$text","</pre></td></tr></table></td></tr></table>"];
    __const_htm__.b64_box$info = ["<tr><td><span class='a9text_area_syntax_info'>","infostr","&nbsp;</span></td></tr>"];
    __const_htm__.b64_word = ["<span class='a9text_area_b64_word'>","word","</span>"];
        
    var txt2htm = '<>';
    
    var __linkjs__ = [];
    for(var i=1;;i++){
        var path = A9Conf.getConf("render.html.common.js.aes-"+i);
        if(path == null) break;
        __linkjs__.push(path);
    }

    // public
    this.render = function(a9dom,func)
    {
        if(a9dom == null) return;
        
        var __render_htm__ = [];
        var __render_seq__ = [];
        
        a9dom.nowChild(0);
        var seq = 0;
        while(a9dom.hasNext()){
            if(seq>0){
                __render_htm__.push("\n");
            }else{
                __render_htm__.push("--------1--------2--------3--------4--------5--------6--------7--------8\n");
                __render_seq__.push("\n");
            }
            
            var lineDom = a9dom.nextChild();
            var cnt = 0;
            while(lineDom.hasNext())
            {
                var wordDom = lineDom.nextChild();
                var wtext = wordDom.getText()+' ';
                if(cnt %2 == 0){
                    __render_htm__.push(wtext);
                }else{
                    __const_htm__.b64_word[1]=wtext;
                    __render_htm__.push(__const_htm__.b64_word.join(''));
                }
                cnt++;
            }
            
            seq++;
            var line_seq = "000"+seq;
            __render_seq__.push(line_seq.substr(line_seq.length - 3));
        }
        
        var infoStr = "&lt;<b>aes</b>&gt; ";
        var info = a9dom.getInfo(A9Dom.type.area$info);
        if(info!=null && info != "") infoStr += A9Util.txt2htm(info,txt2htm);
        __const_htm__.b64_box$info[1] = infoStr;
        
        __const_htm__.b64_box[1] = a9dom.getId();
        __const_htm__.b64_box[3] = a9dom.getTier();
        __const_htm__.b64_box[5] = __const_htm__.b64_box$info.join('');
        __const_htm__.b64_box[7] = __render_seq__.join('\n');        
        __const_htm__.b64_box[9] = __render_htm__.join('');
        
        //alert( __const_htm__.b64_box[9]);
        //
        a9dom.setData({'htmltext':__const_htm__.b64_box.join(''),'linkjs':__linkjs__,'linkcss':null});
        
        if(func instanceof Function)
        try{func(a9dom)}catch(e){};
    }
}